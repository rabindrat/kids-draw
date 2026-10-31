type Props = { playing: boolean; onToggle: () => void; labeled?: boolean }

export function MusicToggle({ playing, onToggle, labeled = false }: Props) {
  return <button
    className={`music-toggle ${labeled ? 'music-toggle-labeled' : ''}`}
    type="button"
    aria-label={playing ? 'Turn background music off' : 'Turn background music on'}
    aria-pressed={playing}
    title={playing ? 'Turn background music off' : 'Turn background music on'}
    onClick={onToggle}
  ><span aria-hidden="true">{playing ? '♫' : '♪'}</span>{labeled && <span>{playing ? 'Mute' : 'Unmute'}</span>}</button>
}
