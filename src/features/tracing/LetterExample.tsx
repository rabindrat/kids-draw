type Example = { word: string; picture: string }

const examples: Record<string, Example> = {
  A: { word: 'Apple', picture: 'apple' }, B: { word: 'Ball', picture: 'ball' }, C: { word: 'Cat', picture: 'cat' },
  D: { word: 'Dog', picture: 'dog' }, E: { word: 'Elephant', picture: 'elephant' }, F: { word: 'Fish', picture: 'fish' },
  G: { word: 'Giraffe', picture: 'giraffe' }, H: { word: 'House', picture: 'house' }, I: { word: 'Ice cream', picture: 'icecream' },
  J: { word: 'Jellyfish', picture: 'jellyfish' }, K: { word: 'Kite', picture: 'kite' }, L: { word: 'Lion', picture: 'lion' },
  M: { word: 'Moon', picture: 'moon' }, N: { word: 'Nest', picture: 'nest' }, O: { word: 'Owl', picture: 'owl' },
  P: { word: 'Penguin', picture: 'penguin' }, Q: { word: 'Queen', picture: 'queen' }, R: { word: 'Rainbow', picture: 'rainbow' },
  S: { word: 'Sun', picture: 'sun' }, T: { word: 'Turtle', picture: 'turtle' }, U: { word: 'Umbrella', picture: 'umbrella' },
  V: { word: 'Violin', picture: 'violin' }, W: { word: 'Whale', picture: 'whale' }, X: { word: 'Xylophone', picture: 'xylophone' },
  Y: { word: 'Yo-yo', picture: 'yoyo' }, Z: { word: 'Zebra', picture: 'zebra' },
}

function Picture({ kind }: { kind: string }) {
  const line = { stroke: 'currentColor', strokeWidth: 3, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }
  switch (kind) {
    case 'apple': return <><path d="M50 28c-24-16-39 4-31 31 7 22 20 23 31 15 11 8 24 7 31-15 8-27-7-47-31-31Z" fill="#eaa39a" {...line}/><path d="M50 29c-1-10 2-17 9-22M52 15c10-9 21-5 22 3-8 6-15 5-22-3Z" fill="#9fc2a1" {...line}/></>
    case 'ball': return <><circle cx="50" cy="45" r="34" fill="#e8c67d" {...line}/><path d="M22 27c20 2 42 25 47 53M79 25C62 43 35 49 17 43M20 66c20-11 43-9 61 4" {...line}/></>
    case 'cat': return <><path d="m25 38 2-22 18 13h10l18-13 2 22c8 8 11 18 9 28-4 18-19 25-34 25S20 84 16 66c-2-10 1-20 9-28Z" fill="#f3d0a9" {...line}/><path d="M34 52h.1M66 52h.1M43 63q7 7 14 0M50 60v-5m0 8-4 2m4-2 4 2M30 63l12 2m-12 5 12-2m28-5-12 2m12 5-12-2" {...line}/></>
    case 'dog': return <><path d="M27 35 18 19l19 5q13-7 26 0l19-5-9 17q8 10 6 26-3 25-29 25T21 61q-2-16 6-26Z" fill="#dcae83" {...line}/><path d="M38 51h.1M62 51h.1M43 64q7 7 14 0M50 60v-6m0 12c-2 11 14 12 16 2" {...line}/></>
    case 'elephant': return <><circle cx="50" cy="42" r="25" fill="#b9d2d0" {...line}/><circle cx="23" cy="45" r="17" fill="#b9d2d0" {...line}/><circle cx="77" cy="45" r="17" fill="#b9d2d0" {...line}/><path d="M40 40h.1M60 40h.1M45 52q5 4 10 0m-5 0v16c0 14 17 13 17 3v-5" {...line}/></>
    case 'fish': return <><path d="M17 48q18-29 52-14l16-13v53L69 61Q35 79 17 48Z" fill="#9bc8d4" {...line}/><circle cx="38" cy="43" r="2" fill="#536c59"/><path d="M53 37q-11 11 0 22" {...line}/></>
    case 'giraffe': return <><path d="M31 80V39q0-21 19-21t19 21v41M37 21l-4-12m31 12 4-12M33 9h-7m45 0h-7" fill="#f0cf79" {...line}/><circle cx="42" cy="39" r="2" fill="#526c59"/><circle cx="58" cy="39" r="2" fill="#526c59"/><path d="M44 52q6 5 12 0M40 63h4m13-8h5m-25 17h5m17-6h5" {...line}/></>
    case 'house': return <><path d="m14 43 36-30 36 30v39H14Z" fill="#e4b68d" {...line}/><path d="M40 82V57h20v25M24 49h11v12H24zm41 0h11v12H65z" {...line}/></>
    case 'icecream': return <><path d="m30 51 20 34 20-34" fill="#e7b886" {...line}/><circle cx="50" cy="40" r="22" fill="#efa9a4" {...line}/><path d="M36 48 50 85l14-37M42 37h.1M57 32h.1M58 44h.1" {...line}/></>
    case 'jellyfish': return <><path d="M17 51a33 33 0 0 1 66 0q-8 9-16 0-8 9-17 0-8 9-17 0-8 9-16 0Z" fill="#d7c5e3" {...line}/><path d="M32 57v18m13-14v21m13-23v20m13-22v18M42 43h.1M58 43h.1" {...line}/></>
    case 'kite': return <><path d="m50 10 31 35-31 35-31-35Z" fill="#efa9a0" {...line}/><path d="m50 10 0 70m-31-35h62M50 80q-16 8-4 15 8 4 4 10m0-14q16 7 5 13" {...line}/></>
    case 'lion': return <><path d="M50 10 60 17 73 15 78 28 89 37 84 50 89 63 78 72 75 85 61 84 50 92 39 84 25 85 22 72 11 63 16 50 11 37 22 28 25 15 40 17Z" fill="#eabc75" {...line}/><circle cx="50" cy="51" r="25" fill="#f4d8ad" {...line}/><path d="M40 45h.1M60 45h.1M44 59q6 6 12 0m-6-5v6" {...line}/></>
    case 'moon': return <><path d="M70 72C45 84 20 64 25 40 28 25 41 15 55 15 42 31 47 54 70 72Z" fill="#efd17b" {...line}/><path d="M76 22v10m-5-5h10M28 72v8m-4-4h8" {...line}/></>
    case 'nest': return <><path d="M19 55q31 16 62 0M22 62q28 16 56 0M28 69q22 14 44 0" fill="none" {...line}/><ellipse cx="39" cy="47" rx="12" ry="17" fill="#efe0b0" {...line}/><ellipse cx="59" cy="45" rx="12" ry="18" fill="#d8e5ce" {...line}/><path d="M34 47h.1m20-4h.1" {...line}/></>
    case 'owl': return <><path d="M22 81V37l15-18 13 13 13-13 15 18v44q-28 18-56 0Z" fill="#bf9f7d" {...line}/><circle cx="39" cy="48" r="12" fill="#fff8e7" {...line}/><circle cx="61" cy="48" r="12" fill="#fff8e7" {...line}/><circle cx="39" cy="48" r="3" fill="#526c59"/><circle cx="61" cy="48" r="3" fill="#526c59"/><path d="m47 59 3 6 3-6M40 75h20" {...line}/></>
    case 'penguin': return <><ellipse cx="50" cy="51" rx="30" ry="38" fill="#657d88" {...line}/><ellipse cx="50" cy="57" rx="19" ry="27" fill="#fff8e7" {...line}/><circle cx="41" cy="39" r="2" fill="#526c59"/><circle cx="59" cy="39" r="2" fill="#526c59"/><path d="m45 47 5 5 5-5M34 87l-8 5m40-5 8 5" fill="#e8b775" {...line}/></>
    case 'queen': return <><path d="m20 33 8 48h44l8-48-19 16-11-27-11 27Z" fill="#efcf79" {...line}/><circle cx="50" cy="58" r="15" fill="#f1c4a0" {...line}/><path d="M38 53h.1M62 53h.1M44 63q6 5 12 0M26 88h48M34 76v9m32-9v9" {...line}/></>
    case 'rainbow': return <><path d="M17 78a33 33 0 0 1 66 0M27 78a23 23 0 0 1 46 0M37 78a13 13 0 0 1 26 0" stroke="#d9877e" strokeWidth="8" fill="none" strokeLinecap="round"/><path d="M17 80H10m73 0h7" {...line}/></>
    case 'sun': return <><circle cx="50" cy="49" r="21" fill="#f0ca70" {...line}/><path d="M50 10v11m0 56v11M11 49h11m56 0h11M22 21l8 8m40 40 8 8m0-56-8 8M30 69l-8 8" {...line}/><path d="M43 47h.1M57 47h.1M43 57q7 7 14 0" {...line}/></>
    case 'turtle': return <><ellipse cx="49" cy="54" rx="28" ry="22" fill="#9fbe8d" {...line}/><circle cx="80" cy="52" r="12" fill="#b4cd98" {...line}/><path d="M22 43 15 35l-3 14m19 24-3 10m34-10 3 10M36 35q13 18 26 0M49 32v43M39 50h20m39 2h.1" {...line}/></>
    case 'umbrella': return <><path d="M13 48a37 37 0 0 1 74 0q-9-7-18 0-9-7-19 0-9-7-19 0-9-7-18 0Z" fill="#9fc6d2" {...line}/><path d="M50 48v31q0 10 9 8 5-1 5-7" {...line}/></>
    case 'violin': return <><path d="M50 19q-13-10-20 2-5 9 3 17-11 8-3 18l12 12q-2 10 5 15 8 6 17-3 7-8 1-16l-12-12q-10-8-2-17 8-8 1-16Z" fill="#d69a6e" {...line}/><path d="M51 25 45 69m-9-30 24 23m-35-47 54 54M42 37l12 12" {...line}/></>
    case 'whale': return <><path d="M12 56q4-29 41-29 27 0 37 25 7 17-2 25-9 8-18-2-25 14-46-1-11 0-12-18Z" fill="#8cbac8" {...line}/><path d="m25 47-13-13 2 24m43 0h.1M64 33q-2-13 8-17m-5 11q8-13 18-9" {...line}/></>
    case 'xylophone': return <><path d="m16 76 13-43h10L26 76Zm19 0 10-55h10L45 76Zm19 0 7-43h10L64 76Zm19 0 2-29h9l-2 29Z" fill="#e7ac91" {...line}/><path d="M14 82h75M72 18l15-8" {...line}/></>
    case 'yoyo': return <><circle cx="38" cy="54" r="24" fill="#e9a69d" {...line}/><circle cx="62" cy="54" r="24" fill="#efcf79" {...line}/><path d="M50 17q-2 14 0 24t0 24q-2 12 0 19" {...line}/><circle cx="38" cy="54" r="5" fill="#fff8e7" {...line}/><circle cx="62" cy="54" r="5" fill="#fff8e7" {...line}/></>
    case 'zebra': return <><path d="M27 31 24 16l17 9q9-5 18 0l17-9-3 18q8 9 7 23-2 27-30 27T20 57q-1-16 7-26Z" fill="#fffdf4" {...line}/><path d="m38 27-8 18m24-21-9 20m24-13-10 18M40 53h.1M60 53h.1M44 65q6 5 12 0" {...line}/></>
    default: return <><circle cx="50" cy="50" r="32" fill="#e7eee2" {...line}/><path d="M37 52h.1M63 52h.1M41 64q9 9 18 0" {...line}/></>
  }
}

export function LetterExample({ letter }: { letter: string }) {
  const example = examples[letter]
  if (!example) return null
  return <aside className="letter-example" aria-label={`${letter} is for ${example.word}`}>
    <div className="letter-example-art"><svg viewBox="0 0 100 100" fill="none" aria-hidden="true"><Picture kind={example.picture}/></svg></div>
    <div className="letter-example-copy"><span> A WORD FOR {letter}</span><strong>{letter} is for {example.word}</strong></div>
  </aside>
}
