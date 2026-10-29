import { describe, expect, it } from 'vitest'
import { clampDrag, nearestEdge, toolbarLayout } from './toolbarLayout'

const home = { x: 16, y: 16, width: 44, height: 44 }
const viewport = { width: 1024, height: 768 }

describe('toolbar placement', () => {
  it('reserves stable strips along the chosen edge', () => {
    expect(toolbarLayout('top', Infinity, 8, 8, viewport, home)).toMatchObject({ x: 616, y: 12, width: 396, height: 88, horizontal: true })
    expect(toolbarLayout('left', 0, 8, 8, viewport, home)).toMatchObject({ x: 12, y: 68, width: 88, height: 396, horizontal: false })
    expect(toolbarLayout('bottom', Infinity, 8, 8, viewport, home).y).toBe(668)
    expect(toolbarLayout('right', 0, 8, 8, viewport, home).x).toBe(924)
  })
  it('limits strip length and indicates when scrolling is needed', () => {
    const horizontal = toolbarLayout('top', Infinity, 8, 8, { width: 360, height: 768 }, home)
    expect(horizontal).toMatchObject({ perLine: 6, width: 264, height: 88, colorOverflow: true, toolOverflow: true })
    const vertical = toolbarLayout('right', 0, 8, 8, { width: 1024, height: 400 }, home)
    expect(vertical).toMatchObject({ perLine: 7, width: 88, height: 308, colorOverflow: true, toolOverflow: true })
  })
  it('snaps to the nearest edge and avoids the home button while dragging', () => {
    expect(nearestEdge({ x: 800, y: 150, width: 180, height: 44 }, viewport)).toBe('right')
    const position = clampDrag({ x: 16, y: 16 }, { width: 176, height: 44 }, viewport, home)
    expect(position.x >= home.x + home.width + 8 || position.y >= home.y + home.height + 8).toBe(true)
  })
})
