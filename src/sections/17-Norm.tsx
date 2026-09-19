import { useState } from 'react'
import { Slider } from '../components/ui'
import { layerNorm } from './17-model'

const BASE = [0.4, -1.2, 0.9, 0.1, -0.5, 1.4, -0.2, 0.7]

/** rescaling a bank of numbers to a fixed spread */
export function NormFigure() {
  const [gain, setGain] = useState(10)
  const g = gain / 10
  const before = BASE.map((x) => x * g + (g - 1) * 0.6)
  const after = layerNorm(before)

  const bank = (v: number[], tone: string) => {
    const max = Math.max(...v.map((x) => Math.abs(x)), 0.001)
    return (
      <div className={`bank ${tone}`}>
        {v.map((x, i) => (
          <div key={i} className="bank-cell">
            <div className="bank-track">
              <div
                className={`bank-fill${x < 0 ? ' neg' : ''}`}
                style={{ height: `${(Math.abs(x) / max) * 100}%` }}
              />
            </div>
            <span className="bank-num mono">{x.toFixed(1)}</span>
          </div>
        ))}
      </div>
    )
  }

  const spread = (v: number[]) => {
    const m = v.reduce((a, b) => a + b, 0) / v.length
    return Math.sqrt(v.reduce((a, b) => a + (b - m) ** 2, 0) / v.length)
  }

  return (
    <div className="figure">
      <div className="figure-head">
        <span className="dot" />
        normalising
      </div>

      <div className="normrow">
        <div className="dial-label">before, spread {spread(before).toFixed(2)}</div>
        {bank(before, 'pre')}
      </div>
      <div className="normrow">
        <div className="dial-label">after, spread {spread(after).toFixed(2)}</div>
        {bank(after, 'post')}
      </div>

      <Slider
        label="scale the incoming numbers"
        value={gain}
        min={2}
        max={40}
        onChange={setGain}
        display={(v) => `${(v / 10).toFixed(1)}×`}
      />

      <div className="figure-caption">
        Whatever you do to the size of the numbers going in, the numbers coming out have the same
        spread. Subtract the average, then divide by how far the numbers typically sit from it.
        Stacking a hundred blocks means a hundred chances for the numbers to drift larger or
        smaller, and this step removes that drift at every stage.
      </div>
    </div>
  )
}
