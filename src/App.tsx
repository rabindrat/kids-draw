import { useEffect, useRef, useState } from 'react'
import { Icon } from './components/Icon'
import { addStroke, emptyHistory, hasBrushStrokes, redo, undo, type Stroke } from './engine/drawing'
import { DrawingCanvas } from './features/drawing/DrawingCanvas'
import { DockPalette } from './features/drawing/DockPalette'
import { Practice, type PracticeLevel } from './features/tracing/Practice'
import { doodles } from './content/doodles'
import { DoodleArt } from './features/drawing/DoodleArt'
import { useDrawingLibrary } from './features/drawing/useDrawingLibrary'

const colors = [
  { name: 'Berry', value: '#d45f64' }, { name: 'Tangerine', value: '#efa35f' },
  { name: 'Sunshine', value: '#e8c866' }, { name: 'Leaf', value: '#8bbd9d' },
  { name: 'Sky', value: '#81b6c6' }, { name: 'Blueberry', value: '#7d8cba' },
  { name: 'Grape', value: '#b39ac4' }, { name: 'Ink', value: '#424955' },
]
const sizes = [{ name: 'Small', value: 0.009 }, { name: 'Medium', value: 0.018 }, { name: 'Large', value: 0.032 }]

function Logo() {
  return <div className="brand"><span className="brand-mark"><span></span><span></span><span></span></span><span>little lines<span className="brand-dot">.</span></span></div>
}

function HomeArt() {
  return <svg className="home-art" viewBox="0 0 560 440" fill="none" aria-hidden="true">
    <path d="M66 253C29 159 111 65 234 66c72-1 95 30 152 22 76-11 120 41 111 111-7 59-43 113-119 142-65 25-137 33-211 10-43-14-81-47-101-98Z" fill="#E7EEDF" />
    <path d="M92 285c-20-20-27-43-24-72" stroke="#A9C4A9" strokeWidth="3" strokeLinecap="round" strokeDasharray="2 9" />
    <path d="M426 75v28m-14-14h28M91 110v22m-11-11h22" stroke="#DCA782" strokeWidth="3" strokeLinecap="round" />
    <circle cx="463" cy="268" r="7" fill="#E3B27B" /><circle cx="115" cy="194" r="5" fill="#DFA0A0" />
    <g transform="rotate(-8 285 216)"><rect x="135" y="91" width="284" height="255" rx="12" fill="#D5D9C9" opacity=".55" /><rect x="126" y="81" width="284" height="255" rx="12" fill="#FFFEF8" stroke="#E9E6D9" strokeWidth="2" />
      <path d="M177 273c26-56 67-97 105-62 20 18 39 36 72 7" stroke="#A6C7A3" strokeWidth="13" strokeLinecap="round" />
      <path d="M185 257c20-38 47-62 71-58" stroke="#EABF83" strokeWidth="13" strokeLinecap="round" />
      <path d="M205 270c19-25 34-34 49-30" stroke="#D98987" strokeWidth="13" strokeLinecap="round" />
      <circle cx="313" cy="148" r="30" fill="#F0C980" /><path d="M309 145h.1m10 0h.1" stroke="#855D4E" strokeWidth="4" strokeLinecap="round" /><path d="M309 154c3 4 7 4 10 0" stroke="#855D4E" strokeWidth="2" strokeLinecap="round" />
      <path d="M178 149c4-12 19-11 22 0 5-11 19-10 21 1" stroke="#A3C6D0" strokeWidth="4" strokeLinecap="round" />
      <path d="M264 296c6 7 14 8 20 1" stroke="#B8C6A4" strokeWidth="3" strokeLinecap="round" />
    </g>
    <g transform="rotate(28 411 322)"><rect x="397" y="262" width="28" height="118" rx="6" fill="#D9847C" /><path d="M397 278h28v10h-28z" fill="#E8ADA3" /><path d="m397 380 14 24 14-24" fill="#E7C6A4" /><path d="m407 397 4 7 4-7" fill="#5D5550" /></g>
    <path d="M113 339c14 0 19 4 24 15M439 157c13 5 17 11 18 22" stroke="#B8CCB2" strokeWidth="3" strokeLinecap="round" />
  </svg>
}

function Home({ onDraw, onPractice }: { onDraw: () => void; onPractice: () => void }) {
  return <div className="home-page">
    <header className="site-header"><Logo /><span className="header-note"><span className="tiny-sparkle">✳</span> MADE FOR LITTLE IMAGINATIONS</span></header>
    <main className="home-main">
      <section className="activities" aria-labelledby="activities-title">
        <div className="section-heading"><div><div className="eyebrow">PICK YOUR ADVENTURE</div><h2 id="activities-title">Let's make something.</h2></div><span className="section-sparkle">✳</span></div>
        <div className="activity-grid">
          <button className="activity-card draw-card" onClick={onDraw}>
            <span className="card-illustration draw-illustration" aria-hidden="true"><span className="squiggle">〰</span><span className="crayon crayon-one" /><span className="crayon crayon-two" /><span className="crayon crayon-three" /></span>
            <span className="card-copy"><span className="card-kicker">A WORLD OF COLOR</span><strong>Let's draw!</strong><span>Dream it up, then draw it out.</span><span className="card-action">START DRAWING <span className="arrow-circle"><Icon name="arrow" /></span></span></span>
          </button>
          <button className="activity-card letters-card" onClick={onPractice}>
            <span className="card-illustration letters-illustration" aria-hidden="true"><span className="letter-a">A</span><span className="letter-b">b</span><span className="letter-star">✦</span></span>
            <span className="card-copy"><span className="card-kicker">LITTLE LETTERS, BIG FUN</span><strong>Letters & words</strong><span>Make friends with letters and words.</span><span className="card-action letters-action">START PRACTICING <span className="arrow-circle"><Icon name="arrow" /></span></span></span>
          </button>
        </div>
      </section>
      <section className="welcome">
        <div className="welcome-copy"><div className="eyebrow"><span className="eyebrow-dot" /> A LITTLE SPACE TO CREATE</div>
          <h1>Big ideas start<br /><em>with little lines.</em></h1>
          <p>A happy place to draw, discover, and let your imagination wander.</p>
          <div className="hand-note"><svg viewBox="0 0 45 28" fill="none" aria-hidden="true"><path d="M2 4c10 1 17 7 20 19m-6-6 6 6 5-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>What will you make today?</div>
        </div><HomeArt />
      </section>
    </main>
    <footer className="home-footer"><span>Made for curious little minds <span className="heart">♥</span></span><span>CREATE · PLAY · GROW</span></footer>
  </div>
}

function ClearDialog({ onCancel, onConfirm }: { onCancel: () => void; onConfirm: () => void }) {
  const cancelRef = useRef<HTMLButtonElement>(null)
  const confirmRef = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null
    cancelRef.current?.focus()
    return () => previous?.focus()
  }, [])
  return <div className="modal-backdrop" onClick={onCancel}><div className="modal" role="dialog" aria-modal="true" aria-labelledby="clear-title" onClick={(event) => event.stopPropagation()} onKeyDown={(event) => {
    if (event.key === 'Escape') onCancel()
    if (event.key === 'Tab') {
      if (event.shiftKey && document.activeElement === cancelRef.current) { event.preventDefault(); confirmRef.current?.focus() }
      else if (!event.shiftKey && document.activeElement === confirmRef.current) { event.preventDefault(); cancelRef.current?.focus() }
    }
  }}><div className="modal-icon"><Icon name="sparkle" /></div><h2 id="clear-title">A fresh page?</h2><p>This will clear your drawing so you can start something new.</p><div className="modal-actions"><button ref={cancelRef} onClick={onCancel}>Keep drawing</button><button ref={confirmRef} className="confirm-button" onClick={onConfirm}>Clear page</button></div></div></div>
}

function Workspace({ library, onHome }: { library: ReturnType<typeof useDrawingLibrary>; onHome: () => void }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const pickerRef = useRef<HTMLElement>(null)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const [color, setColor] = useState(colors[0].value)
  const [size, setSize] = useState(sizes[1].value)
  const [tool, setTool] = useState<Stroke['tool']>('brush')
  const [confirmClear, setConfirmClear] = useState(false)
  const [openPalette, setOpenPalette] = useState<'tools' | 'colors' | null>(null)
  const { drawing, selectedId, status, loadError, update, retry } = library
  const history = drawing?.history ?? emptyHistory()
  const doodle = doodles.find((item) => item.id === selectedId)
  const setHistory = (change: ReturnType<typeof emptyHistory> | ((current: ReturnType<typeof emptyHistory>) => ReturnType<typeof emptyHistory>)) => update((current) => ({ ...current, history: typeof change === 'function' ? change(current.history) : change }))
  useEffect(() => {
    if (!menuOpen) return
    const menu = menuRef.current
    let timer: ReturnType<typeof setTimeout>
    const dismiss = () => {
      if (pickerRef.current?.contains(document.activeElement)) menuButtonRef.current?.focus()
      setMenuOpen(false)
    }
    const resetTimer = () => { clearTimeout(timer); timer = setTimeout(dismiss, 5000) }
    const close = (event: PointerEvent) => { if (!menu?.contains(event.target as Node)) setMenuOpen(false) }
    const escape = (event: KeyboardEvent) => { if (event.key === 'Escape') dismiss() }
    resetTimer()
    menu?.addEventListener('pointermove', resetTimer)
    menu?.addEventListener('pointerdown', resetTimer)
    menu?.addEventListener('keydown', resetTimer)
    menu?.addEventListener('focusin', resetTimer)
    menu?.addEventListener('wheel', resetTimer)
    menu?.addEventListener('scroll', resetTimer, true)
    document.addEventListener('pointerdown', close)
    document.addEventListener('keydown', escape)
    return () => {
      clearTimeout(timer)
      menu?.removeEventListener('pointermove', resetTimer)
      menu?.removeEventListener('pointerdown', resetTimer)
      menu?.removeEventListener('keydown', resetTimer)
      menu?.removeEventListener('focusin', resetTimer)
      menu?.removeEventListener('wheel', resetTimer)
      menu?.removeEventListener('scroll', resetTimer, true)
      document.removeEventListener('pointerdown', close)
      document.removeEventListener('keydown', escape)
    }
  }, [menuOpen])
  const currentColor = colors.find((item) => item.value === color) ?? colors[0]
  const toolExpanded = openPalette === 'tools'
  const colorExpanded = openPalette === 'colors'
  const canErase = hasBrushStrokes(history)
  return <main className="workspace" aria-label="Drawing canvas workspace">
    <div className="paper">{doodle && drawing && <DoodleArt doodle={doodle} className="doodle-guide" opacity={drawing.opacity} />}{drawing && <DrawingCanvas key={selectedId} guided={!!doodle} strokes={history.strokes} color={color} size={tool === 'eraser' ? sizes[2].value : size} tool={tool} onStroke={(stroke) => setHistory((current) => addStroke(current, stroke))} />}</div>
    <div className="drawing-selector" ref={menuRef}>
      <button ref={menuButtonRef} className="drawing-selector-toggle" aria-label="Choose a drawing" aria-expanded={menuOpen} aria-controls="drawing-picker" onClick={() => setMenuOpen(!menuOpen)}><span>{doodle ? doodle.name : 'Free draw'}</span><span aria-hidden="true">⌄</span></button>
      <nav ref={pickerRef} id="drawing-picker" className={`drawing-picker ${menuOpen ? 'is-open' : ''}`} aria-label="Choose a drawing" aria-hidden={!menuOpen} inert={!menuOpen}>
        <div className="drawing-picker-heading"><span>YOUR DRAWINGS</span><strong>Pick a page<span>.</span></strong></div>
        <div className="drawing-picker-scroll">
          <div className="drawing-level-label">LEVEL 0 · FREEHAND</div>
          <button className={`drawing-choice freehand-choice ${selectedId === 'freehand' ? 'active' : ''}`} aria-pressed={selectedId === 'freehand'} onClick={() => { library.select('freehand'); setTool('brush'); setMenuOpen(false) }}><span className="freehand-symbol" aria-hidden="true">✎</span><span>Free draw</span></button>
          <div className="drawing-level-label">LEVEL 1 · DOODLES</div>
          <div className="doodle-grid">{doodles.map((item) => <button key={item.id} className={`drawing-choice ${selectedId === item.id ? 'active' : ''}`} aria-pressed={selectedId === item.id} onClick={() => { library.select(item.id); setTool('brush'); setMenuOpen(false) }}><DoodleArt doodle={item} /><span>{item.name}</span></button>)}</div>
        </div>
      </nav>
    </div>
    {doodle && drawing && <label className="doodle-opacity"><span>Guide</span><input type="range" min="0" max="100" step="5" value={Math.round(drawing.opacity * 100)} aria-label="Guide opacity" onChange={(event) => update((current) => ({ ...current, opacity: Number(event.target.value) / 100 }))} /><span>{Math.round(drawing.opacity * 100)}%</span></label>}
    {(loadError || status === 'error') && <div className="drawing-storage-message" role="alert"><span>{loadError ? "Couldn't open this drawing." : "Couldn't save. Your drawing is still in this tab."}</span><button onClick={retry}>Try again</button></div>}
    {!drawing && !loadError && <div className="drawing-loading" role="status">Opening your drawing…</div>}
    <button className="back-button floating-home" aria-label="Home" onClick={onHome}><Icon name="back" /></button>
    <div className="palette-dock">
      <DockPalette side="tools" label="Drawing tools" expanded={toolExpanded} toggle={<button className={`tool-button pen-tool ${tool === 'brush' ? 'active' : ''}`} aria-label={`Pen${tool === 'brush' ? ', selected' : ''}; ${toolExpanded ? 'collapse' : 'show'} pen options`} aria-pressed={tool === 'brush'} aria-expanded={toolExpanded} aria-controls="tools-options" onClick={() => { setTool('brush'); setOpenPalette(toolExpanded ? null : 'tools') }}><Icon name="brush" /></button>} pinned={<>
        <button className={`tool-button eraser-tool ${tool === 'eraser' ? 'active' : ''}`} disabled={tool !== 'eraser' && !canErase} onClick={() => { setTool('eraser'); setOpenPalette(null) }} aria-label={`Eraser${tool === 'eraser' ? ', selected' : ''}`} aria-pressed={tool === 'eraser'}><Icon name="eraser" /></button>
        <button className="tool-button reset-tool" disabled={!history.strokes.length} onClick={() => setConfirmClear(true)} aria-label="Reset drawing"><Icon name="trash" /></button>
      </>}>
        <button className="tool-button" disabled={!history.strokes.length} onClick={() => { const next = undo(history); setHistory(next); if (!hasBrushStrokes(next)) setTool('brush') }} aria-label="Undo"><Icon name="undo" /></button>
        <button className="tool-button" disabled={!history.undone.length} onClick={() => setHistory(redo)} aria-label="Redo"><Icon name="redo" /></button>
        {sizes.map((item, index) => <button key={item.name} className={`size-button ${size === item.value ? 'active' : ''}`} aria-label={`${item.name} pen size`} aria-pressed={size === item.value} onClick={() => { setSize(item.value); setTool('brush') }}><span style={{ width: 7 + index * 5, height: 7 + index * 5 }} /></button>)}
      </DockPalette>
      <DockPalette side="colors" label="Colors" expanded={colorExpanded} toggle={<button className="color-button active" style={{ '--swatch': currentColor.value } as React.CSSProperties} aria-label={`${currentColor.name}; ${colorExpanded ? 'collapse' : 'expand'} colors`} aria-expanded={colorExpanded} aria-controls="colors-options" onClick={() => setOpenPalette(colorExpanded ? null : 'colors')}><span /></button>}>
        {colors.filter((item) => item.value !== color).map((item) => <button key={item.value} className="color-button" style={{ '--swatch': item.value } as React.CSSProperties} aria-label={item.name} onClick={() => { setColor(item.value); setTool('brush'); setOpenPalette(null) }}><span /></button>)}
      </DockPalette>
    </div>
    {confirmClear && <ClearDialog onCancel={() => setConfirmClear(false)} onConfirm={() => { setHistory(emptyHistory()); setTool('brush'); setConfirmClear(false) }} />}
  </main>
}

export default function App() {
  const [screen, setScreen] = useState<'home' | 'draw' | 'practice'>('home')
  const library = useDrawingLibrary(screen === 'draw')
  const [practiceLevel, setPracticeLevel] = useState<PracticeLevel>('letters')
  if (screen === 'home') return <Home onDraw={() => setScreen('draw')} onPractice={() => setScreen('practice')} />
  if (screen === 'practice') return <Practice key={practiceLevel} level={practiceLevel} onLevelChange={setPracticeLevel} onHome={() => setScreen('home')} />
  return <Workspace library={library} onHome={() => setScreen('home')} />
}
