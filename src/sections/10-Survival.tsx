import { useState } from 'react'
import { Slider } from '../components/ui'

interface GateStep {
  retain: number
  write: number
  candidate: number
  label: 'storing' | 'overwriting' | 'holding'
}

const N = 20

// Hand-designed schedule: nothing stored until step 2, held untouched until
// step 15, then overwritten and held again. This stands in for gates that a
// trained network would set from its input; here they are fixed so the
// figure is reproducible.
const GATES: GateStep[] = Array.from({ length: N }, (_, i) => {
  const step = i + 1
  if (step === 2) return { retain: 0, write: 1, candidate: 0.9, label: 'storing' }
  if (step === 15) return { retain: 0, write: 1, candidate: -0.7, label: 'overwriting' }
  return { retain: 1, write: 0, candidate: 0, label: 'holding' }
})

function cellSequence(): number[] {
  const v = [0]
  for (let t = 0; t < N; t++) {
    const g = GATES[t]
    v.push(g.retain * v[t] + g.write * g.candidate)
  }
  return v
}

// The plain recurrent network from section 9: no gates, the previous value is
// simply multiplied by 0.85 at every step after it arrives.
const PLAIN_MULT = 0.85
function plainSequence(): number[] {
  const v = [0, 0]
  for (let t = 2; t <= N; t++) {
    v.push(t === 2 ? 0.9 : v[t - 1] * PLAIN_MULT)
  }
  return v
}

const W = 320
const H = 130
const PAD = 10
const toX = (step: number) => PAD + (step / N) * (W - 2 * PAD)
const toY = (v: number) => H - PAD - ((v + 1.1) / 2.2) * (H - 2 * PAD)

export function Survival() {
  const [step, setStep] = useState(1)
  const cell = cellSequence()
  const plain = plainSequence()

  const cellPath = cell
    .slice(0, step + 1)
    .map((v, i) => `${i === 0 ? 'M' : 'L'} ${toX(i)} ${toY(v)}`)
    .join(' ')
  const plainPath = plain
    .slice(0, step + 1)
    .map((v, i) => `${i === 0 ? 'M' : 'L'} ${toX(i)} ${toY(v)}`)
    .join(' ')

  const g = GATES[step - 1]

  return (
    <div className="figure">
      <div className="figure-head">
        <span className="dot" />
        20 steps, gates driven by the input
      </div>

      <Slider label="step" value={step} min={1} max={N} onChange={setStep} display={(v) => `${v} of ${N}`} />

      <svg className="lstm-plot" viewBox={`0 0 ${W} ${H}`} role="img" aria-label="stored value across 20 steps, gated versus plain">
        <line className="axis" x1={PAD} y1={toY(0)} x2={W - PAD} y2={toY(0)} />
        <path className="curve-plain" d={plainPath} />
        <path className="curve" d={cellPath} />
        <circle className="dot" cx={toX(step)} cy={toY(cell[step])} r={3.4} />
      </svg>
      <div className="legend">
        <span><span className="sw accent" />gated cell</span>
        <span><span className="sw warn" />plain recurrent network, section 9</span>
      </div>

      <div className="gate-row">
        <div className="gate-box">
          <div className="gate-name">retain</div>
          <div className="gate-val">{g.retain.toFixed(2)}</div>
        </div>
        <div className="gate-box">
          <div className="gate-name">write</div>
          <div className="gate-val">{g.write.toFixed(2)}</div>
        </div>
        <div className="gate-box">
          <div className="gate-name">state</div>
          <div className="gate-val" style={{ fontSize: 13 }}>{g.label}</div>
        </div>
      </div>

      <div className="figure-caption">
        At step {step}, the gated cell holds {cell[step].toFixed(2)} and the plain recurrent network holds{' '}
        {plain[step].toFixed(2)}. The gated cell keeps the value it stored at step 2 exactly until step 15
        overwrites it, because write is 0.00 on every step in between. The plain network starts fading the
        moment the value arrives, because it has no write gate to hold it, only the constant 0.85 multiplier
        from section 9.
      </div>
    </div>
  )
}
