import { useState } from 'react'
import { Slider } from '../components/ui'

// 20 arbitrary candidate values, standing in for "whatever new information
// arrives at this step". Fixed so the figure is reproducible.
const CANDIDATES = [
  0.82, -0.35, 0.51, 0.94, -0.62, 0.18, 0.47, -0.28, 0.73, 0.05, -0.81, 0.62,
  0.11, -0.49, 0.88, -0.17, 0.39, -0.72, 0.56, 0.24,
]
const START = 0.8
const MAX_STEPS = 20

function fmt(n: number): string {
  return (n >= 0 ? '+' : '') + n.toFixed(2)
}

function sequence(retain: number, write: number): number[] {
  const values = [START]
  for (let t = 0; t < MAX_STEPS; t++) {
    values.push(retain * values[t] + write * CANDIDATES[t])
  }
  return values
}

const W = 320
const H = 120
const PAD = 10

function toX(step: number) {
  return PAD + (step / MAX_STEPS) * (W - 2 * PAD)
}
function toY(v: number) {
  // value range -1.2 .. 1.2 mapped to the plot height
  return H - PAD - ((v + 1.2) / 2.4) * (H - 2 * PAD)
}

export function Cell() {
  const [retain, setRetain] = useState(1)
  const [write, setWrite] = useState(0)
  const [steps, setSteps] = useState(20)

  const values = sequence(retain, write)
  const shown = values.slice(0, steps + 1)
  const path = shown.map((v, i) => `${i === 0 ? 'M' : 'L'} ${toX(i)} ${toY(v)}`).join(' ')
  const untouched = retain === 1 && write === 0

  return (
    <div className="figure">
      <div className="figure-head">
        <span className="dot" />
        one component of the cell state
      </div>

      <Slider
        label="retain"
        value={retain}
        min={0}
        max={1}
        step={0.05}
        onChange={setRetain}
        display={(v) => v.toFixed(2)}
      />
      <Slider
        label="write"
        value={write}
        min={0}
        max={1}
        step={0.05}
        onChange={setWrite}
        display={(v) => v.toFixed(2)}
      />
      <Slider label="steps run" value={steps} min={1} max={MAX_STEPS} step={1} onChange={setSteps} />

      <svg className="lstm-plot" viewBox={`0 0 ${W} ${H}`} role="img" aria-label="stored value over steps">
        <line className="axis" x1={PAD} y1={H - PAD} x2={W - PAD} y2={H - PAD} />
        <line className="ref-line" x1={PAD} y1={toY(START)} x2={W - PAD} y2={toY(START)} />
        <path className="curve" d={path} />
        <circle className="dot" cx={toX(steps)} cy={toY(shown[shown.length - 1])} r={3.4} />
      </svg>
      <div className="legend">
        <span><span className="sw accent" />stored value</span>
        <span><span className="sw ref" />value at step 0 (0.80)</span>
      </div>

      <div className="arith">
        new value = retain × old value + write × candidate
        <br />
        step {steps}: {retain.toFixed(2)} × {values[steps - 1].toFixed(2)} + {write.toFixed(2)} ×{' '}
        {fmt(CANDIDATES[steps - 1])} = {fmt(values[steps])}
      </div>

      <div className="era-stack">
        <div className={`era-pane figure-caption${untouched ? ' on' : ''}`} aria-hidden={!untouched}>
          Retain is 1.00 and write is 0.00. The line is flat at 0.80 no matter how many steps run
          or what the candidates are, because every candidate gets multiplied by 0.00 before it is
          added. Try moving either slider away from this setting and watch the line leave 0.80.
        </div>
        <div className={`era-pane figure-caption${untouched ? '' : ' on'}`} aria-hidden={untouched}>
          With retain at {retain.toFixed(2)} and write at {write.toFixed(2)}, the stored value
          drifts toward whatever the candidates are, because some fraction of the old value is
          dropped at every step. Set retain to 1.00 and write to 0.00 to hold the value still.
        </div>
      </div>
    </div>
  )
}
