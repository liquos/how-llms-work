import { useState } from 'react'
import { Slider } from '../components/ui'
import { Arrow, Dot, Plot } from './14-plot'
import { TOKENS, VALUES, outputFor, scoresFor, weightsFor } from './14-model'

/**
 * Scores become weights, weights become a blend of the value vectors.
 * With two vectors this is exactly a linear interpolation. With four it is the
 * same operation with four terms.
 */
export function AttendFigure() {
  const [asker, setAsker] = useState(3)
  const [sharp, setSharp] = useState(10)
  const sharpness = sharp / 10

  const raw = scoresFor(asker)
  const w = weightsFor(asker, sharpness)
  const out = outputFor(asker, sharpness)

  return (
    <div className="figure">
      <div className="figure-head">
        <span className="dot" />
        weights, then a blend of the values
      </div>

      <div className="tokpick">
        {TOKENS.map((t, i) => (
          <button
            key={t}
            className={`tokpick-b${i === asker ? ' on' : ''}`}
            onClick={() => setAsker(i)}
            type="button"
          >
            {t}
          </button>
        ))}
      </div>

      <div className="wbars">
        {TOKENS.map((t, j) => (
          <div key={t} className={`cand${w[j] === Math.max(...w) ? ' top' : ''}`}>
            <span className="cand-t">{t}</span>
            <span className="cand-track">
              <span className="cand-fill" style={{ width: `${w[j] * 100}%` }} />
            </span>
            <span className="cand-p">{(w[j] * 100).toFixed(0)}%</span>
          </div>
        ))}
      </div>

      <Slider
        label="score scaling"
        value={sharp}
        min={0}
        max={40}
        onChange={setSharp}
        display={(v) => `${(v / 10).toFixed(1)}×`}
      />

      <Plot vectors={[...VALUES, out]} label="value vectors and the blended output">
        {VALUES.map((v, j) => (
          <Arrow key={j} to={v} tone="v" dim={w[j] < 0.25} label={TOKENS[j]} />
        ))}
        <Arrow to={out} tone="out" label="out" />
        <Dot at={out} tone="out" />
      </Plot>

      <div className="figure-caption">
        The scores from the previous step are multiplied by the scaling above, then turned into
        weights that add up to 100 percent, using the same softmax as section 6. The output arrow
        is the weighted average of the four value vectors. At a scaling of 0 every weight is 25
        percent and the output sits at the plain average of all four. Raising the scaling pulls
        the weight onto the highest scoring token and the output moves onto its value. With two
        vectors this operation is a linear interpolation. With four it is the same thing with four
        terms. Raw scores at this setting:{' '}
        {raw.map((r) => (r * sharpness).toFixed(2)).join(', ')}.
      </div>
    </div>
  )
}
