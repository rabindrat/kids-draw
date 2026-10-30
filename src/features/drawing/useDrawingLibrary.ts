import { useEffect, useRef, useState } from 'react'
import { loadDrawing, saveDrawing, type Drawing } from '../../storage/drawings'

type SaveStatus = 'saving' | 'saved' | 'error'

// This hook lives in App so unsaved work remains in memory even when leaving the canvas.
export function useDrawingLibrary(enabled: boolean) {
  const [selectedId, setSelectedId] = useState('freehand')
  const [drawings, setDrawings] = useState<Record<string, Drawing>>({})
  const drawingsRef = useRef(drawings)
  const [statuses, setStatuses] = useState<Record<string, SaveStatus>>({})
  const generations = useRef<Record<string, number>>({})
  const [loadErrors, setLoadErrors] = useState<Record<string, boolean>>({})
  const [retryCount, setRetryCount] = useState(0)

  useEffect(() => {
    if (!enabled || drawingsRef.current[selectedId]) return
    let cancelled = false
    loadDrawing(selectedId).then((drawing) => {
      if (cancelled) return
      drawingsRef.current = { ...drawingsRef.current, [selectedId]: drawing }
      setDrawings(drawingsRef.current)
      setLoadErrors((current) => ({ ...current, [selectedId]: false }))
    }).catch(() => { if (!cancelled) setLoadErrors((current) => ({ ...current, [selectedId]: true })) })
    return () => { cancelled = true }
  }, [enabled, selectedId, retryCount])

  function persist(drawing: Drawing) {
    const generation = (generations.current[drawing.id] ?? 0) + 1
    generations.current[drawing.id] = generation
    setStatuses((current) => ({ ...current, [drawing.id]: 'saving' }))
    void saveDrawing(drawing).then(() => {
      if (generations.current[drawing.id] === generation) setStatuses((current) => ({ ...current, [drawing.id]: 'saved' }))
    }).catch(() => {
      if (generations.current[drawing.id] === generation) setStatuses((current) => ({ ...current, [drawing.id]: 'error' }))
    })
  }

  function update(change: (drawing: Drawing) => Drawing) {
    const current = drawingsRef.current[selectedId]
    if (!current) return
    const next = change(current)
    drawingsRef.current = { ...drawingsRef.current, [selectedId]: next }
    setDrawings(drawingsRef.current)
    persist(next)
  }

  function retry() {
    const drawing = drawingsRef.current[selectedId]
    if (drawing) persist(drawing)
    else { setLoadErrors((current) => ({ ...current, [selectedId]: false })); setRetryCount((count) => count + 1) }
  }

  return { selectedId, select: setSelectedId, drawing: drawings[selectedId], status: statuses[selectedId], loadError: loadErrors[selectedId], update, retry }
}
