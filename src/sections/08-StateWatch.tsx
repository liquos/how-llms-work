import { useMemo, useState } from 'react'
import { Slider } from '../components/ui'

const SENTENCE = ['The', 'keys', 'to', 'the', 'old', 'cabinet', 'are', 'missing']
// +1 when the word introduces a plural subject, -1 for a singular one, 0 otherwise.
// Hand-picked, not learned: this is what makes the shape easy to see.
const SIGNAL = [0, 1, 0, 0, 0, -0.3, 0, 0]
const DECAY = 0.82

/** one hand-designed component: decays each step, and jumps on the signal word */
function runComponent(): number[] {
  let v = 0
  const out = [0]
  for (const s of SIGNAL) {
    v = v * DECAY + s
    out.push(v)
  }
  return out
}

export function StateWatch() {
  const values = useMemo(runComponent, [])
  const [t, setT] = useState(SENTENCE.length)

  const W = 320
  const H = 120
  const pad = 18
  const n = SENTENCE.length
  const x = (i: number) => pad + (i / n) * (W - pad * 2)
  const yMax = 1.4
  const y = (v: number) => H / 2 - (v / yMax) * (H / 2 - 10)

  const path = values
    .slice(0, t + 1)
    .map((v, i) => `${i === 0 ? 'M' : 'L'} ${x(i)} ${y(v)}`)
    .join(' ')

  return (
    <div className="figure">
      <div className="figure-head">
        <span className="dot" />
        watching one component of the state
      </div>

      <Slider
        label="tokens processed"
        value={t}
        min={0}
        max={SENTENCE.length}
        onChange={setT}
        display={(v) => `${v} of ${SENTENCE.length}`}
      />

      <svg className="sw8-plot" viewBox={`0 0 ${W} ${H}`} role="img" aria-label="one state component over the sentence">
        <line x1={pad} y1={H / 2} x2={W - pad} y2={H / 2} className="sw8-zero" />
        <path d={path} className="sw8-line" fill="none" />
        {values.slice(0, t + 1).map((v, i) => (
          <circle key={i} cx={x(i)} cy={y(v)} r={i === t ? 4 : 2.5} className={i === t ? 'sw8-dot sw8-dot-now' : 'sw8-dot'} />
        ))}
      </svg>

      <div className="chips">
        {SENTENCE.map((w, i) => (
          <span key={i} className={`chip${i < t ? ' made' : ''}${i === t - 1 ? ' fresh' : ''}`}>
            <span className="idx">{String(i).padStart(2, '0')}</span>
            <span className="txt">{w}</span>
          </span>
        ))}
      </div>

      <div className="figure-caption">
        This single number is component 3 of the 8-number state, hand-designed so it rises by 1
        when it reads "keys" and decays by a factor of {DECAY} every step after that. At token{' '}
        {t}, its value is {values[t].toFixed(2)}. By the time the model reaches "are" it is
        {values[SENTENCE.indexOf('are') + 1] > 0.3 ? ' still clearly positive' : ' close to zero'},
        which is what lets it favour a plural verb.
      </div>
      <div className="figure-caption">
        This component was picked and shaped by hand to make the mechanism visible. A trained
        network arrives at its own components on its own, and they are rarely this tidy or this
        easy to name.
      </div>
    </div>
  )
}
