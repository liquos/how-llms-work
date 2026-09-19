import { useState } from 'react'
import { Slider } from '../components/ui'

// The model has one weight w. Given a fixed input of 1, its prediction is w itself.
// The correct answer is 3. The loss is the squared difference.
const TARGET = 3

function loss(w: number): number {
  return (w - TARGET) ** 2
}

const W = 300
const H = 160
const PAD = 12
const XMIN = -2
const XMAX = 8
const YMIN = 0
const YMAX = 25

function px(w: number): number {
  return PAD + ((w - XMIN) / (XMAX - XMIN)) * (W - 2 * PAD)
}
function py(l: number): number {
  return H - PAD - ((Math.min(l, YMAX) - YMIN) / (YMAX - YMIN)) * (H - 2 * PAD)
}

function curvePath(): string {
  const steps = 80
  let d = ''
  for (let i = 0; i <= steps; i++) {
    const w = XMIN + ((XMAX - XMIN) * i) / steps
    d += `${i === 0 ? 'M' : 'L'} ${px(w).toFixed(1)} ${py(loss(w)).toFixed(1)} `
  }
  return d
}

export function OneWeight() {
  const [w, setW] = useState(-1)
  const l = loss(w)

  return (
    <div className="figure">
      <div className="figure-head">
        <span className="dot" />
        one weight, one loss curve
      </div>

      <p className="figure-caption" style={{ marginTop: 0 }}>
        The model has one weight, w. Given a fixed input of 1, it predicts w. The correct answer
        is {TARGET}. The loss is the squared difference between the prediction and the correct
        answer: (w &minus; {TARGET})&sup2;.
      </p>

      <Slider label="weight w" value={w} min={XMIN} max={XMAX} step={0.1} onChange={setW} display={(v) => v.toFixed(1)} />

      <svg className="ow-svg" viewBox={`0 0 ${W} ${H}`} role="img" aria-label="loss curve">
        <path className="ow-curve" d={curvePath()} fill="none" />
        <line className="ow-drop" x1={px(w)} y1={py(l)} x2={px(w)} y2={H - PAD} />
        <circle className="ow-ball" cx={px(w)} cy={py(l)} r={6} />
      </svg>

      <div className="ow-readout">
        <span>
          w = <b className="mono">{w.toFixed(1)}</b>
        </span>
        <span>
          prediction = <b className="mono">{w.toFixed(1)}</b>
        </span>
        <span>
          loss = ({w.toFixed(1)} &minus; {TARGET})&sup2; = <b className="mono">{l.toFixed(2)}</b>
        </span>
      </div>

      <div className="figure-caption">
        Slide w until the ball sits at the bottom of the curve. The loss reaches 0 exactly at w =
        {' '}{TARGET}, because that is the only value where the prediction matches the correct
        answer.
      </div>
    </div>
  )
}
