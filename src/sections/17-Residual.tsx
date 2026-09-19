import { useState } from 'react'
import { Slider } from '../components/ui'
import { stackTrace } from './17-model'

const DEPTH = 24
const W = 320
const H = 150
const PAD = 28

/**
 * What the addition step is for. The same edit applied over and over, with the
 * input added back and without it.
 */
export function ResidualFigure() {
  const [depth, setDepth] = useState(12)
  const withR = stackTrace(DEPTH, true)
  const without = stackTrace(DEPTH, false)

  const px = (i: number) => PAD + (i / DEPTH) * (W - PAD * 2)
  const py = (v: number) => H - PAD - ((v + 1) / 2) * (H - PAD * 2)
  const path = (xs: number[]) => xs.slice(0, depth + 1).map((v, i) => `${i ? 'L' : 'M'} ${px(i)} ${py(v)}`).join(' ')

  return (
    <div className="figure">
      <div className="figure-head">
        <span className="dot" />
        why the input is added back
      </div>

      <svg className="rplot" viewBox={`0 0 ${W} ${H}`} role="img" aria-label="signal through stacked blocks">
        <line className="axis" x1={PAD} y1={py(0)} x2={W - PAD} y2={py(0)} />
        <line className="axis" x1={PAD} y1={py(1)} x2={W - PAD} y2={py(1)} />
        <text className="rlab" x={PAD - 6} y={py(1) + 3.5} textAnchor="end">1</text>
        <text className="rlab" x={PAD - 6} y={py(0) + 3.5} textAnchor="end">0</text>
        <path className="rline off" d={path(without)} fill="none" />
        <path className="rline on" d={path(withR)} fill="none" />
        <circle className="rdot on" cx={px(depth)} cy={py(withR[depth])} r="3.5" />
        <circle className="rdot off" cx={px(depth)} cy={py(without[depth])} r="3.5" />
        <text className="rlab" x={W - PAD} y={H - 8} textAnchor="end">blocks</text>
      </svg>

      <Slider
        label="blocks stacked"
        value={depth}
        min={1}
        max={DEPTH}
        onChange={setDepth}
        display={(v) => `${v}`}
      />

      <div className="rkey">
        <span className="rk on">with the addition: {withR[depth].toFixed(2)}</span>
        <span className="rk off">without it: {without[depth].toFixed(2)}</span>
      </div>

      <div className="figure-caption">
        The line is how much of the starting vector is still pointing the same way after passing
        through that many blocks. With the addition, each block edits the vector and most of what
        went in survives. Without it, each block replaces the vector, and after a few blocks
        nothing of the original direction is left. The block is meant to adjust what it is given,
        not to produce something new, and the addition is what makes that the default.
      </div>
    </div>
  )
}
