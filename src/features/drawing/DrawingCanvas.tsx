import { useEffect, useRef } from 'react'
import { normalizeGuidePoint, normalizePoint, renderStrokes, type Stroke } from '../../engine/drawing'

type Props = { strokes: Stroke[]; color: string; size: number; tool: Stroke['tool']; onStroke: (stroke: Stroke) => void; guided?: boolean }

export function DrawingCanvas({ strokes, color, size, tool, onStroke, guided = false }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const active = useRef<{ pointerId: number; stroke: Stroke } | null>(null)
  const latest = useRef({ strokes, color, size, tool, onStroke })
  latest.current = { strokes, color, size, tool, onStroke }
  const paint = useRef<() => void>(() => {})

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const context = canvas.getContext('2d')
    if (!context) return
    const redraw = () => {
      const rect = canvas.getBoundingClientRect()
      if (!rect.width || !rect.height) return
      const ratio = window.devicePixelRatio || 1
      const pixelWidth = Math.round(rect.width * ratio)
      const pixelHeight = Math.round(rect.height * ratio)
      if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
        canvas.width = pixelWidth
        canvas.height = pixelHeight
      }
      context.setTransform(ratio, 0, 0, ratio, 0, 0)
      renderStrokes(context, active.current ? [...latest.current.strokes, active.current.stroke] : latest.current.strokes, rect.width, rect.height, guided)
    }
    paint.current = redraw
    const observer = new ResizeObserver(redraw)
    observer.observe(canvas)
    // Older iPad Safari versions can still start a browser gesture during multi-touch.
    const preventTouchGesture = (event: TouchEvent) => { if (event.cancelable) event.preventDefault() }
    canvas.addEventListener('touchmove', preventTouchGesture, { passive: false })
    redraw()
    return () => { observer.disconnect(); canvas.removeEventListener('touchmove', preventTouchGesture); paint.current = () => {} }
  }, [guided])
  useEffect(() => { paint.current() }, [strokes])
  const pointAt = guided ? normalizeGuidePoint : normalizePoint

  function finish(pointerId: number) {
    if (active.current?.pointerId !== pointerId) return
    const stroke = active.current.stroke
    active.current = null
    latest.current.onStroke(stroke)
  }

  return <canvas
    ref={canvasRef}
    className="drawing-canvas"
    aria-label="Drawing canvas. Draw with a finger, stylus, or mouse."
    onContextMenu={(event) => event.preventDefault()}
    onDragStart={(event) => event.preventDefault()}
    onPointerDown={(event) => {
      if (event.pointerType === 'touch') event.preventDefault()
      if (active.current || (event.pointerType === 'mouse' && event.button !== 0)) return
      event.preventDefault()
      event.currentTarget.setPointerCapture(event.pointerId)
      const { color: currentColor, size: currentSize, tool: currentTool } = latest.current
      active.current = { pointerId: event.pointerId, stroke: { color: currentColor, width: currentSize, tool: currentTool, points: [pointAt(event.clientX, event.clientY, event.currentTarget.getBoundingClientRect())] } }
      paint.current()
    }}
    onPointerMove={(event) => {
      if (event.pointerType === 'touch') event.preventDefault()
      if (active.current?.pointerId !== event.pointerId) return
      event.preventDefault()
      const rect = event.currentTarget.getBoundingClientRect()
      const samples = event.nativeEvent.getCoalescedEvents?.() ?? [event.nativeEvent]
      for (const sample of samples.length ? samples : [event.nativeEvent]) active.current.stroke.points.push(pointAt(sample.clientX, sample.clientY, rect))
      paint.current()
    }}
    onPointerUp={(event) => {
      if (active.current?.pointerId === event.pointerId) {
        const point = pointAt(event.clientX, event.clientY, event.currentTarget.getBoundingClientRect())
        const last = active.current.stroke.points.at(-1)
        if (!last || last.x !== point.x || last.y !== point.y) active.current.stroke.points.push(point)
      }
      finish(event.pointerId)
    }}
    onPointerCancel={(event) => finish(event.pointerId)}
    onLostPointerCapture={(event) => finish(event.pointerId)}
  />
}
