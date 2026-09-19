import { useState } from 'react'
import type { CSSProperties } from 'react'
import { TOKENS, weightsFor } from './14-model'

/**
 * Every row of the attention matrix at once. None of the rows depends on
 * another, which is the property part 3 opened with.
 */
export function MatrixFigure() {
  const [masked, setMasked] = useState(false)
  const rows = TOKENS.map((_, i) => weightsFor(i, 1, masked))

  return (
    <div className="figure">
      <div className="figure-head">
        <span className="dot" />
        all four rows, computed at the same time
      </div>

      <div className="segmented">
        <button className={masked ? '' : 'on'} onClick={() => setMasked(false)} type="button">
          every token
        </button>
        <button className={masked ? 'on' : ''} onClick={() => setMasked(true)} type="button">
          earlier tokens only
        </button>
      </div>

      <div className="amatrix">
        <div className="am-corner" />
        {TOKENS.map((t) => (
          <div key={`c${t}`} className="am-col">
            {t}
          </div>
        ))}
        {rows.flatMap((row, i) => [
          <div key={`r${i}`} className="am-row">
            {TOKENS[i]}
          </div>,
          ...row.map((v, j) => (
            <div
              key={`${i}-${j}`}
              className={`am-cell${v < 0.001 ? ' off' : ''}`}
              style={{ '--w': v } as CSSProperties}
            >
              <span>{v < 0.001 ? '' : (v * 100).toFixed(0)}</span>
            </div>
          )),
        ])}
      </div>

      <div className="figure-caption">
        Each row is one token asking, each column is one token being looked at, and the numbers
        in a row add up to 100. Nothing in row 3 depends on row 2, so all four rows are computed
        in one go. That is the property that made this design worth switching to.
        <br />
        <br />
        The second setting hides later tokens. A model that predicts the next token must not be
        allowed to look at tokens it has not produced yet, so during training the upper right of
        this grid is blocked off. It is the same computation with some scores set aside before
        the weights are worked out.
      </div>
    </div>
  )
}
