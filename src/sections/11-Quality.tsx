import { useState } from 'react'
import { Slider } from '../components/ui'

// Illustrative shape only, matching the fall-off past ~20 words reported in
// the 2014 sequence-to-sequence papers. Flat-ish, then a steepening decline.
function quality(len: number): number {
  const base = 88 - len * 0.3
  const extra = len > 20 ? (len - 20) * 1.7 : 0
  return Math.max(15, base - extra)
}

const MAX_LEN = 50
const W = 320
const H = 130
const PAD = 12
const toX = (len: number) => PAD + (len / MAX_LEN) * (W - 2 * PAD)
const toY = (q: number) => H - PAD - (q / 100) * (H - 2 * PAD)

export function Quality() {
  const [len, setLen] = useState(10)
  const q = quality(len)

  const path = Array.from({ length: MAX_LEN + 1 }, (_, i) => i)
    .map((i) => `${i === 0 ? 'M' : 'L'} ${toX(i)} ${toY(quality(i))}`)
    .join(' ')

  return (
    <div className="figure">
      <div className="figure-head">
        <span className="dot" />
        translation quality against sentence length
      </div>

      <Slider label="sentence length" value={len} min={1} max={MAX_LEN} onChange={setLen} display={(v) => `${v} words`} />

      <svg className="quality-plot" viewBox={`0 0 ${W} ${H}`} role="img" aria-label="quality against sentence length">
        <line className="axis" x1={PAD} y1={H - PAD} x2={W - PAD} y2={H - PAD} />
        <line className="axis" x1={PAD} y1={PAD} x2={PAD} y2={H - PAD} />
        <line className="q-marker" x1={toX(20)} y1={PAD} x2={toX(20)} y2={H - PAD} />
        <path className="q-curve" d={path} />
        <circle className="q-dot" cx={toX(len)} cy={toY(q)} r={3.6} />
      </svg>
      <div className="figure-caption" style={{ marginTop: 2 }}>
        Dashed line marks 20 words, where the fall-off starts.
      </div>

      <div className="arith">
        {len} words → illustrative quality score {q.toFixed(0)}%
      </div>

      <div className="figure-caption">
        These numbers are illustrative, not measured, but the shape matches what the 2014 papers
        reported: quality holds up reasonably well under about 20 words, then falls away as
        sentences get longer. The encoder and decoder have not changed. The only thing that
        changed is how much had to fit through the one fixed-size vector between them.
      </div>
    </div>
  )
}
