import { describe, expect, it } from 'vitest'
import { emptyAlphabetProgress, loadAlphabetProgress, normalizeAlphabetProgress, normalizeWordProgress, saveAlphabetProgress } from './alphabetProgress'

describe('alphabet progress', () => {
  it('restores valid progress and removes invalid or duplicate entries', () => {
    expect(normalizeAlphabetProgress({ currentIndex: 3, completed: [0, 1, 1, 51, 52, -1, '2'] })).toEqual({ currentIndex: 3, completed: [0, 1, 51] })
  })
  it('recovers safely from malformed records', () => {
    expect(normalizeAlphabetProgress(null)).toEqual(emptyAlphabetProgress())
    expect(normalizeAlphabetProgress({ currentIndex: 999, completed: 'bad' })).toEqual(emptyAlphabetProgress())
  })
  it('validates word progress using the word level length', () => {
    expect(normalizeWordProgress({ currentIndex: 11, completed: [0, 11, 12, 51] })).toEqual({ currentIndex: 11, completed: [0, 11] })
    expect(normalizeWordProgress({ currentIndex: 12, completed: [] }).currentIndex).toBe(0)
  })
  it('reports storage being unavailable rather than claiming progress was saved', async () => {
    await expect(loadAlphabetProgress()).rejects.toThrow('Local storage is unavailable')
    await expect(saveAlphabetProgress(emptyAlphabetProgress())).rejects.toThrow('Local storage is unavailable')
  })
})
