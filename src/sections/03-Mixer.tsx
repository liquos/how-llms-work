import { useState } from 'react'
import { Slider } from '../components/ui'
import { TOKENS } from './03-LookupTable'

const FROM = TOKENS.find((t) => t.text === 'man')!
const TO = TOKENS.find((t) => t.text === 'woman')!

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t
}

export function Mixer() {
  const [t, setT] = useState(0)
  const vec = FROM.vec.map((v, i) => lerp(v, TO.vec[i], t))

  return (
    <div className="figure">
      <div className="figure-head">
        <span className="dot" />
        one direction, four numbers moving together
      </div>

      <Slider
        label="man → woman"
        value={t}
        min={0}
        max={1}
        step={0.05}
        onChange={setT}
        display={(v) => v.toFixed(2)}
      />

      <div className="mix-bars">
        {vec.map((v, i) => (
          <div key={i} className="mix-row">
            <span className="mix-idx">{i}</span>
            <span className="mix-track">
              <span className="mix-zero" />
              <span
                className="mix-fill"
                style={{
                  left: v >= 0 ? '50%' : `${50 + v * 50}%`,
                  width: `${Math.abs(v) * 50}%`,
                  background: v >= 0 ? 'var(--accent)' : 'var(--warn)',
                }}
              />
            </span>
            <span className="mix-val mono">{v.toFixed(2)}</span>
          </div>
        ))}
      </div>

      <div className="figure-caption">
        One control moved, and all four numbers moved with it, by different amounts. No single
        one of them is "the gender number" — the direction from "man" to "woman" is the
        combination of all four moving together, in these proportions.
      </div>
    </div>
  )
}
