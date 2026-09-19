import { useState } from 'react'
import { Arrow, Dashed, Dot, Plot } from './14-plot'
import { DIM, KEYS, QUERIES, SCORE_EXTENT, TOKENS, dot, projectionOnto, scoresFor } from './14-model'

/**
 * The scoring step, drawn as a projection. The reader already knows that a dot
 * product measures how much of one vector lies along another, so the score is
 * shown as a dropped perpendicular rather than as arithmetic.
 */
export function DotScoresFigure() {
  const [asker, setAsker] = useState(3)
  const [inspect, setInspect] = useState(1)

  const q = QUERIES[asker]
  const raw = scoresFor(asker)
  const best = raw.indexOf(Math.max(...raw))
  const proj = projectionOnto(KEYS[inspect], q)

  return (
    <div className="figure">
      <div className="figure-head">
        <span className="dot" />
        scoring, as a projection
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
      <div className="figure-caption" style={{ marginTop: 0, marginBottom: 10 }}>
        The token doing the asking. Its query is the long arrow.
      </div>

      <Plot vectors={SCORE_EXTENT} label="query and keys with one projection drawn">
        {KEYS.map((k, j) => (
          <Arrow key={j} to={k} tone="k" dim={j !== inspect} label={j === inspect ? TOKENS[j] : undefined} />
        ))}
        <Arrow to={q} tone="q" label="query" />
        <Dashed a={KEYS[inspect]} b={proj.point} />
        <Dot at={proj.point} tone="q" />
      </Plot>

      <div className="scorelist">
        {TOKENS.map((t, j) => (
          <button
            key={t}
            className={`scorerow${j === inspect ? ' on' : ''}${j === best ? ' best' : ''}`}
            onClick={() => setInspect(j)}
            type="button"
          >
            <span className="sr-name">{t}</span>
            <span className="sr-calc mono">
              ({QUERIES[asker][0].toFixed(2)}, {QUERIES[asker][1].toFixed(2)}) &middot; (
              {KEYS[j][0].toFixed(2)}, {KEYS[j][1].toFixed(2)})
            </span>
            <span className="sr-val mono">{raw[j].toFixed(2)}</span>
          </button>
        ))}
      </div>

      <div className="figure-caption">
        Each score is the dot product of the asking token&rsquo;s query with one token&rsquo;s
        key, divided by the square root of the vector width, here {Math.sqrt(DIM).toFixed(2)}. The
        dashed line drops the selected key onto the query, and the marked point is how far along
        the query it reaches. A key pointing the same way as the query scores high. A key pointing
        across it scores near zero. A key pointing the opposite way scores negative. The raw dot
        product before scaling is {dot(QUERIES[asker], KEYS[inspect]).toFixed(2)}.
      </div>
    </div>
  )
}
