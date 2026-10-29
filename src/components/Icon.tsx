import type { SVGProps } from 'react'

type IconName = 'arrow' | 'back' | 'brush' | 'eraser' | 'undo' | 'redo' | 'trash' | 'sparkle' | 'close' | 'minimize' | 'expand'
const paths: Record<IconName, React.ReactNode> = {
  arrow: <><path d="M4 12h15M13 6l6 6-6 6" /></>,
  back: <><path d="M20 12H5M11 6l-6 6 6 6" /></>,
  brush: <><path d="M14 5l5 5M13 6l4-4 5 5-4 4-7 7-5-5z"/><path d="M6 13c-3 0-3 3-4 5 3 1 7 1 8-3"/></>,
  eraser: <><path d="M3 14 13 4a2 2 0 0 1 3 0l4 4a2 2 0 0 1 0 3l-8 8H7z"/><path d="m8 9 7 7M12 19h9"/></>,
  undo: <><path d="M9 7 4 12l5 5"/><path d="M5 12h8a6 6 0 0 1 6 6"/></>,
  redo: <><path d="m15 7 5 5-5 5"/><path d="M19 12h-8a6 6 0 0 0-6 6"/></>,
  trash: <><path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13M10 11v5M14 11v5"/></>,
  sparkle: <><path d="M12 2c.8 5 2.4 6.7 7 7.5-4.6.8-6.2 2.5-7 7.5-.8-5-2.4-6.7-7-7.5C9.6 8.7 11.2 7 12 2Z"/><path d="M19 16v5M16.5 18.5h5"/></>,
  minimize: <path d="M5 12h14"/>,
  expand: <><path d="M12 5v14M5 12h14"/></>,
  close: <path d="m6 6 12 12M18 6 6 18"/>,
}
export function Icon({ name, ...props }: SVGProps<SVGSVGElement> & { name: IconName }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>{paths[name]}</svg>
}
