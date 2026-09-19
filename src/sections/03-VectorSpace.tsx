import { useMemo, useState } from 'react'

interface Point {
  text: string
  x: number
  y: number
}

/** 16 hand-placed words. The horizontal position roughly tracks "male to
 *  female" and the vertical position is just spread, so the classic
 *  man-to-woman, king-to-queen analogy is visible without labelling an axis. */
const POINTS: Point[] = [
  { text: 'king', x: 96, y: 40 },
  { text: 'queen', x: 188, y: 44 },
  { text: 'prince', x: 104, y: 68 },
  { text: 'princess', x: 180, y: 64 },
  { text: 'groom', x: 92, y: 94 },
  { text: 'bride', x: 190, y: 98 },
  { text: 'man', x: 106, y: 120 },
  { text: 'woman', x: 174, y: 116 },
  { text: 'waiter', x: 90, y: 146 },
  { text: 'waitress', x: 184, y: 150 },
  { text: 'actor', x: 100, y: 172 },
  { text: 'actress', x: 178, y: 168 },
  { text: 'uncle', x: 94, y: 198 },
  { text: 'aunt', x: 186, y: 194 },
  { text: 'boy', x: 108, y: 224 },
  { text: 'girl', x: 172, y: 220 },
]

const NAMES = POINTS.map((p) => p.text)

function byName(name: string): Point {
  return POINTS.find((p) => p.text === name)!
}

function nearest(x: number, y: number, exclude: string[]): { point: Point; dist: number } {
  let best: Point = POINTS[0]
  let bestDist = Infinity
  for (const p of POINTS) {
    if (exclude.includes(p.text)) continue
    const d = Math.hypot(p.x - x, p.y - y)
    if (d < bestDist) {
      bestDist = d
      best = p
    }
  }
  return { point: best, dist: bestDist }
}

export function VectorSpace() {
  const [from, setFrom] = useState('man')
  const [to, setTo] = useState('woman')
  const [applyTo, setApplyTo] = useState('king')

  const fromP = byName(from)
  const toP = byName(to)
  const srcP = byName(applyTo)

  const dx = toP.x - fromP.x
  const dy = toP.y - fromP.y
  const tipX = srcP.x + dx
  const tipY = srcP.y + dy

  const result = useMemo(() => nearest(tipX, tipY, [applyTo]), [tipX, tipY, applyTo])

  return (
    <div className="figure">
      <div className="figure-head">
        <span className="dot" />
        a direction copied onto a third word
      </div>

      <div className="vs-controls">
        <label className="vs-field">
          <span>from</span>
          <select className="vs-select" value={from} onChange={(e) => setFrom(e.target.value)}>
            {NAMES.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </label>
        <label className="vs-field">
          <span>to</span>
          <select className="vs-select" value={to} onChange={(e) => setTo(e.target.value)}>
            {NAMES.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </label>
        <label className="vs-field">
          <span>apply to</span>
          <select
            className="vs-select"
            value={applyTo}
            onChange={(e) => setApplyTo(e.target.value)}
          >
            {NAMES.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </label>
      </div>

      <svg className="vs-svg" viewBox="0 0 300 250" role="img" aria-label="word vector space">
        <defs>
          <marker id="vs-arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6 Z" fill="var(--accent-2)" />
          </marker>
        </defs>

        {POINTS.map((p) => {
          const active = p.text === from || p.text === to || p.text === applyTo
          return (
            <g key={p.text}>
              <circle
                cx={p.x}
                cy={p.y}
                r={active ? 4 : 2.6}
                className={`vs-pt${active ? ' active' : ''}`}
              />
              <text x={p.x + 6} y={p.y + 3} className={`vs-label${active ? ' active' : ''}`}>
                {p.text}
              </text>
            </g>
          )
        })}

        {/* the defining arrow, from -> to */}
        <line
          x1={fromP.x}
          y1={fromP.y}
          x2={toP.x}
          y2={toP.y}
          className="vs-arrow-line"
          markerEnd="url(#vs-arrow)"
        />

        {/* the same arrow, copied onto the third word */}
        <line
          x1={srcP.x}
          y1={srcP.y}
          x2={tipX}
          y2={tipY}
          className="vs-arrow-line copy"
          markerEnd="url(#vs-arrow)"
        />
        <circle cx={tipX} cy={tipY} r={3.5} className="vs-tip" />
      </svg>

      <div className="figure-caption">
        The arrow from "{from}" to "{to}" is copied starting at "{applyTo}". The nearest actual
        word to where it lands is <b style={{ color: 'var(--text)' }}>"{result.point.text}"</b>.
        Nothing here was hand-matched: every point's coordinates were fixed before you picked
        anything, and the nearest word is found by measuring distance to all of them. Positions
        and axes have no labels on purpose — a real embedding space has hundreds of dimensions,
        none of them labelled either, and this kind of match lands close but rarely exact.
      </div>
    </div>
  )
}
