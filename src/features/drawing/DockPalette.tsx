import type { ReactNode } from 'react'

type Props = {
  side: 'tools' | 'colors'
  label: string
  expanded: boolean
  toggle: ReactNode
  pinned?: ReactNode
  children: ReactNode
}

export function DockPalette({ side, label, expanded, toggle, pinned, children }: Props) {
  return <aside className={`dock-palette dock-${side}`} aria-label={label}>
    <div className="dock-pinned">{toggle}{pinned}</div>
    <div id={`${side}-options`} className="dock-options" hidden={!expanded}>{children}</div>
  </aside>
}
