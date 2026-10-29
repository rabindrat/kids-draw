import { useEffect, useRef, useState } from 'react'
import { Icon } from './components/Icon'
import { addStroke, emptyHistory, hasBrushStrokes, redo, undo, type Stroke } from './engine/drawing'
import { DrawingCanvas } from './features/drawing/DrawingCanvas'
import { DockPalette } from './features/drawing/DockPalette'
import { Practice, type PracticeLevel } from './features/tracing/Practice'

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

function Workspace({ history, setHistory, onHome }: { history: ReturnType<typeof emptyHistory>; setHistory: React.Dispatch<React.SetStateAction<ReturnType<typeof emptyHistory>>>; onHome: () => void }) {
  const [color, setColor] = useState(colors[0].value)
  const [size, setSize] = useState(sizes[1].value)
  const [tool, setTool] = useState<Stroke['tool']>('brush')
  const [confirmClear, setConfirmClear] = useState(false)
  const [openPalette, setOpenPalette] = useState<'tools' | 'colors' | null>(null)
  const currentColor = colors.find((item) => item.value === color) ?? colors[0]
  const toolExpanded = openPalette === 'tools'
  const colorExpanded = openPalette === 'colors'
  const canErase = hasBrushStrokes(history)
  return <main className="workspace" aria-label="Drawing canvas workspace">
    <div className="paper"><DrawingCanvas strokes={history.strokes} color={color} size={size} tool={tool} onStroke={(stroke) => setHistory((current) => addStroke(current, stroke))} /></div>
    <button className="back-button floating-home" aria-label="Home" onClick={onHome}><Icon name="back" /></button>
    <div className="palette-dock">
      <DockPalette side="tools" label="Drawing tools" expanded={toolExpanded} toggle={<button className="tool-button selected" aria-label={`${tool === 'brush' ? 'Brush' : 'Eraser'}; ${toolExpanded ? 'collapse' : 'expand'} drawing tools`} aria-expanded={toolExpanded} aria-controls="tools-options" onClick={() => setOpenPalette(toolExpanded ? null : 'tools')}><Icon name={tool} /></button>} pinned={<button className="tool-button" disabled={tool === 'brush' && !canErase} onClick={() => setTool(tool === 'brush' ? 'eraser' : 'brush')} aria-label={tool === 'brush' ? 'Eraser' : 'Brush'}><Icon name={tool === 'brush' ? 'eraser' : 'brush'} /></button>}>
        <button className="tool-button" disabled={!history.strokes.length} onClick={() => { const next = undo(history); setHistory(next); if (!hasBrushStrokes(next)) setTool('brush') }} aria-label="Undo"><Icon name="undo" /></button>
        <button className="tool-button" disabled={!history.undone.length} onClick={() => setHistory(redo)} aria-label="Redo"><Icon name="redo" /></button>
        {sizes.map((item, index) => <button key={item.name} className={`size-button ${size === item.value ? 'active' : ''}`} aria-label={`${item.name} brush size`} aria-pressed={size === item.value} onClick={() => setSize(item.value)}><span style={{ width: 7 + index * 5, height: 7 + index * 5 }} /></button>)}
        <button className="tool-button clear-button" disabled={!history.strokes.length} onClick={() => setConfirmClear(true)} aria-label="Clear page"><Icon name="trash" /></button>
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
  const [history, setHistory] = useState(emptyHistory)
  const [practiceLevel, setPracticeLevel] = useState<PracticeLevel>('letters')
  if (screen === 'home') return <Home onDraw={() => setScreen('draw')} onPractice={() => setScreen('practice')} />
  if (screen === 'practice') return <Practice key={practiceLevel} level={practiceLevel} onLevelChange={setPracticeLevel} onHome={() => setScreen('home')} />
  return <Workspace history={history} setHistory={setHistory} onHome={() => setScreen('home')} />
}
