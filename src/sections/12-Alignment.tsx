import { useState } from 'react'
import { Slider } from '../components/ui'

const SOURCE = ['la', 'maison', 'bleue'] // French, word for word: "the house blue"
const OUT_ORDER = ['the', 'blue', 'house'] // English reorders the adjective before the noun

// One row of weights per output word, each row summing to 1. Hand-set so
// that output word 2, "blue", peaks on source word 3, "bleue", and output
// word 3, "house", peaks on source word 2, "maison" — the reordering that
// French adjective-noun order produces when translated to English.
const WEIGHTS = [
  [0.86, 0.09, 0.05], // "the"   -> mostly "la"
  [0.07, 0.14, 0.79], // "blue"  -> mostly "bleue" (source word 3)
  [0.08, 0.83, 0.09], // "house" -> mostly "maison" (source word 2)
]

export function Alignment() {
  const [i, setI] = useState(0)
  const weights = WEIGHTS[i]
  const peak = weights.indexOf(Math.max(...weights))

  return (
    <div className="figure">
      <div className="figure-head">
        <span className="dot" />
        alignment: which source words each output word looks at
      </div>

      <Slider
        label="output word"
        value={i}
        min={0}
        max={OUT_ORDER.length - 1}
        onChange={setI}
        display={(v) => `"${OUT_ORDER[v]}"`}
      />

      <div className="align-row">
        {SOURCE.map((w, k) => (
          <div key={k} className="align-cell">
            <div className="align-strip" style={{ opacity: 0.15 + weights[k] * 0.85 }}>
              {weights[k].toFixed(2)}
            </div>
            <div className="align-word">{w}</div>
          </div>
        ))}
      </div>

      <div className="figure-caption">
        Output word "{OUT_ORDER[i]}" puts most of its weight, {weights[peak].toFixed(2)}, on source
        word "{SOURCE[peak]}". Source is French, read in order "la maison bleue" (the, house,
        blue). The English output reorders the adjective before the noun, so output word 2,
        "blue", peaks on source word 3, and output word 3, "house", peaks on source word 2. The
        row of weights bends across the diagonal instead of running straight down it.
      </div>
    </div>
  )
}
