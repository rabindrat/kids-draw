export type Edge = 'top' | 'right' | 'bottom' | 'left'
export type Position = { x: number; y: number }
export type Viewport = { width: number; height: number }
export type Rect = Position & { width: number; height: number }

const margin = 12
const gap = 8
const buttonSize = 44
const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(value, Math.max(min, max)))

export function toolbarLayout(edge: Edge, offset: number, colorCount: number, toolCount: number, viewport: Viewport, home: Rect) {
  const horizontal = edge === 'top' || edge === 'bottom'
  // Reserve the home button's row or column so the two controls can never overlap.
  const minX = Math.max(margin, home.x + home.width + gap)
  const minY = Math.max(margin, home.y + home.height + gap)
  const available = horizontal ? viewport.width - minX - margin : viewport.height - minY - margin
  // Keep both strips the same size regardless of whether the tools are expanded.
  const perLine = Math.min(Math.max(colorCount, toolCount + 1), Math.max(1, Math.floor(available / buttonSize)))
  const width = (horizontal ? perLine : 2) * buttonSize
  const height = (horizontal ? 2 : perLine) * buttonSize
  const x = horizontal ? clamp(offset, minX, viewport.width - width - margin) : edge === 'left' ? margin : Math.max(margin, viewport.width - width - margin)
  const y = horizontal ? edge === 'top' ? margin : Math.max(margin, viewport.height - height - margin) : clamp(offset, minY, viewport.height - height - margin)
  return { x, y, width, height, perLine, horizontal, colorOverflow: colorCount > perLine, toolOverflow: toolCount + 1 > perLine }
}

export function nearestEdge(rect: Rect, viewport: Viewport): Edge {
  const distances: Array<[Edge, number]> = [
    ['top', rect.y], ['right', viewport.width - rect.x - rect.width],
    ['bottom', viewport.height - rect.y - rect.height], ['left', rect.x],
  ]
  return distances.reduce((best, item) => item[1] < best[1] ? item : best)[0]
}

export function clampDrag(position: Position, size: { width: number; height: number }, viewport: Viewport, home: Rect): Position {
  const x = clamp(position.x, margin, viewport.width - size.width - margin)
  const y = clamp(position.y, margin, viewport.height - size.height - margin)
  const overlapsHome = x < home.x + home.width + gap && x + size.width > home.x - gap && y < home.y + home.height + gap && y + size.height > home.y - gap
  if (!overlapsHome) return { x, y }
  const right = home.x + home.width + gap
  const below = home.y + home.height + gap
  if (right + size.width <= viewport.width - margin && (below + size.height > viewport.height - margin || right - x < below - y)) return { x: right, y }
  if (below + size.height <= viewport.height - margin) return { x, y: below }
  return { x, y }
}
