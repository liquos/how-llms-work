import { useState } from 'react'
import { Slider } from '../components/ui'

// same assumptions as the model built in sections 2 to 6
const VECTOR_SIZE = 16
const HIDDEN_UNITS = 64
const BASELINE_N = 4

function firstLayerParams(n: number): number {
  // every one of the n token vectors is joined, then fully connected to the hidden layer
  const inputWidth = n * VECTOR_SIZE
  const weights = inputWidth * HIDDEN_UNITS
  const biases = HIDDEN_UNITS
  return weights + biases
}

function fmt(n: number): string {
  return n.toLocaleString('en-US')
}

export function Cost() {
  const [n, setN] = useState(BASELINE_N)

  const inputWidth = n * VECTOR_SIZE
  const weights = inputWidth * HIDDEN_UNITS
  const total = firstLayerParams(n)
  const baseline = firstLayerParams(BASELINE_N)
  const ratio = total / baseline

  return (
    <div className="figure">
      <div className="figure-head">
        <span className="dot" />
        the cost of a wider window
      </div>

      <Slider
        label="window size"
        value={n}
        min={1}
        max={50}
        onChange={setN}
        display={(v) => `${v} tokens`}
      />

      <div className="c7-rows">
        <div className="c7-row">
          <span>vector size (from section 3)</span>
          <span className="mono">{VECTOR_SIZE}</span>
        </div>
        <div className="c7-row">
          <span>joined input width</span>
          <span className="mono">{n} × {VECTOR_SIZE} = {fmt(inputWidth)}</span>
        </div>
        <div className="c7-row">
          <span>hidden units (from section 4)</span>
          <span className="mono">{HIDDEN_UNITS}</span>
        </div>
        <div className="c7-row">
          <span>first-layer weights</span>
          <span className="mono">{fmt(inputWidth)} × {HIDDEN_UNITS} = {fmt(weights)}</span>
        </div>
        <div className="c7-row c7-total">
          <span>plus {HIDDEN_UNITS} biases</span>
          <span className="mono">{fmt(total)} parameters</span>
        </div>
      </div>

      <div className="c7-bar-track">
        <div
          className="c7-bar-fill"
          style={{ width: `${Math.min(100, (n / 50) * 100)}%` }}
        />
      </div>

      <div className="figure-caption">
        At a window of {BASELINE_N} tokens this layer has {fmt(baseline)} parameters. At{' '}
        {n} tokens it has {fmt(total)}, which is {ratio.toFixed(1)}× as many. The count grows in
        direct proportion to the window size: double the window, double this part of the model.
      </div>
    </div>
  )
}
