import { useState } from 'react'
import { Slider } from '../components/ui'

// Domain the plot is drawn over.
const XMIN = -4
const XMAX = 4

// A smooth target curve, chosen only so it is not a straight line.
function target(x: number): number {
  return 3.2 * Math.exp(-(x * x) / 6)
}

/**
 * Build N ReLU units whose weighted sum reproduces `target` exactly at N+1 evenly
 * spaced points (knots). Unit i has a breakpoint at knot i and a coefficient computed
 * from the change in slope at that knot. This is the standard fact that a sum of ReLU
 * units is a piecewise linear function, and it is computed here, not hard-coded.
 */
function buildUnits(n: number) {
  const count = n + 1
  const xs = Array.from({ length: count }, (_, i) => XMIN + ((XMAX - XMIN) * i) / n)
  const ys = xs.map(target)
  const slopes: number[] = []
  for (let i = 0; i < n; i++) slopes.push((ys[i + 1] - ys[i]) / (xs[i + 1] - xs[i]))
  const coefs: number[] = []
  for (let i = 0; i < n; i++) coefs.push(slopes[i] - (i === 0 ? 0 : slopes[i - 1]))
  return { xs, ys, coefs }
}

function evalUnits(
  x: number,
  xs: number[],
  y0: number,
  coefs: number[],
  bend: boolean,
): number {
  let v = y0
  for (let i = 0; i < coefs.length; i++) {
    const d = x - xs[i]
    v += coefs[i] * (bend ? Math.max(d, 0) : d)
  }
  return v
}

const W = 300
const H = 160
const PAD = 10
const YMIN = -0.6
const YMAX = 3.8

function px(x: number): number {
  return PAD + ((x - XMIN) / (XMAX - XMIN)) * (W - 2 * PAD)
}
function py(y: number): number {
  return H - PAD - ((y - YMIN) / (YMAX - YMIN)) * (H - 2 * PAD)
}

function pathOf(fn: (x: number) => number): string {
  const steps = 80
  let d = ''
  for (let i = 0; i <= steps; i++) {
    const x = XMIN - 0.3 + ((XMAX - XMIN + 0.6) * i) / steps
    d += `${i === 0 ? 'M' : 'L'} ${px(x).toFixed(1)} ${py(fn(x)).toFixed(1)} `
  }
  return d
}

export function Bending() {
  const [n, setN] = useState(3)
  const [bend, setBend] = useState(true)

  const { xs, ys, coefs } = buildUnits(n)
  const curve = (x: number) => evalUnits(x, xs, ys[0], coefs, bend)

  return (
    <div className="figure">
      <div className="figure-head">
        <span className="dot" />
        what the bending function does to the shape
      </div>

      <div className="segmented">
        <button className={bend ? 'on' : ''} onClick={() => setBend(true)} type="button">
          ReLU on
        </button>
        <button className={!bend ? 'on' : ''} onClick={() => setBend(false)} type="button">
          ReLU off
        </button>
      </div>

      <Slider
        label="ReLU units"
        value={n}
        min={1}
        max={8}
        onChange={setN}
        display={(v) => String(v)}
      />

      <svg className="bend-svg" viewBox={`0 0 ${W} ${H}`} role="img" aria-label="function shape plot">
        <line className="bend-axis" x1={PAD} y1={py(0)} x2={W - PAD} y2={py(0)} />
        <path className="bend-target" d={pathOf(target)} fill="none" />
        <path className="bend-curve" d={pathOf(curve)} fill="none" />
        {bend &&
          xs.slice(0, n).map((x, i) => (
            <circle key={i} className="bend-kink" cx={px(x)} cy={py(curve(x))} r={3} />
          ))}
      </svg>

      <div className="figure-caption">
        Dashed line: a fixed target shape. Solid line: {n} ReLU unit{n === 1 ? '' : 's'} added
        together. {bend
          ? `Each dot is one kink, one per unit. Raise the slider and the curve picks up one more bend and follows the target further.`
          : `With the activation turned off, this is still a straight line for every value of the units slider, because a sum of linear terms in x is itself linear in x.`}
      </div>
    </div>
  )
}
