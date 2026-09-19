import { useMemo, useState } from 'react'
import { Slider } from '../components/ui'

const TARGET = 3
const START_W = -1

function loss(w: number): number {
  return (w - TARGET) ** 2
}
// dL/dw for L(w) = (w - TARGET)^2
function gradient(w: number): number {
  return 2 * (w - TARGET)
}

const W = 300
const H = 160
const PAD = 12
const XMIN = -8
const XMAX = 14
const YMIN = 0
const YMAX = 40

function px(w: number): number {
  const c = Math.max(XMIN, Math.min(XMAX, w))
  return PAD + ((c - XMIN) / (XMAX - XMIN)) * (W - 2 * PAD)
}
function py(l: number): number {
  const c = Math.max(YMIN, Math.min(YMAX, l))
  return H - PAD - ((c - YMIN) / (YMAX - YMIN)) * (H - 2 * PAD)
}

function clampedLoss(w: number): number {
  const c = Math.max(XMIN, Math.min(XMAX, w))
  return loss(c)
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

/** Runs real gradient descent and returns every weight value visited, including the start. */
function runDescent(lr: number, steps: number): number[] {
  const path = [START_W]
  let w = START_W
  for (let i = 0; i < steps; i++) {
    w = w - lr * gradient(w)
    path.push(w)
    if (!Number.isFinite(w) || Math.abs(w) > 1e6) break
  }
  return path
}

export function Descent() {
  const [lr, setLr] = useState(0.3)
  const [steps, setSteps] = useState(12)

  const path = useMemo(() => runDescent(lr, steps), [lr, steps])
  const last = path[path.length - 1]
  const diverged = !Number.isFinite(last) || Math.abs(last) > XMAX + 5

  return (
    <div className="figure">
      <div className="figure-head">
        <span className="dot" />
        the ball steps downhill by itself
      </div>

      <Slider
        label="step size"
        value={lr}
        min={0.02}
        max={1.05}
        step={0.01}
        onChange={setLr}
        display={(v) => v.toFixed(2)}
      />
      <Slider label="number of steps" value={steps} min={0} max={30} onChange={setSteps} display={(v) => String(v)} />

      <svg className="ow-svg" viewBox={`0 0 ${W} ${H}`} role="img" aria-label="gradient descent path">
        <path className="ow-curve" d={curvePath()} fill="none" />
        {path.slice(0, -1).map((w, i) => (
          <line
            key={`seg${i}`}
            className="desc-seg"
            x1={px(w)}
            y1={py(clampedLoss(w))}
            x2={px(path[i + 1])}
            y2={py(clampedLoss(path[i + 1]))}
          />
        ))}
        {path.map((w, i) => (
          <circle
            key={i}
            className={`desc-dot${i === path.length - 1 ? ' final' : ''}`}
            cx={px(w)}
            cy={py(clampedLoss(w))}
            r={i === path.length - 1 ? 6 : 3}
            style={{ opacity: i === path.length - 1 ? 1 : 0.25 + (0.55 * i) / Math.max(1, path.length - 1) }}
          />
        ))}
      </svg>

      <div className="ow-readout">
        <span>
          start w = <b className="mono">{START_W.toFixed(1)}</b>
        </span>
        <span>
          after {path.length - 1} step{path.length - 1 === 1 ? '' : 's'}, w ={' '}
          <b className="mono">{diverged ? 'off the chart' : last.toFixed(2)}</b>
        </span>
      </div>

      <div className="figure-caption">
        {diverged
          ? `At step size ${lr.toFixed(2)}, each step overshoots the bottom further than the last. The weight is moving away from ${TARGET}, not towards it. This is what "too large" means: the step size cannot be trusted to stay near the point it just measured.`
          : lr < 0.08
            ? `At step size ${lr.toFixed(2)}, the ball is still far from the bottom (w = ${TARGET}) after ${steps} steps. Each step is honest but tiny, so it takes many more steps to arrive. This is what "too small" means: correct direction, slow progress.`
            : `At step size ${lr.toFixed(2)}, the ball is closing in on the bottom, w = ${TARGET}. Each step recomputes the slope at the new position and moves against it.`}
      </div>
    </div>
  )
}
