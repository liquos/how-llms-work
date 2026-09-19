import { useState } from 'react'
import { Slider } from '../components/ui'

// illustrative constants, not fitted to any published run. Real fitted
// exponents from actual training runs are usually somewhere between 0.05 and
// 0.1, and differ by model family; see the caption below the plot.
const ALPHA = 0.062
const SCALE = 55

/** loss as a pure power law of compute: evaluated, not drawn */
function lossAtCompute(flops: number): number {
  return SCALE * Math.pow(flops, -ALPHA)
}

/** 1 million to 100 billion parameters, spread out over a 0-100 slider */
function paramsAtSlider(v: number): number {
  return 1e6 * Math.pow(1e5, v / 100)
}

/** 1 billion to 10 trillion training tokens, spread out over a 0-100 slider */
function tokensAtSlider(v: number): number {
  return 1e9 * Math.pow(1e4, v / 100)
}

/** the standard approximation: about 6 floating point operations per parameter per token */
function computeFlops(params: number, tokens: number): number {
  return 6 * params * tokens
}

function fmtCount(n: number): string {
  if (n >= 1e9) return `${(n / 1e9).toFixed(2)} billion`
  if (n >= 1e6) return `${(n / 1e6).toFixed(1)} million`
  return Math.round(n).toLocaleString()
}

function fmtFlops(n: number): string {
  const exp = Math.floor(Math.log10(n))
  const mant = n / Math.pow(10, exp)
  return `${mant.toFixed(1)} × 10^${exp}`
}

const X_MIN = 15
const X_MAX = 25
const Y_MIN = 1
const Y_MAX = 8

const PLOT_W = 340
const PLOT_H = 200
const PAD_L = 40
const PAD_R = 12
const PAD_T = 12
const PAD_B = 24

function xPix(flops: number): number {
  const t = (Math.log10(flops) - X_MIN) / (X_MAX - X_MIN)
  return PAD_L + t * (PLOT_W - PAD_L - PAD_R)
}
function yPix(loss: number): number {
  const t = (Math.log10(loss) - Math.log10(Y_MIN)) / (Math.log10(Y_MAX) - Math.log10(Y_MIN))
  return PLOT_H - PAD_B - t * (PLOT_H - PAD_B - PAD_T)
}

const CURVE_POINTS = Array.from({ length: 41 }, (_, i) => {
  const logF = X_MIN + (i / 40) * (X_MAX - X_MIN)
  const flops = Math.pow(10, logF)
  return { flops, loss: lossAtCompute(flops) }
})

const CURVE_PATH = CURVE_POINTS.map(
  (p, i) => `${i === 0 ? 'M' : 'L'} ${xPix(p.flops).toFixed(1)} ${yPix(p.loss).toFixed(1)}`
).join(' ')

const GRID_X = [15, 17, 19, 21, 23, 25]
const GRID_Y = [1, 2, 4, 8]

export function ScalingLaw() {
  const [pv, setPv] = useState(55)
  const [dv, setDv] = useState(55)

  const params = paramsAtSlider(pv)
  const tokens = tokensAtSlider(dv)
  const flops = computeFlops(params, tokens)
  const flopsClamped = Math.min(Math.max(flops, Math.pow(10, X_MIN)), Math.pow(10, X_MAX))
  const loss = lossAtCompute(flopsClamped)

  return (
    <div className="figure">
      <div className="figure-head">
        <span className="dot" />
        loss against compute, on log axes
      </div>

      <Slider
        label="parameters"
        value={pv}
        min={0}
        max={100}
        onChange={setPv}
        display={() => fmtCount(params)}
      />
      <Slider
        label="training tokens"
        value={dv}
        min={0}
        max={100}
        onChange={setDv}
        display={() => fmtCount(tokens)}
      />

      <svg
        className="sl-svg"
        viewBox={`0 0 ${PLOT_W} ${PLOT_H}`}
        role="img"
        aria-label="loss against compute on logarithmic axes"
      >
        {GRID_X.map((gx) => (
          <g key={gx}>
            <line
              className="sl-grid"
              x1={xPix(Math.pow(10, gx))}
              x2={xPix(Math.pow(10, gx))}
              y1={PAD_T}
              y2={PLOT_H - PAD_B}
            />
            <text className="sl-axis" x={xPix(Math.pow(10, gx))} y={PLOT_H - PAD_B + 12} textAnchor="middle">
              10^{gx}
            </text>
          </g>
        ))}
        {GRID_Y.map((gy) => (
          <g key={gy}>
            <line className="sl-grid" x1={PAD_L} x2={PLOT_W - PAD_R} y1={yPix(gy)} y2={yPix(gy)} />
            <text className="sl-axis" x={PAD_L - 6} y={yPix(gy) + 3} textAnchor="end">
              {gy}
            </text>
          </g>
        ))}
        <text className="sl-axis-title" x={PAD_L} y="9" textAnchor="start">
          loss
        </text>
        <text className="sl-axis-title" x={PLOT_W / 2} y={PLOT_H - 3} textAnchor="middle">
          compute, in FLOPs (log scale)
        </text>

        <path className="sl-curve" d={CURVE_PATH} fill="none" />
        <line
          className="sl-guide"
          x1={xPix(flopsClamped)}
          x2={xPix(flopsClamped)}
          y1={yPix(loss)}
          y2={PLOT_H - PAD_B}
        />
        <line className="sl-guide" x1={PAD_L} x2={xPix(flopsClamped)} y1={yPix(loss)} y2={yPix(loss)} />
        <circle className="sl-dot" cx={xPix(flopsClamped)} cy={yPix(loss)} r={4.5} />
      </svg>

      <div className="sl-readout mono">
        compute ≈ {fmtFlops(flops)} FLOPs · loss ≈ {loss.toFixed(2)}
      </div>

      <div className="figure-caption">
        The line is one formula, loss = {SCALE} × compute^-{ALPHA}, evaluated at every point shown,
        not a drawn shape. Compute here is parameters × tokens × 6, the standard approximation for
        the number of floating point operations (FLOPs) used in training. Moving either slider
        changes that product, which slides the dot along the same fixed line rather than moving
        the line itself. The exponent and scale used here are illustrative; published exponents
        from real training runs are usually between 0.05 and 0.1, and differ by model family.
      </div>
    </div>
  )
}
