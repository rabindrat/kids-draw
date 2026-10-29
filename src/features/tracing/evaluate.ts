import type { Point, Stroke } from '../../engine/drawing'

const sampleSpacing = 0.012
const tolerance = 0.09

function sampleStroke(points: Point[], aspectRatio: number): Point[] {
  if (!points.length) return []
  const samples = [points[0]]
  for (let i = 1; i < points.length; i++) {
    const start = points[i - 1]
    const end = points[i]
    const steps = Math.max(1, Math.ceil(Math.hypot((end.x - start.x) * aspectRatio, end.y - start.y) / sampleSpacing))
    for (let j = 1; j <= steps; j++) samples.push({ x: start.x + (end.x - start.x) * j / steps, y: start.y + (end.y - start.y) * j / steps })
  }
  return samples
}

function near(point: Point, others: Point[], aspectRatio: number): boolean {
  return others.some((other) => Math.hypot((point.x - other.x) * aspectRatio, point.y - other.y) <= tolerance)
}

// This is intentionally forgiving practice feedback, not handwriting assessment.
export function evaluateTracing(strokes: Stroke[], paths: Point[][], aspectRatio = 1): { complete: boolean; coverage: number; accuracy: number } {
  const drawing = strokes.filter((stroke) => stroke.tool === 'brush').flatMap((stroke) => sampleStroke(stroke.points, aspectRatio))
  const guide = paths.flat()
  if (!drawing.length || !guide.length) return { complete: false, coverage: 0, accuracy: 0 }
  const coverage = guide.filter((point) => near(point, drawing, aspectRatio)).length / guide.length
  const accuracy = drawing.filter((point) => near(point, guide, aspectRatio)).length / drawing.length
  const coveredPaths = paths.every((path) => path.length > 0 && path.filter((point) => near(point, drawing, aspectRatio)).length / path.length >= 0.6)
  return { complete: coverage >= 0.72 && accuracy >= 0.58 && coveredPaths, coverage, accuracy }
}
