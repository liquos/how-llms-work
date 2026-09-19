import { useState } from 'react'
import { Slider } from '../components/ui'

// width of the coordinate space the bars are drawn in; the svg scales this to
// whatever width the card actually has, via viewBox
const TRACK = 300

/**
 * Two designs, one sentence. The recurrent design needs one time step per
 * token, no matter how many chips are available, because step i reads the
 * state left behind by step i-1. The parallel design has no such dependency:
 * every token's computation only reads the input, so all of them can run on
 * separate chips in the same time step.
 */
export function Parallel13() {
  const [n, setN] = useState(16)
  const [chips, setChips] = useState(1)

  const recurrentSteps = n
  const parallelSteps = Math.ceil(n / chips)
  const speedup = (recurrentSteps / parallelSteps).toFixed(1)
  const tick = TRACK / n
  const parW = TRACK * (parallelSteps / n)

  return (
    <div className="figure">
      <div className="figure-head">
        <span className="dot" />
        training time, two designs, same sentence
      </div>

      <Slider
        label="sentence length"
        value={n}
        min={4}
        max={64}
        onChange={setN}
        display={(v) => `${v} tokens`}
      />
      <Slider
        label="chips available"
        value={chips}
        min={1}
        max={64}
        onChange={setChips}
        display={(v) => `${v} chip${v === 1 ? '' : 's'}`}
      />

      <div className="pk-row">
        <div className="pk-line">
          <span className="pk-label">recurrent</span>
          <svg className="pk-bar" viewBox={`0 0 ${TRACK} 22`} preserveAspectRatio="none" role="img" aria-label="recurrent time">
            <rect className="pk-fill rec" x={0} y={0} width={TRACK} height={22} rx={4} />
            {Array.from({ length: n - 1 }).map((_, i) => (
              <line
                key={i}
                className="pk-tick"
                x1={(i + 1) * tick}
                x2={(i + 1) * tick}
                y1={0}
                y2={22}
              />
            ))}
          </svg>
          <span className="pk-num">{recurrentSteps} steps</span>
        </div>

        <div className="pk-line">
          <span className="pk-label">parallel</span>
          <svg className="pk-bar" viewBox={`0 0 ${TRACK} 22`} preserveAspectRatio="none" role="img" aria-label="parallel time">
            <rect className="pk-fill par" x={0} y={0} width={parW} height={22} rx={4} />
            {Array.from({ length: Math.max(parallelSteps - 1, 0) }).map((_, i) => (
              <line
                key={i}
                className="pk-tick"
                x1={(i + 1) * tick}
                x2={(i + 1) * tick}
                y1={0}
                y2={22}
              />
            ))}
          </svg>
          <span className="pk-num">
            {parallelSteps} step{parallelSteps === 1 ? '' : 's'}
          </span>
        </div>
      </div>

      <div className="figure-caption">
        Recurrent: one time step per token, always, because step i needs the result of step
        i-1. {n} tokens take {n} steps, whether there is 1 chip or 64 sitting idle. Parallel:
        every token's step reads only the input, so it does not wait on any other token. {n}{' '}
        tokens spread across {chips} chip{chips === 1 ? '' : 's'} take ceil({n} / {chips}) ={' '}
        {parallelSteps} step{parallelSteps === 1 ? '' : 's'}.{' '}
        {chips === 1
          ? 'With one chip, both bars are the same length: the two designs cost exactly the same.'
          : `The parallel design finishes ${speedup}x faster on this sentence.`}
      </div>
    </div>
  )
}
