import { describe, expect, it } from 'vitest'
import { emptyDrawing, loadDrawing, readDrawing, saveDrawing } from './drawings'

const stroke = { color: '#d45f64', width: 0.018, tool: 'brush' as const, points: [{ x: -0.1, y: 1.1 }] }

describe('saved drawings', () => {
  it('starts an independent empty drawing when no record exists', () => {
    expect(readDrawing(undefined, 'sun')).toEqual(emptyDrawing('sun'))
  })
  it('restores strokes, undo history, and reference opacity', () => {
    const drawing = { ...emptyDrawing('sun'), history: { strokes: [stroke], undone: [stroke] }, opacity: 0.65 }
    expect(readDrawing(drawing, 'sun')).toEqual(drawing)
  })
  it('refuses to overwrite malformed or mismatched records', () => {
    expect(() => readDrawing({ ...emptyDrawing('sun'), opacity: 2 }, 'sun')).toThrow('Invalid drawing')
    expect(() => readDrawing(emptyDrawing('house'), 'sun')).toThrow('Invalid drawing')
    expect(() => readDrawing({ ...emptyDrawing('sun'), history: { strokes: [{ ...stroke, points: [{ x: NaN, y: 0 }] }], undone: [] } }, 'sun')).toThrow('Invalid drawing')
  })
  it('reports unavailable storage instead of pretending to save', async () => {
    await expect(loadDrawing('sun')).rejects.toThrow('Local storage is unavailable')
    await expect(saveDrawing(emptyDrawing('sun'))).rejects.toThrow('Local storage is unavailable')
  })
})
