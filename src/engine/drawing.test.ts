import { describe, expect, it } from 'vitest'
import { addStroke, emptyHistory, normalizePoint, redo, undo, type Stroke } from './drawing'

const stroke = (x: number): Stroke => ({ points: [{ x, y: 0.5 }], color: '#123456', width: 0.02, tool: 'brush' })

describe('drawing history', () => {
  it('undoes and redoes completed strokes in order', () => {
    const history = addStroke(addStroke(emptyHistory(), stroke(0.1)), stroke(0.2))
    const undone = undo(undo(history))
    expect(undone.strokes).toEqual([])
    expect(redo(redo(undone)).strokes).toEqual(history.strokes)
  })
  it('discards the redo branch after a new stroke', () => {
    const history = addStroke(undo(addStroke(emptyHistory(), stroke(0.1))), stroke(0.3))
    expect(redo(history)).toEqual(history)
    expect(history.strokes).toEqual([stroke(0.3)])
  })
  it('keeps empty history unchanged', () => {
    const history = emptyHistory()
    expect(undo(history)).toBe(history)
    expect(redo(history)).toBe(history)
    expect(addStroke(history, { ...stroke(0), points: [] })).toBe(history)
  })
  it('retains editable stroke data through JSON serialization', () => {
    const history = addStroke(emptyHistory(), stroke(0.4))
    expect(JSON.parse(JSON.stringify(history))).toEqual(history)
  })
})

describe('coordinate normalization', () => {
  it('accounts for canvas position and dimensions and clamps outside points', () => {
    const rect = { left: 20, top: 10, width: 200, height: 100 }
    expect(normalizePoint(120, 35, rect)).toEqual({ x: 0.5, y: 0.25 })
    expect(normalizePoint(-10, 200, rect)).toEqual({ x: 0, y: 1 })
  })
})
