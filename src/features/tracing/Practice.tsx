import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from 'react'
import { Icon } from '../../components/Icon'
import { alphabet } from '../../content/alphabet'
import { words } from '../../content/words'
import { addStroke, emptyHistory, undo, type Point, type Stroke } from '../../engine/drawing'
import { emptyAlphabetProgress, loadAlphabetProgress, loadWordProgress, saveAlphabetProgress, saveWordProgress, type AlphabetProgress } from '../../storage/alphabetProgress'
import { DrawingCanvas } from '../drawing/DrawingCanvas'
import { evaluateTracing } from './evaluate'
import { nextIncompleteStep } from './progression'

export type PracticeLevel = 'letters' | 'words'
type GuidePath = { d: string; offsetX: number; scaleX: number }
type Activity = { label: string; description: string; stepLabel: string; width: number; paths: GuidePath[] }
const letterActivities: Activity[] = alphabet.flatMap((item) => [
  { label: item.letter, description: `uppercase ${item.letter}`, stepLabel: 'BIG LETTER', width: 100, paths: item.uppercase.map((d) => ({ d, offsetX: 0, scaleX: 1 })) },
  { label: item.letter.toLowerCase(), description: `lowercase ${item.letter.toLowerCase()}`, stepLabel: 'LITTLE LETTER', width: 100, paths: item.lowercase.map((d) => ({ d, offsetX: 0, scaleX: 1 })) },
])
const wordActivities: Activity[] = words.map((item) => ({ label: item.word, description: `the word ${item.word}`, stepLabel: 'LITTLE WORD', width: item.width, paths: item.paths }))
const celebrationMs = 1600

function samplePaths(paths: SVGPathElement[], guides: GuidePath[], width: number): Point[][] {
  return paths.map((path, pathIndex) => {
    const length = path.getTotalLength()
    const guide = guides[pathIndex]
    const steps = Math.max(1, Math.ceil(length / 1.5))
    return Array.from({ length: steps + 1 }, (_, index) => {
      const point = path.getPointAtLength(length * index / steps)
      return { x: (point.x * guide.scaleX + guide.offsetX) / width, y: point.y / 100 }
    })
  })
}

export function Practice({ onHome, level, onLevelChange }: { onHome: () => void; level: PracticeLevel; onLevelChange: (level: PracticeLevel) => void }) {
  const [progress, setProgress] = useState<AlphabetProgress>(emptyAlphabetProgress)
  const progressRef = useRef(progress)
  const [index, setIndex] = useState(0)
  const [history, setHistory] = useState(emptyHistory)
  const [loading, setLoading] = useState(true)
  const [storageError, setStorageError] = useState(false)
  const [guideError, setGuideError] = useState(false)
  const [celebrating, setCelebrating] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const pathsRef = useRef<Array<SVGPathElement | null>>([])
  const guideRef = useRef<Point[][]>([])
  const finishedRef = useRef(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const selectedRef = useRef<HTMLButtonElement | null>(null)
  const menuRef = useRef<HTMLElement | null>(null)
  const menuButtonRef = useRef<HTMLButtonElement | null>(null)
  const isWords = level === 'words'
  const activities = isWords ? wordActivities : letterActivities
  const totalSteps = activities.length
  const activity = activities[index]
  const ratio = activity.width / 100

  useEffect(() => {
    let cancelled = false
    const load = level === 'words' ? loadWordProgress : loadAlphabetProgress
    load().then((saved) => {
      if (cancelled) return
      progressRef.current = saved
      setProgress(saved)
      setIndex(saved.currentIndex)
    }).catch(() => { if (!cancelled) setStorageError(true) }).finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true; if (timerRef.current) clearTimeout(timerRef.current) }
  }, [level])

  useLayoutEffect(() => {
    if (loading) return
    try {
      const elements = pathsRef.current.slice(0, activity.paths.length)
      if (elements.some((path) => !path)) throw new Error('Missing guide path')
      guideRef.current = samplePaths(elements as SVGPathElement[], activity.paths, activity.width)
      setGuideError(guideRef.current.length !== activity.paths.length)
    } catch { guideRef.current = []; setGuideError(true) }
  }, [activity, loading])

  useEffect(() => {
    if (!menuOpen) return
    selectedRef.current?.focus({ preventScroll: true })
    selectedRef.current?.scrollIntoView({ block: 'nearest', inline: 'nearest' })
    function onPointerDown(event: PointerEvent) {
      if (event.target instanceof Node && !menuRef.current?.contains(event.target) && !menuButtonRef.current?.contains(event.target)) setMenuOpen(false)
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') { setMenuOpen(false); menuButtonRef.current?.focus() }
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => { document.removeEventListener('pointerdown', onPointerDown); document.removeEventListener('keydown', onKeyDown) }
  }, [menuOpen])

  function updateProgress(next: AlphabetProgress) {
    progressRef.current = next
    setProgress(next)
    const save = isWords ? saveWordProgress : saveAlphabetProgress
    void save(next).then(() => setStorageError(false)).catch(() => setStorageError(true))
  }

  function selectStep(nextIndex: number) {
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = null
    finishedRef.current = false
    setCelebrating(false)
    setHistory(emptyHistory())
    setIndex(nextIndex)
    updateProgress({ ...progressRef.current, currentIndex: nextIndex })
  }

  function chooseStep(step: number) {
    selectStep(step)
    setMenuOpen(false)
    menuButtonRef.current?.focus()
  }

  function onStroke(stroke: Stroke) {
    if (finishedRef.current) return
    const nextHistory = addStroke(history, stroke)
    setHistory(nextHistory)
    if (!evaluateTracing(nextHistory.strokes, guideRef.current, ratio).complete) return
    finishedRef.current = true
    setCelebrating(true)
    const completed = [...new Set([...progressRef.current.completed, index])]
    const nextIndex = nextIncompleteStep(index, completed, totalSteps)
    updateProgress({ completed, currentIndex: nextIndex ?? index })
    if (nextIndex !== null) {
      timerRef.current = setTimeout(() => {
        finishedRef.current = false
        setCelebrating(false)
        setHistory(emptyHistory())
        setIndex(nextIndex)
        timerRef.current = null
      }, celebrationMs)
    }
  }

  const allDone = progress.completed.length === totalSteps
  const name = isWords ? 'word' : 'letter'
  return <main className="practice-page" aria-label={`${isWords ? 'Word' : 'Alphabet'} practice`}>
    <header className="practice-header">
      <button className="practice-home" aria-label="Home" onClick={onHome}><Icon name="back"/></button>
      <div className="practice-heading"><span className="practice-eyebrow">LITTLE LEARNING ADVENTURES</span><label className="level-select"><span className="level-select-label">Level</span><select aria-label="Practice level" value={level} onChange={(event) => onLevelChange(event.target.value as PracticeLevel)}><option value="letters">1 · Letters</option><option value="words">2 · Words</option></select><svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="m5 8 5 5 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg></label></div>
      <button ref={menuButtonRef} className="letter-menu-toggle" aria-label={`Choose a ${name}; ${progress.completed.length} of ${totalSteps} completed`} aria-expanded={menuOpen} aria-controls="activity-picker" disabled={loading} onClick={() => setMenuOpen((open) => !open)}><span className="menu-letters">{isWords ? 'abc' : 'Aa'}</span><span className="menu-progress">{progress.completed.length} / {totalSteps}</span><svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="m5 8 5 5 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
      {menuOpen && <nav ref={menuRef} id="activity-picker" className="letter-picker" aria-label={`Choose a ${name}`}>
        <div className="letter-picker-header"><div><span className="picker-eyebrow">YOUR {isWords ? 'WORDS' : 'LETTERS'}</span><h2>Pick a {name}<span>.</span></h2></div><span className="picker-count">✦ {progress.completed.length} / {totalSteps}</span></div>
        <div className="picker-legend"><span><i className="legend-done">✓</i> Done</span><span><i className="legend-todo"/> To try</span></div>
        <div className="letter-picker-scroll">{isWords ? <div className="word-picker-grid">{activities.map((item, step) => {
          const done = progress.completed.includes(step)
          const active = step === index
          return <button key={item.label} ref={active ? selectedRef : undefined} className={`word-choice ${active ? 'active' : ''} ${done ? 'done' : ''}`} aria-current={active ? 'step' : undefined} aria-label={`${item.label}, ${done ? 'done' : 'to try'}`} onClick={() => chooseStep(step)}><span>{item.label}</span><i className="choice-status" aria-hidden="true">{done ? '✓' : ''}</i></button>
        })}</div> : <div className="letter-picker-grid">{alphabet.map((item, letterIndex) => <div className="letter-pair" key={item.letter}>{[letterIndex * 2, letterIndex * 2 + 1].map((step) => {
          const lower = step % 2 === 1
          const label = lower ? item.letter.toLowerCase() : item.letter
          const done = progress.completed.includes(step)
          const active = step === index
          return <button key={step} ref={active ? selectedRef : undefined} className={`letter-choice ${active ? 'active' : ''} ${done ? 'done' : ''}`} aria-current={active ? 'step' : undefined} aria-label={`${lower ? 'Lowercase' : 'Uppercase'} ${label}, ${done ? 'done' : 'to try'}`} onClick={() => chooseStep(step)}><span>{label}</span><i className="choice-status" aria-hidden="true">{done ? '✓' : ''}</i></button>
        })}</div>)}</div>}</div>
      </nav>}
    </header>
    {storageError && <div className="practice-storage-warning" role="status">Progress can’t be saved on this device right now. You can still practice.</div>}
    {loading ? <div className="practice-loading">Getting your {isWords ? 'words' : 'letters'} ready…</div> : <>
      <section className="practice-stage" aria-label={`Trace ${activity.description}`}>
        <div className="trace-intro"><span className="trace-step">{activity.stepLabel} <span>✦</span></span><h1>Let's trace <em>{activity.label}</em></h1><p>Follow the dots with your finger or stylus.</p></div>
        {guideError && <div className="practice-storage-warning" role="status">This browser couldn’t load the tracing guide. Try another browser.</div>}
        <div className={`trace-board ${isWords ? 'trace-board-word' : ''}`} style={isWords ? { '--guide-ratio': ratio, '--guide-vw': `${90 / ratio}vw` } as CSSProperties : undefined}>
          <svg viewBox={`0 0 ${activity.width} 100`} className="letter-guide" aria-hidden="true">{activity.paths.map((path, pathIndex) => <path key={`${index}-${pathIndex}`} ref={(node) => { pathsRef.current[pathIndex] = node }} d={path.d} transform={`translate(${path.offsetX} 0) scale(${path.scaleX} 1)`}/>)}</svg>
          <DrawingCanvas strokes={history.strokes} color="#d68079" size={0.026} tool="brush" onStroke={onStroke}/>
          {celebrating && <div className="trace-celebration" role="status" aria-live="polite"><span className="celebration-star star-one">✦</span><span className="celebration-star star-two">✳</span><span className="celebration-star star-three">✦</span><div className="celebration-badge">✦</div><strong>{allDone ? 'You did it!' : 'Wonderful!'}</strong><small>{allDone ? `You traced every ${name}!` : `You made a little ${name}!`}</small>{allDone && !isWords && <button className="next-level-button" onClick={() => onLevelChange('words')}>Try word practice <Icon name="arrow"/></button>}</div>}
        </div>
      </section>
      <div className="practice-bottom"><button className="practice-action" onClick={() => setHistory(undo)} disabled={!history.strokes.length || celebrating} aria-label="Undo last stroke"><Icon name="undo"/><span>Undo</span></button><div className="practice-hint"><span>✳</span> {isWords ? 'LITTLE WORDS, BIG IDEAS' : 'ONE LITTLE LINE AT A TIME'}</div><button className="practice-action" onClick={() => setHistory(emptyHistory())} disabled={!history.strokes.length || celebrating} aria-label={`Try this ${name} again`}><Icon name="redo"/><span>Try again</span></button></div>
    </>}
  </main>
}
