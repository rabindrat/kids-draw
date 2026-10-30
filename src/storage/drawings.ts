import { emptyHistory, type History, type Stroke } from '../engine/drawing'
import { openDatabase } from './alphabetProgress'

export type Drawing = { version: 1; id: string; history: History; opacity: number }
export const emptyDrawing = (id: string): Drawing => ({ version: 1, id, history: emptyHistory(), opacity: 0.3 })

function validStroke(value: unknown): value is Stroke {
  if (!value || typeof value !== 'object') return false
  const stroke = value as Stroke
  return (stroke.tool === 'brush' || stroke.tool === 'eraser') && typeof stroke.color === 'string' && /^#[\da-f]{6}$/i.test(stroke.color)
    && typeof stroke.width === 'number' && Number.isFinite(stroke.width) && stroke.width > 0
    && Array.isArray(stroke.points) && stroke.points.length > 0 && stroke.points.every((point) => point && Number.isFinite(point.x) && Number.isFinite(point.y))
}

export function readDrawing(value: unknown, id: string): Drawing {
  if (value === undefined) return emptyDrawing(id)
  if (!value || typeof value !== 'object') throw new Error('Invalid drawing')
  const drawing = value as Drawing
  if (drawing.version !== 1 || drawing.id !== id || !drawing.history || !Array.isArray(drawing.history.strokes) || !drawing.history.strokes.every(validStroke)
    || !Array.isArray(drawing.history.undone) || !drawing.history.undone.every(validStroke)
    || typeof drawing.opacity !== 'number' || !Number.isFinite(drawing.opacity) || drawing.opacity < 0 || drawing.opacity > 1) throw new Error('Invalid drawing')
  return drawing
}

const pendingWrites = new Map<string, Promise<void>>()
const keyFor = (id: string) => `drawing:${id}`

export async function loadDrawing(id: string): Promise<Drawing> {
  await pendingWrites.get(id)?.catch(() => {})
  const db = await openDatabase()
  return new Promise((resolve, reject) => {
    const transaction = db.transaction('progress', 'readonly')
    const request = transaction.objectStore('progress').get(keyFor(id))
    let result: unknown
    request.onsuccess = () => { result = request.result }
    transaction.oncomplete = () => { db.close(); try { resolve(readDrawing(result, id)) } catch (error) { reject(error) } }
    transaction.onabort = transaction.onerror = () => { db.close(); reject(transaction.error ?? new Error('Could not read drawing')) }
  })
}

function writeDrawing(drawing: Drawing): Promise<void> {
  return openDatabase().then((db) => new Promise<void>((resolve, reject) => {
    const transaction = db.transaction('progress', 'readwrite')
    transaction.objectStore('progress').put(drawing, keyFor(drawing.id))
    transaction.oncomplete = () => { db.close(); resolve() }
    transaction.onabort = transaction.onerror = () => { db.close(); reject(transaction.error ?? new Error('Could not save drawing')) }
  }))
}

export function saveDrawing(drawing: Drawing): Promise<void> {
  const previous = pendingWrites.get(drawing.id)
  const next = (previous ? previous.catch(() => {}) : Promise.resolve()).then(() => writeDrawing(drawing))
  pendingWrites.set(drawing.id, next)
  const clear = () => { if (pendingWrites.get(drawing.id) === next) pendingWrites.delete(drawing.id) }
  void next.then(clear, clear)
  return next
}
