import { useState } from 'react'
import type { CSSProperties } from 'react'
import { Slider } from '../components/ui'

export interface TokenRow {
  id: number
  text: string
  vec: number[]
}

/** twelve tokens and a hand-placed 4-number vector for each. These are the
 *  numbers a trained model would have learned; here they are simply typed in
 *  so the figure can show a lookup instead of a training run. */
export const TOKENS: TokenRow[] = [
  { id: 0, text: 'man', vec: [0.62, -0.18, 0.41, 0.05] },
  { id: 1, text: 'woman', vec: [0.58, 0.63, 0.09, 0.44] },
  { id: 2, text: 'king', vec: [0.71, -0.22, 0.85, 0.12] },
  { id: 3, text: 'queen', vec: [0.66, 0.59, 0.77, 0.51] },
  { id: 4, text: 'cat', vec: [-0.34, 0.02, -0.12, 0.77] },
  { id: 5, text: 'dog', vec: [-0.31, -0.08, -0.15, 0.71] },
  { id: 6, text: 'apple', vec: [-0.55, 0.11, -0.63, -0.22] },
  { id: 7, text: 'banana', vec: [-0.51, 0.14, -0.59, -0.19] },
  { id: 8, text: 'run', vec: [0.1, -0.44, 0.22, -0.61] },
  { id: 9, text: 'walk', vec: [0.08, -0.39, 0.18, -0.55] },
  { id: 10, text: 'red', vec: [-0.19, 0.33, 0.48, -0.08] },
  { id: 11, text: 'blue', vec: [-0.22, 0.31, 0.44, -0.05] },
]

/** accent (positive) and warn (orange, negative) — the same two colours used
 *  everywhere else in the app, just applied at an alpha that follows |value| */
function cellStyle(v: number): CSSProperties {
  const alpha = Math.min(1, Math.abs(v)) * 0.75 + 0.06
  const rgb = v >= 0 ? '106, 168, 255' : '240, 179, 92'
  return { background: `rgba(${rgb}, ${alpha})` }
}

export function LookupTable() {
  const [i, setI] = useState(2)
  const row = TOKENS[i]

  return (
    <div className="figure">
      <div className="figure-head">
        <span className="dot" />
        the embedding table
      </div>

      <Slider
        label="token"
        value={i}
        min={0}
        max={TOKENS.length - 1}
        onChange={setI}
        display={() => `id ${i}: "${row.text}"`}
      />

      <div className="lut-table">
        {TOKENS.map((t, n) => (
          <div key={t.id} className={`lut-row${n === i ? ' on' : ''}`}>
            <span className="lut-id">{t.id}</span>
            <span className="lut-word">{t.text}</span>
            <span className="lut-cells">
              {t.vec.map((v, k) => (
                <span key={k} className="lut-cell" style={cellStyle(v)}>
                  {v.toFixed(2)}
                </span>
              ))}
            </span>
          </div>
        ))}
      </div>

      <div className="figure-caption">
        Token ID {row.id} points at row {row.id}. Nothing is computed to get{' '}
        <span className="mono">[{row.vec.map((v) => v.toFixed(2)).join(', ')}]</span>: that row
        was already sitting in this table before "{row.text}" was ever looked up. A real table
        has one row per vocabulary entry — tens of thousands of them — and a few hundred to a few
        thousand numbers per row instead of 4.
      </div>
    </div>
  )
}
