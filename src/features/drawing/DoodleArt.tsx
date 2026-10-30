import type { Doodle } from '../../content/doodles'

export function DoodleArt({ doodle, className, opacity = 1 }: { doodle: Doodle; className?: string; opacity?: number }) {
  return <svg className={className} viewBox="0 0 100 100" preserveAspectRatio="none" fill="none" aria-hidden="true" style={{ opacity }}>
    <g stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke">
      {doodle.paths.map((path, index) => <path key={index} d={path} vectorEffect="non-scaling-stroke" />)}
    </g>
  </svg>
}
