import { useState } from 'react'
import { Slider } from '../components/ui'

/** 1 million to 100 billion parameters, spread out over a 0-100 slider */
function paramsAtSlider(v: number): number {
  return 1e6 * Math.pow(1e5, v / 100)
}

function fmtCount(n: number): string {
  if (n >= 1e9) return `${(n / 1e9).toFixed(2)} billion`
  if (n >= 1e6) return `${(n / 1e6).toFixed(1)} million`
  return Math.round(n).toLocaleString()
}

/**
 * probability the model gets one single step of a multi-step task right, as
 * a smooth, gradually rising function of scale. This is the one underlying
 * number both curves below are built from.
 */
function perStepProb(v: number): number {
  return 1 / (1 + Math.exp(-9 * (v / 100 - 0.55)))
}

// the task needs all STEPS steps right, in order, to count as a pass under
// strict, all-or-nothing exact-match scoring
const STEPS = 30

function exactMatch(v: number): number {
  return Math.pow(perStepProb(v), STEPS)
}

const PLOT_W = 340
const PLOT_H = 150
const PAD_L = 32
const PAD_R = 10
const PAD_T = 10
const PAD_B = 18

function xPix(v: number): number {
  return PAD_L + (v / 100) * (PLOT_W - PAD_L - PAD_R)
}
function yPix(p: number): number {
  return PLOT_H - PAD_B - p * (PLOT_H - PAD_B - PAD_T)
}

const SAMPLE_V = Array.from({ length: 51 }, (_, i) => (i / 50) * 100)

function pathFor(fn: (v: number) => number): string {
  return SAMPLE_V.map((v, i) => `${i === 0 ? 'M' : 'L'} ${xPix(v).toFixed(1)} ${yPix(fn(v)).toFixed(1)}`).join(' ')
}

const STEP_PATH = pathFor(perStepProb)
const EXACT_PATH = pathFor(exactMatch)

export function Emergence() {
  const [v, setV] = useState(50)
  const params = paramsAtSlider(v)
  const step = perStepProb(v)
  const exact = exactMatch(v)

  return (
    <div className="figure">
      <div className="figure-head">
        <span className="dot" />
        the same trend, scored two different ways
      </div>

      <Slider label="model size" value={v} min={0} max={100} onChange={setV} display={() => fmtCount(params)} />

      <svg
        className="em-svg"
        viewBox={`0 0 ${PLOT_W} ${PLOT_H}`}
        role="img"
        aria-label="two scoring methods plotted against model size"
      >
        <line className="em-grid" x1={PAD_L} x2={PLOT_W - PAD_R} y1={yPix(0)} y2={yPix(0)} />
        <line className="em-grid" x1={PAD_L} x2={PLOT_W - PAD_R} y1={yPix(1)} y2={yPix(1)} />
        <text className="em-axis" x={PAD_L - 4} y={yPix(0) + 3} textAnchor="end">
          0%
        </text>
        <text className="em-axis" x={PAD_L - 4} y={yPix(1) + 3} textAnchor="end">
          100%
        </text>

        <path className="em-curve step" d={STEP_PATH} fill="none" />
        <path className="em-curve exact" d={EXACT_PATH} fill="none" />

        <line className="em-guide" x1={xPix(v)} x2={xPix(v)} y1={PAD_T} y2={PLOT_H - PAD_B} />
        <circle className="em-dot step" cx={xPix(v)} cy={yPix(step)} r={4} />
        <circle className="em-dot exact" cx={xPix(v)} cy={yPix(exact)} r={4} />
      </svg>

      <div className="em-legend">
        <span className="em-key step">average probability of getting one step right</span>
        <span className="em-key exact">all {STEPS} steps right at once, exact match</span>
      </div>

      <div className="em-readout mono">
        at this size: per-step {Math.round(step * 100)}% · exact-match {Math.round(exact * 100)}%
      </div>

      <div className="figure-caption">
        Both curves come from one number: the model's average probability of getting a single step
        right, which rises smoothly with scale. The exact-match curve is that same number raised
        to the power of {STEPS}, because every one of {STEPS} steps has to be correct at once. A
        smoothly rising fraction, raised to a high power, stays near zero for a long stretch and
        then rises sharply. That is one real, mathematical argument for why some abilities look
        like they appear suddenly at a particular size: the underlying skill was improving the
        whole time, and a strict, all-or-nothing scoring rule hid the improvement until it crossed
        a threshold. It is not the whole story. Some reported jumps are measured with scoring that
        does not have this all-or-nothing property, and whether those particular cases are a
        genuine change in what the model can do, or still a side effect of measurement, is an open
        question that researchers actively disagree about.
      </div>
    </div>
  )
}
