import { useState } from 'react'
import { Slider } from '../components/ui'

// total vector width is fixed; every option below divides it evenly, since a
// real model splits one width evenly across its heads
const TOTAL = 12
const OPTIONS = [1, 2, 3, 4, 6, 12]

/**
 * How the head outputs are put back together: laid end to end into one
 * vector of the original width, then multiplied by one more learned matrix
 * so the heads are mixed rather than left in separate blocks.
 */
export function Concat15() {
  const [idx, setIdx] = useState(2) // 3 heads by default, matching the figure above
  const heads = OPTIONS[idx]
  const perHead = TOTAL / heads

  const cellClass = (h: number) => (h % 2 === 0 ? 'cc-cell a' : 'cc-cell b')

  return (
    <div className="figure">
      <div className="figure-head">
        <span className="dot" />
        joining the heads back into one vector
      </div>

      <Slider
        label="heads"
        value={idx}
        min={0}
        max={OPTIONS.length - 1}
        onChange={setIdx}
        display={() => `${heads} head${heads === 1 ? '' : 's'}`}
      />

      <div className="cc-row">
        {Array.from({ length: heads }).map((_, h) => (
          <div key={h} className="cc-group">
            {Array.from({ length: perHead }).map((_, c) => (
              <span key={c} className={cellClass(h)} />
            ))}
          </div>
        ))}
      </div>
      <div className="cc-arrow">concatenate, width {TOTAL}</div>
      <div className="cc-row single">
        {Array.from({ length: heads }).map((_, h) =>
          Array.from({ length: perHead }).map((_, c) => <span key={`${h}-${c}`} className={cellClass(h)} />),
        )}
      </div>
      <div className="cc-arrow">&times; output projection, {TOTAL}&times;{TOTAL}</div>
      <div className="cc-row single">
        {Array.from({ length: TOTAL }).map((_, c) => (
          <span key={c} className="cc-cell out" />
        ))}
      </div>

      <div className="figure-caption">
        {heads} head{heads === 1 ? '' : 's'} &times; {perHead} number{perHead === 1 ? '' : 's'} each ={' '}
        {TOTAL} numbers, the same width the token vector started at. The output projection is one
        more learned matrix, {TOTAL} by {TOTAL}, that mixes the heads together rather than leaving
        them side by side.
      </div>
    </div>
  )
}
