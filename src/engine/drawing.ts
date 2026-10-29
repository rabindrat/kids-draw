export type Point = { x: number; y: number }
export type Stroke = { points: Point[]; color: string; width: number; tool: 'brush' | 'eraser' }
export type History = { strokes: Stroke[]; undone: Stroke[] }

export const emptyHistory = (): History => ({ strokes: [], undone: [] })
export function addStroke(history: History, stroke: Stroke): History {
  if (!stroke.points.length) return history
  return { strokes: [...history.strokes, stroke], undone: [] }
}
export function undo(history: History): History {
  const stroke = history.strokes.at(-1)
  return stroke ? { strokes: history.strokes.slice(0, -1), undone: [...history.undone, stroke] } : history
}
export function redo(history: History): History {
  const stroke = history.undone.at(-1)
  return stroke ? { strokes: [...history.strokes, stroke], undone: history.undone.slice(0, -1) } : history
}
export function normalizePoint(clientX: number, clientY: number, rect: Pick<DOMRect, 'left' | 'top' | 'width' | 'height'>): Point {
  return {
    x: Math.max(0, Math.min(1, (clientX - rect.left) / (rect.width || 1))),
    y: Math.max(0, Math.min(1, (clientY - rect.top) / (rect.height || 1))),
  }
}

export function renderStrokes(ctx: CanvasRenderingContext2D, strokes: Stroke[], width: number, height: number): void {
  ctx.clearRect(0, 0, width, height)
  for (const stroke of strokes) {
    if (!stroke.points.length) continue
    ctx.save()
    ctx.globalCompositeOperation = stroke.tool === 'eraser' ? 'destination-out' : 'source-over'
    ctx.strokeStyle = stroke.color
    ctx.fillStyle = stroke.color
    ctx.lineWidth = stroke.width * Math.min(width, height)
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    const first = stroke.points[0]
    ctx.beginPath()
    if (stroke.points.length === 1) {
      ctx.arc(first.x * width, first.y * height, ctx.lineWidth / 2, 0, Math.PI * 2)
      ctx.fill()
    } else {
      ctx.moveTo(first.x * width, first.y * height)
      for (const point of stroke.points.slice(1)) ctx.lineTo(point.x * width, point.y * height)
      ctx.stroke()
    }
    ctx.restore()
  }
}
