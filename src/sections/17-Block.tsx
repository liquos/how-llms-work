import { useState } from 'react'
import { Slider } from '../components/ui'
import { toSection } from '../router'
import { STAGES, TOKENS, runBlock } from './17-model'

function Bank({ v }: { v: number[] }) {
  const max = Math.max(...v.map((x) => Math.abs(x)), 0.001)
  return (
    <div className="bank">
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

/**
 * The whole block, with one token walked through it. Each named step links back
 * to the section where that step was built.
 */
export function BlockFigure() {
  const [token, setToken] = useState(3)
  const [stage, setStage] = useState(0)
  const vectors = runBlock(token)
  const s = STAGES[stage]

  return (
    <div className="figure">
      <div className="figure-head">
        <span className="dot" />
        one token, through one block
      </div>

      <div className="tokpick">
        {TOKENS.map((t, i) => (
          <button
            key={t}
            className={`tokpick-b${i === token ? ' on' : ''}`}
            onClick={() => setToken(i)}
            type="button"
          >
            {t}
          </button>
        ))}
      </div>

      <div className="blockdiag">
        {STAGES.map((st, i) => (
          <div key={st.key} className="bd-row">
            {i > 0 && <div className="bd-arrow" aria-hidden />}
            <button
              className={`bd-node${i === stage ? ' on' : ''}${st.section ? ' linked' : ''}${
                st.key.startsWith('add') ? ' add' : ''
              }`}
              onClick={() => setStage(i)}
              type="button"
            >
              <span className="bd-name">{st.name}</span>
              {st.section && (
                <span
                  className="bd-link"
                  onClick={(e) => {
                    e.stopPropagation()
                    toSection(st.section!)
                  }}
                >
                  section {st.section}
                </span>
              )}
            </button>
          </div>
        ))}
        <div className="bd-skip s1" aria-hidden />
        <div className="bd-skip s2" aria-hidden />
      </div>

      <Slider
        label="step"
        value={stage}
        min={0}
        max={STAGES.length - 1}
        onChange={setStage}
        display={() => s.name}
      />

      <Bank v={vectors[stage]} />

      <div className="era-stack">
        {STAGES.map((st, i) => (
          <div key={st.key} className={`era-pane${i === stage ? ' on' : ''}`} aria-hidden={i !== stage}>
            <div className="figure-caption" style={{ marginTop: 6 }}>
              {st.note}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
