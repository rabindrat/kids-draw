import { describe, expect, it } from 'vitest'
import { words } from './words'

describe('word practice content', () => {
  it('provides distinct short words with a guide for every letter', () => {
    expect(words.length).toBeGreaterThan(0)
    expect(new Set(words.map((item) => item.word)).size).toBe(words.length)
    for (const item of words) {
      expect(item.word).toMatch(/^[a-z]{2,4}$/)
      expect(item.width).toBe(item.word.length * 80)
      for (let index = 0; index < item.word.length; index++) expect(item.paths.some((path) => path.offsetX === index * 80)).toBe(true)
    }
  })
})
