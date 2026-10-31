import { useEffect, useRef, type PointerEvent as ReactPointerEvent } from 'react'
import { normalizeGuidePoint, normalizePoint, renderStrokes, type Stroke } from '../../engine/drawing'

export type CanvasView = { scale: number; x: number; y: number }
type Gesture = { ids: [number, number]; startDistance: number; startMidpoint: { x: number; y: number }; startView: CanvasView; bounds: DOMRect }
type PanDrag = { pointerId: number; startPoint: { x: number; y: number }; startView: CanvasView; bounds: DOMRect }
type Props = { strokes: Stroke[]; color: string; size: number; tool: Stroke['tool']; onStroke: (stroke: Stroke) => void; guided?: boolean; view?: CanvasView; panMode?: boolean; onViewChange?: (view: CanvasView) => void }

const minZoom = 0.5
const maxZoom = 4
const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value))

function midpoint(a: { x: number; y: number }, b: { x: number; y: number }) {
  return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }
}

function distance(a: { x: number; y: number }, b: { x: number; y: number }) {
  return Math.hypot(a.x - b.x, a.y - b.y)
}

export function DrawingCanvas({ strokes, color, size, tool, onStroke, guided = false, view = { scale: 1, x: 0, y: 0 }, panMode = false, onViewChange }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const active = useRef<{ pointerId: number; stroke: Stroke } | null>(null)
  const touches = useRef(new Map<number, { x: number; y: number }>())
  const consumedTouches = useRef(new Set<number>())
  const gesture = useRef<Gesture | null>(null)
  const panDrag = useRef<PanDrag | null>(null)
  const latest = useRef({ strokes, color, size, tool, onStroke, view, panMode, onViewChange })
  latest.current = { strokes, color, size, tool, onStroke, view, panMode, onViewChange }
  const paint = useRef<() => void>(() => {})

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const context = canvas.getContext('2d')
    if (!context) return
    const redraw = () => {
      const width = canvas.clientWidth
      const height = canvas.clientHeight
      if (!width || !height) return
      const ratio = window.devicePixelRatio || 1
      const pixelWidth = Math.round(width * ratio)
      const pixelHeight = Math.round(height * ratio)
      if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
        canvas.width = pixelWidth
        canvas.height = pixelHeight
      }
      context.setTransform(ratio, 0, 0, ratio, 0, 0)
      renderStrokes(context, active.current ? [...latest.current.strokes, active.current.stroke] : latest.current.strokes, width, height, guided)
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

  function handleTouchDown(event: ReactPointerEvent<HTMLCanvasElement>) {
    if (event.pointerType !== 'touch' || !latest.current.onViewChange) return false
    const point = { x: event.clientX, y: event.clientY }
    touches.current.set(event.pointerId, point)
    if (gesture.current || panDrag.current) {
      consumedTouches.current.add(event.pointerId)
      return true
    }
    if (latest.current.panMode) {
      consumedTouches.current.add(event.pointerId)
      beginPan(event.pointerId, point)
      return true
    }
    if (touches.current.size < 2) return false

    const [firstId, secondId] = [...touches.current.keys()].slice(0, 2)
    const first = touches.current.get(firstId)!
    const second = touches.current.get(secondId)!
    const canvas = canvasRef.current
    const viewport = canvas?.closest('.paper')
    if (!canvas || !viewport) return false
    if (active.current) active.current = null
    paint.current()
    consumedTouches.current.add(firstId)
    consumedTouches.current.add(secondId)
    gesture.current = {
      ids: [firstId, secondId],
      startDistance: Math.max(1, distance(first, second)),
      startMidpoint: midpoint(first, second),
      startView: latest.current.view,
      bounds: viewport.getBoundingClientRect(),
    }
    return true
  }

  function beginPan(pointerId: number, point: { x: number; y: number }) {
    const canvas = canvasRef.current
    const viewport = canvas?.closest('.paper')
    if (!viewport) return
    if (active.current) active.current = null
    paint.current()
    panDrag.current = { pointerId, startPoint: point, startView: latest.current.view, bounds: viewport.getBoundingClientRect() }
  }

  function updatePanDrag(event: ReactPointerEvent<HTMLCanvasElement>) {
    const drag = panDrag.current
    if (!drag || drag.pointerId !== event.pointerId) return false
    const maxX = Math.max(0, (drag.bounds.width * (drag.startView.scale - 1)) / 2)
    const maxY = Math.max(0, (drag.bounds.height * (drag.startView.scale - 1)) / 2)
    latest.current.onViewChange?.({
      scale: drag.startView.scale,
      x: clamp(drag.startView.x + event.clientX - drag.startPoint.x, -maxX, maxX),
      y: clamp(drag.startView.y + event.clientY - drag.startPoint.y, -maxY, maxY),
    })
    return true
  }

  function updateTouchGesture(event: ReactPointerEvent<HTMLCanvasElement>) {
    if (event.pointerType !== 'touch' || !latest.current.onViewChange) return false
    if (touches.current.has(event.pointerId)) touches.current.set(event.pointerId, { x: event.clientX, y: event.clientY })
    if (updatePanDrag(event)) return true
    const currentGesture = gesture.current
    if (!currentGesture || !currentGesture.ids.includes(event.pointerId)) return consumedTouches.current.has(event.pointerId)
    const first = touches.current.get(currentGesture.ids[0])
    const second = touches.current.get(currentGesture.ids[1])
    if (!first || !second) return true
    const center = { x: currentGesture.bounds.left + currentGesture.bounds.width / 2, y: currentGesture.bounds.top + currentGesture.bounds.height / 2 }
    const start = currentGesture.startMidpoint
    const now = midpoint(first, second)
    const scale = clamp(currentGesture.startView.scale * distance(first, second) / currentGesture.startDistance, minZoom, maxZoom)
    const worldAnchorX = (start.x - center.x - currentGesture.startView.x) / currentGesture.startView.scale
    const worldAnchorY = (start.y - center.y - currentGesture.startView.y) / currentGesture.startView.scale
    const maxPanX = Math.max(0, (currentGesture.bounds.width * (scale - 1)) / 2)
    const maxPanY = Math.max(0, (currentGesture.bounds.height * (scale - 1)) / 2)
    latest.current.onViewChange({
      scale,
      x: clamp(now.x - center.x - worldAnchorX * scale, -maxPanX, maxPanX),
      y: clamp(now.y - center.y - worldAnchorY * scale, -maxPanY, maxPanY),
    })
    return true
  }

  function endTouchGesture(pointerId: number) {
    if (panDrag.current?.pointerId === pointerId) {
      panDrag.current = null
      consumedTouches.current.delete(pointerId)
      touches.current.delete(pointerId)
      return true
    }
    if (gesture.current?.ids.includes(pointerId)) {
      const remaining = gesture.current.ids.filter((id) => id !== pointerId)
      gesture.current = null
      touches.current.delete(pointerId)
      consumedTouches.current.delete(pointerId)
      remaining.forEach((id) => consumedTouches.current.add(id))
      return true
    }
    if (consumedTouches.current.has(pointerId)) {
      consumedTouches.current.delete(pointerId)
      touches.current.delete(pointerId)
      return true
    }
    touches.current.delete(pointerId)
    return false
  }

  return <canvas
    ref={canvasRef}
    className={`drawing-canvas ${panMode ? 'pan-mode' : ''}`}
    aria-label="Drawing canvas. Draw with a finger, stylus, or mouse."
    onContextMenu={(event) => event.preventDefault()}
    onDragStart={(event) => event.preventDefault()}
    onPointerDown={(event) => {
      if (event.pointerType === 'mouse' && event.button !== 0) return
      event.preventDefault()
      event.currentTarget.setPointerCapture(event.pointerId)
      if (handleTouchDown(event)) return
      if (active.current) return
      if (latest.current.panMode && latest.current.onViewChange) {
        beginPan(event.pointerId, { x: event.clientX, y: event.clientY })
        return
      }
      const { color: currentColor, size: currentSize, tool: currentTool } = latest.current
      active.current = { pointerId: event.pointerId, stroke: { color: currentColor, width: currentSize, tool: currentTool, points: [pointAt(event.clientX, event.clientY, event.currentTarget.getBoundingClientRect())] } }
      paint.current()
    }}
    onPointerMove={(event) => {
      if (event.pointerType === 'touch') event.preventDefault()
      if (updatePanDrag(event)) return
      if (updateTouchGesture(event)) return
      if (active.current?.pointerId !== event.pointerId) return
      event.preventDefault()
      const rect = event.currentTarget.getBoundingClientRect()
      const samples = event.nativeEvent.getCoalescedEvents?.() ?? [event.nativeEvent]
      for (const sample of samples.length ? samples : [event.nativeEvent]) active.current.stroke.points.push(pointAt(sample.clientX, sample.clientY, rect))
      paint.current()
    }}
    onPointerUp={(event) => {
      if (event.pointerType === 'touch' && endTouchGesture(event.pointerId)) return
      if (panDrag.current?.pointerId === event.pointerId) { panDrag.current = null; return }
      if (active.current?.pointerId === event.pointerId) {
        const point = pointAt(event.clientX, event.clientY, event.currentTarget.getBoundingClientRect())
        const last = active.current.stroke.points.at(-1)
        if (!last || last.x !== point.x || last.y !== point.y) active.current.stroke.points.push(point)
      }
      finish(event.pointerId)
    }}
    onPointerCancel={(event) => {
      if (event.pointerType === 'touch' && endTouchGesture(event.pointerId)) return
      if (panDrag.current?.pointerId === event.pointerId) { panDrag.current = null; return }
      finish(event.pointerId)
    }}
    onLostPointerCapture={(event) => {
      if (event.pointerType === 'touch' && endTouchGesture(event.pointerId)) return
      if (panDrag.current?.pointerId === event.pointerId) { panDrag.current = null; return }
      finish(event.pointerId)
    }}
  />
}
