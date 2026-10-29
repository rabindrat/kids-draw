import { useLayoutEffect, useRef, useState, type ReactNode, type RefObject } from 'react'
import { Icon } from '../../components/Icon'
import { clampDrag, nearestEdge, toolbarLayout, type Edge, type Position, type Rect } from './toolbarLayout'

const initialHome = { x: 16, y: 16, width: 44, height: 44 }

export function FloatingToolbar({ children, colors, colorCount, toolCount, homeRef }: { children: ReactNode; colors: ReactNode; colorCount: number; toolCount: number; homeRef: RefObject<HTMLButtonElement | null> }) {
  const panelRef = useRef<HTMLElement>(null)
  const drag = useRef<{ id: number; offsetX: number; offsetY: number; startX: number; startY: number; moved: boolean; last: Position; scrollable: boolean; pointerType: string } | null>(null)
  const suppressClick = useRef(false)
  const [edge, setEdge] = useState<Edge>('top')
  const [offset, setOffset] = useState(Infinity)
  const [dragPosition, setDragPosition] = useState<Position | null>(null)
  const [expanded, setExpanded] = useState(true)
  const [viewport, setViewport] = useState(() => ({ width: window.innerWidth, height: window.innerHeight }))
  const [home, setHome] = useState<Rect>(initialHome)

  useLayoutEffect(() => {
    const update = () => {
      setViewport({ width: window.innerWidth, height: window.innerHeight })
      const rect = homeRef.current?.getBoundingClientRect()
      if (rect) setHome({ x: rect.left, y: rect.top, width: rect.width, height: rect.height })
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [homeRef])

  const layout = toolbarLayout(edge, offset, colorCount, toolCount, viewport, home)
  const position = dragPosition ?? layout

  return <aside ref={panelRef} className={`floating-toolbar edge-${edge}`} tabIndex={0} aria-label="Drawing tools. Drag to move, or focus this group and use arrow keys to move to an edge." style={{ left: position.x, top: position.y, right: 'auto', width: layout.width, height: layout.height }} onKeyDown={(event) => {
    if (event.target !== event.currentTarget) return
    const edges: Record<string, Edge> = { ArrowUp: 'top', ArrowDown: 'bottom', ArrowLeft: 'left', ArrowRight: 'right' }
    if (!edges[event.key]) return
    event.preventDefault()
    setEdge(edges[event.key])
    setOffset(edges[event.key] === 'top' || edges[event.key] === 'bottom' ? position.x : position.y)
  }} onPointerDown={(event) => {
    if (drag.current || (event.pointerType === 'mouse' && event.button !== 0)) return
    const rect = panelRef.current?.getBoundingClientRect()
    if (!rect || !(event.target instanceof Element)) return
    suppressClick.current = false
    event.target.setPointerCapture(event.pointerId)
    drag.current = { id: event.pointerId, offsetX: event.clientX - rect.left, offsetY: event.clientY - rect.top, startX: event.clientX, startY: event.clientY, moved: false, last: { x: rect.left, y: rect.top }, scrollable: !!event.target.closest('[data-scrollable="true"]'), pointerType: event.pointerType }
  }} onPointerMove={(event) => {
    const current = drag.current
    if (!current || current.id !== event.pointerId) return
    if (!current.moved && Math.hypot(event.clientX - current.startX, event.clientY - current.startY) < 7) return
    const dx = Math.abs(event.clientX - current.startX)
    const dy = Math.abs(event.clientY - current.startY)
    if (!current.moved && current.scrollable && current.pointerType === 'touch' && (layout.horizontal ? dx > dy : dy > dx)) {
      drag.current = null
      return
    }
    current.moved = true
    event.preventDefault()
    current.last = clampDrag({ x: event.clientX - current.offsetX, y: event.clientY - current.offsetY }, layout, viewport, home)
    setDragPosition(current.last)
  }} onPointerUp={(event) => {
    const current = drag.current
    if (!current || current.id !== event.pointerId) return
    suppressClick.current = current.moved
    if (current.moved) {
      const nextEdge = nearestEdge({ ...current.last, width: layout.width, height: layout.height }, viewport)
      setEdge(nextEdge)
      setOffset(nextEdge === 'top' || nextEdge === 'bottom' ? current.last.x : current.last.y)
      setDragPosition(null)
    }
    drag.current = null
  }} onPointerCancel={(event) => { if (drag.current?.id === event.pointerId) { drag.current = null; setDragPosition(null) } }} onLostPointerCapture={(event) => { if (drag.current?.id === event.pointerId) { drag.current = null; setDragPosition(null) } }} onClickCapture={(event) => {
    if (suppressClick.current && event.detail !== 0) { event.preventDefault(); event.stopPropagation() }
    suppressClick.current = false
  }}>
    <div className="toolbar-colors" data-scrollable={layout.colorOverflow}>{colors}</div>
    <div className="toolbar-actions">
      <button className="toolbar-toggle" aria-label={expanded ? 'Minimize drawing tools' : 'Expand drawing tools'} aria-expanded={expanded} aria-controls="drawing-tools-content" onClick={() => setExpanded(!expanded)}><Icon name={expanded ? 'minimize' : 'expand'}/></button>
      <div id="drawing-tools-content" className="toolbar-content" data-scrollable={layout.toolOverflow} hidden={!expanded}>{children}</div>
    </div>
  </aside>
}
