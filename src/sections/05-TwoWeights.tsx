import { useMemo, useState } from 'react'
import { Slider } from '../components/ui'

// L(w1, w2) = (w1 - 3)^2 + 3*(w2 + 1)^2, a bowl that is steeper along w2 than w1.
const T1 = 3
const T2 = -1
const LR = 0.12
const START: [number, number] = [-3, 3]

function gradW1(w1: number): number {
  return 2 * (w1 - T1)
}
function gradW2(w2: number): number {
  return 6 * (w2 - T2)
}

function runDescent(steps: number): [number, number][] {
  const path: [number, number][] = [START]
  let [w1, w2] = START
  for (let i = 0; i < steps; i++) {
    w1 = w1 - LR * gradW1(w1)
    w2 = w2 - LR * gradW2(w2)
    path.push([w1, w2])
  }
  return path
}

const S = 220
const PAD = 14
const XMIN = -6
const XMAX = 10
const YMIN = -6
const YMAX = 6

function px(w1: number): number {
  return PAD + ((w1 - XMIN) / (XMAX - XMIN)) * (S - 2 * PAD)
}
function py(w2: number): number {
  return S - PAD - ((w2 - YMIN) / (YMAX - YMIN)) * (S - 2 * PAD)
}

const LEVELS = [4, 16, 36, 64]

export function TwoWeights() {
  const [steps, setSteps] = useState(15)
  const path = useMemo(() => runDescent(steps), [steps])
  const [fw1, fw2] = path[path.length - 1]

  return (
    <div className="figure">
      <div className="figure-head">
        <span className="dot" />
        the same thing, in more dimensions
      </div>

      <p className="figure-caption" style={{ marginTop: 0 }}>
        Now the model has two weights. Each ring is a set of (w&#8321;, w&#8322;) pairs with the
        same loss; the centre, at ({T1}, {T2}), is where the loss is 0.
      </p>

      <Slider label="steps taken" value={steps} min={0} max={25} onChange={setSteps} display={(v) => String(v)} />

      <svg className="tw-svg" viewBox={`0 0 ${S} ${S}`} role="img" aria-label="loss contour plot with descent path">
        {LEVELS.map((lvl) => (
          <ellipse
            key={lvl}
            className="tw-contour"
            cx={px(T1)}
            cy={py(T2)}
            rx={Math.sqrt(lvl) * ((S - 2 * PAD) / (XMAX - XMIN))}
            ry={Math.sqrt(lvl / 3) * ((S - 2 * PAD) / (YMAX - YMIN))}
          />
        ))}
        <circle className="tw-center" cx={px(T1)} cy={py(T2)} r={3} />
        <polyline
          className="tw-path"
          points={path.map(([w1, w2]) => `${px(w1).toFixed(1)},${py(w2).toFixed(1)}`).join(' ')}
          fill="none"
        />
        {path.map(([w1, w2], i) => (
          <circle
            key={i}
            className={`tw-dot${i === path.length - 1 ? ' final' : ''}`}
            cx={px(w1)}
            cy={py(w2)}
            r={i === path.length - 1 ? 5 : 2.5}
          />
        ))}
      </svg>

      <div className="figure-caption">
        After {steps} steps: w&#8321; = {fw1.toFixed(2)}, w&#8322; = {fw2.toFixed(2)}. Each step
        still moves against the gradient, one direction per weight, computed at the same time.
        With two weights that direction is drawn as an arrow on a flat map instead of a single
        number on a line. With a hundred billion weights it is the same computation, just not
        something that can be drawn.
      </div>
    </div>
  )
}
