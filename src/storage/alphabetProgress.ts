import { words } from '../content/words'

export type AlphabetProgress = { currentIndex: number; completed: number[] }
export const emptyAlphabetProgress = (): AlphabetProgress => ({ currentIndex: 0, completed: [] })

function normalizeProgress(value: unknown, count: number): AlphabetProgress {
  if (!value || typeof value !== 'object') return emptyAlphabetProgress()
  const record = value as Record<string, unknown>
  const currentIndex = typeof record.currentIndex === 'number' && Number.isInteger(record.currentIndex) && record.currentIndex >= 0 && record.currentIndex < count ? record.currentIndex : 0
  const completed = Array.isArray(record.completed) ? [...new Set(record.completed.filter((item): item is number => typeof item === 'number' && Number.isInteger(item) && item >= 0 && item < count))] : []
  return { currentIndex, completed }
}
export const normalizeAlphabetProgress = (value: unknown): AlphabetProgress => normalizeProgress(value, 52)
export const normalizeWordProgress = (value: unknown): AlphabetProgress => normalizeProgress(value, words.length)
export const normalizeDigitProgress = (value: unknown): AlphabetProgress => normalizeProgress(value, 10)

export function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') { reject(new Error('Local storage is unavailable')); return }
    const request = indexedDB.open('little-lines', 1)
    let blocked = false
    request.onupgradeneeded = () => { if (!request.result.objectStoreNames.contains('progress')) request.result.createObjectStore('progress') }
    request.onblocked = () => { blocked = true; reject(new Error('Local storage is blocked')) }
    request.onerror = () => reject(request.error ?? new Error('Could not open local storage'))
    request.onsuccess = () => { if (blocked) request.result.close(); else resolve(request.result) }
  })
}

async function loadProgress(key: string, normalize: (value: unknown) => AlphabetProgress): Promise<AlphabetProgress> {
  const db = await openDatabase()
  return new Promise((resolve, reject) => {
    const transaction = db.transaction('progress', 'readonly')
    const request = transaction.objectStore('progress').get(key)
    let result: unknown
    request.onsuccess = () => { result = request.result }
    transaction.oncomplete = () => { db.close(); resolve(normalize(result)) }
    transaction.onabort = transaction.onerror = () => { db.close(); reject(transaction.error ?? new Error('Could not read progress')) }
  })
}

async function saveProgress(key: string, progress: AlphabetProgress, normalize: (value: unknown) => AlphabetProgress): Promise<void> {
  const db = await openDatabase()
  return new Promise((resolve, reject) => {
    const transaction = db.transaction('progress', 'readwrite')
    transaction.objectStore('progress').put(normalize(progress), key)
    transaction.oncomplete = () => { db.close(); resolve() }
    transaction.onabort = transaction.onerror = () => { db.close(); reject(transaction.error ?? new Error('Could not save progress')) }
  })
}

// Keep writes ordered even if a child switches levels while a save is pending.
const pendingWrites = new Map<string, Promise<void>>()
async function loadAfterWrites(key: string, normalize: (value: unknown) => AlphabetProgress): Promise<AlphabetProgress> {
  await pendingWrites.get(key)?.catch(() => {})
  return loadProgress(key, normalize)
}
function queueSave(key: string, progress: AlphabetProgress, normalize: (value: unknown) => AlphabetProgress): Promise<void> {
  const previous = pendingWrites.get(key)
  const next = (previous ? previous.catch(() => {}) : Promise.resolve()).then(() => saveProgress(key, progress, normalize))
  pendingWrites.set(key, next)
  const clear = () => { if (pendingWrites.get(key) === next) pendingWrites.delete(key) }
  void next.then(clear, clear)
  return next
}

// Separate keys preserve the existing alphabet record and make the two levels independent.
export const loadAlphabetProgress = () => loadAfterWrites('alphabet', normalizeAlphabetProgress)
export const saveAlphabetProgress = (progress: AlphabetProgress) => queueSave('alphabet', progress, normalizeAlphabetProgress)
export const loadWordProgress = () => loadAfterWrites('words', normalizeWordProgress)
export const saveWordProgress = (progress: AlphabetProgress) => queueSave('words', progress, normalizeWordProgress)
export const loadDigitProgress = () => loadAfterWrites('digits', normalizeDigitProgress)
export const saveDigitProgress = (progress: AlphabetProgress) => queueSave('digits', progress, normalizeDigitProgress)
