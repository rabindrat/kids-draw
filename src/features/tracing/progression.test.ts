import { describe, expect, it } from 'vitest'
import { nextIncompleteStep } from './progression'

describe('alphabet progression', () => {
  it('continues to the next unfinished letter and skips completed ones', () => {
    expect(nextIncompleteStep(0, [0, 1], 6)).toBe(2)
    expect(nextIncompleteStep(2, [0, 1, 2], 6)).toBe(3)
  })
  it('wraps after the last letter when earlier letters are unfinished', () => {
    expect(nextIncompleteStep(5, [0, 1, 5], 6)).toBe(2)
  })
  it('does not advance when all letters have been practiced', () => {
    expect(nextIncompleteStep(5, [0, 1, 2, 3, 4, 5], 6)).toBeNull()
  })
})
