import { describe, expect, it } from 'vitest'
import { alphabet } from './alphabet'

describe('alphabet templates', () => {
  it('covers A to Z with both uppercase and lowercase paths', () => {
    expect(alphabet.map((item) => item.letter).join('')).toBe('ABCDEFGHIJKLMNOPQRSTUVWXYZ')
    for (const item of alphabet) {
      expect(item.uppercase.length).toBeGreaterThan(0)
      expect(item.lowercase.length).toBeGreaterThan(0)
      for (const path of [...item.uppercase, ...item.lowercase]) expect(path).toMatch(/^M\s*\d/)
    }
  })
})
