import { useMemo, useState } from 'react'
import { Slider } from '../components/ui'

const STEPS = 50
const MARK_K = 40

function fmtValue(v: number): string {
  if (v === 0) return '0'
  if (v >= 0.01 && v < 1000) return v.toFixed(v < 1 ? 4 : 2)
  return v.toExponential(2)
}

export function Decay() {
  const [m, setM] = useState(0.9)

  // honest repeated multiplication: value after k steps is m multiplied by itself k times
  const values = useMemo(() => {
    const out: number[] = [1]
    for (let k = 1; k <= STEPS; k++) out.push(out[k - 1] * m)
    return out
  }, [m])

  const markValue = values[MARK_K]

  const W = 320
  const H = 150
  const padL = 34
  const padR = 10
  const padT = 10
  const padB = 22
  const LOG_CLAMP = 9

  const x = (k: number) => padL + (k / STEPS) * (W - padL - padR)
  const logOf = (v: number) => {
    const l = Math.log10(Math.max(v, 1e-300))
    return Math.max(-LOG_CLAMP, Math.min(LOG_CLAMP, l))
  }
  const y = (v: number) => {
    const l = logOf(v)
    return padT + (1 - (l + LOG_CLAMP) / (LOG_CLAMP * 2)) * (H - padT - padB)
  }

  const path = values.map((v, k) => `${k === 0 ? 'M' : 'L'} ${x(k)} ${y(v)}`).join(' ')
  const zeroY = y(1)

  const behaviour =
    m < 1
      ? `Because ${m.toFixed(2)} is below 1, the value shrinks toward zero as the number of steps grows.`
      : m > 1
        ? `Because ${m.toFixed(2)} is above 1, the value grows without bound as the number of steps grows.`
        : 'At exactly 1.00 the value never changes, however many steps run.'

  return (
    <div className="figure">
      <div className="figure-head">
        <span className="dot" />
        repeated multiplication, {STEPS} steps
      </div>

      <Slider
        label="multiplier per step"
        value={m}
        min={0.5}
        max={1.5}
        step={0.01}
        onChange={setM}
        display={(v) => v.toFixed(2)}
      />

      <svg className="d9-plot" viewBox={`0 0 ${W} ${H}`} role="img" aria-label="value after repeated multiplication, log scale">
        <line x1={padL} y1={zeroY} x2={W - padR} y2={zeroY} className="d9-baseline" />
        <text x={padL - 6} y={zeroY + 3} textAnchor="end" className="d9-axis-label">1</text>
        <text x={padL - 6} y={padT + 8} textAnchor="end" className="d9-axis-label">huge</text>
        <text x={padL - 6} y={H - padB} textAnchor="end" className="d9-axis-label">tiny</text>
        <path d={path} className="d9-line" fill="none" />
        <line x1={x(MARK_K)} y1={padT} x2={x(MARK_K)} y2={H - padB} className="d9-markline" />
        <circle cx={x(MARK_K)} cy={y(markValue)} r="4" className="d9-mark" />
        <text x="8" y={H - 5} className="d9-axis-label">step 0</text>
        <text x={W - 8} y={H - 5} textAnchor="end" className="d9-axis-label">step {STEPS}</text>
      </svg>

      <div className="d9-readout">
        <span>{m.toFixed(2)}<sup>{MARK_K}</sup> ≈</span>
        <span className="mono d9-readout-val">{fmtValue(markValue)}</span>
      </div>

      <div className="figure-caption">
        The line shows what is left of token 1's contribution after each step, if it gets
        multiplied by {m.toFixed(2)} once per step. At step {MARK_K} that is {m.toFixed(2)}
        <sup>{MARK_K}</sup> ≈ {fmtValue(markValue)}. {behaviour} A multiplier of exactly 1.00 is a
        knife edge: move off it in either direction, even slightly, and repeating the
        multiplication enough times sends the value to zero or to infinity.
      </div>
    </div>
  )
}
