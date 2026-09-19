import { useMemo, useState } from 'react'
import { Slider } from '../components/ui'

const FILLER = [
  'that', 'the', 'movers', 'left', 'behind', 'in', 'the', 'upstairs', 'hallway', 'after',
  'the', 'long', 'trip', 'from', 'the', 'old', 'house', 'near', 'the', 'river', 'sometime',
  'last', 'autumn', 'when', 'the', 'weather', 'had', 'already', 'turned', 'cold',
]
const RETENTION = 0.88
const MAX_DISTANCE = FILLER.length

export function Agreement() {
  const [distance, setDistance] = useState(0)

  const words = useMemo(() => FILLER.slice(0, distance), [distance])

  // confidence in "are" decays toward chance (50%) as the distance grows,
  // by the same repeated-multiplication rule as the decay figure above
  const arePct = 50 + 47 * Math.pow(RETENTION, distance)
  const isPct = 100 - arePct

  return (
    <div className="figure">
      <div className="figure-head">
        <span className="dot" />
        subject and verb, pulled apart
      </div>

      <Slider
        label="words between subject and verb"
        value={distance}
        min={0}
        max={MAX_DISTANCE}
        onChange={setDistance}
        display={(v) => `${v}`}
      />

      <div className="ag9-sentence">
        <span className="ag9-subject">The keys</span>{' '}
        {words.length > 0 && <span className="ag9-filler">{words.join(' ')} </span>}
        <span className="ag9-verb">are / is</span> on the table.
      </div>

      <div className="cands">
        <div className="cand top">
          <span className="cand-t">are</span>
          <span className="cand-track">
            <span className="cand-fill" style={{ width: `${arePct}%` }} />
          </span>
          <span className="cand-p">{arePct.toFixed(0)}%</span>
        </div>
        <div className="cand">
          <span className="cand-t">is</span>
          <span className="cand-track">
            <span className="cand-fill" style={{ width: `${isPct}%` }} />
          </span>
          <span className="cand-p">{isPct.toFixed(0)}%</span>
        </div>
      </div>

      <div className="figure-caption">
        At distance {distance}, {RETENTION}<sup>{distance}</sup> of the signal from "keys" is
        left, giving {arePct.toFixed(0)}% confidence in "are". At distance 0 that signal is
        almost undamaged. As the filler grows toward {MAX_DISTANCE} words, confidence falls
        toward 50%, which is a coin flip between "are" and "is": the state has decayed to the
        point where it no longer favours either one.
      </div>
    </div>
  )
}
