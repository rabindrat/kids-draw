import { describe, expect, it } from 'vitest'
import { evaluateTracing } from './evaluate'
import type { Point, Stroke } from '../../engine/drawing'

const line: Point[] = Array.from({ length: 21 }, (_, i) => ({ x: 0.2 + i * 0.03, y: 0.5 }))
const stroke = (points: Point[]): Stroke => ({ tool: 'brush', color: '#000', width: 0.02, points })

describe('forgiving tracing feedback', () => {
  it('accepts a nearby continuous trace even with sparse pointer samples', () => {
    expect(evaluateTracing([stroke([{ x: 0.2, y: 0.54 }, { x: 0.8, y: 0.54 }])], [line]).complete).toBe(true)
  })
  it('does not accept a partial trace or a line away from the guide', () => {
    expect(evaluateTracing([stroke([{ x: 0.2, y: 0.5 }, { x: 0.4, y: 0.5 }])], [line]).complete).toBe(false)
    expect(evaluateTracing([stroke([{ x: 0.2, y: 0.1 }, { x: 0.8, y: 0.1 }])], [line]).complete).toBe(false)
  })
  it('uses the board aspect ratio when judging wide word guides', () => {
    const vertical = Array.from({ length: 21 }, (_, i) => ({ x: 0.5, y: 0.2 + i * 0.03 }))
    const trace = [stroke([{ x: 0.53, y: 0.2 }, { x: 0.53, y: 0.8 }])]
    expect(evaluateTracing(trace, [vertical], 1).complete).toBe(true)
    expect(evaluateTracing(trace, [vertical], 4).complete).toBe(false)
  })
  it('does not count eraser strokes as tracing', () => {
    expect(evaluateTracing([{ ...stroke(line), tool: 'eraser' }], [line]).complete).toBe(false)
  })
  it('requires an attempt at each separate part of a letter', () => {
    const crossbar = [{ x: 0.5, y: 0.2 }, { x: 0.5, y: 0.3 }]
    expect(evaluateTracing([stroke(line)], [line, crossbar]).complete).toBe(false)
  })
})
