import { bySection } from '../course/sections'
import { toSection } from '../router'

export interface Stage {
  n: number
  title: string
  /** section that explains this stage */
  section: number
}

export const STAGES: Stage[] = [
  { n: 1, title: 'split the text into tokens', section: 2 },
  { n: 2, title: 'turn each token into a vector', section: 3 },
  { n: 3, title: 'run them through ~100 identical blocks', section: 17 },
  { n: 4, title: 'score every possible next token', section: 6 },
]

/**
 * The map of inference. Same shape everywhere it appears.
 * The bracket on the left is the loop: the output is appended to the input
 * and the whole thing runs again.
 */
export function PipelineMap({ highlight }: { highlight?: number }) {
  return (
    <div className="figure">
      <div className="figure-head">
        <span className="dot" />
        one pass of the machine
      </div>

      <div className="map">
        <div className="map-loopwrap" aria-hidden>
          <div className="loop-bracket" />
          <div className="loop-head" />
          <div className="loop-word">again</div>
        </div>

        <div className="map-end">
          <span className="pin" />
          your text
        </div>

        {STAGES.map((s) => {
          const target = bySection(s.section)
          const live = !!target?.ready
          const dark = s.n === 3
          return (
            <div key={s.n}>
              <div className="map-arrow" aria-hidden />
              <button
                className={[
                  'map-box',
                  highlight === s.n ? 'on' : '',
                  live ? 'live' : '',
                  dark ? 'dark' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                onClick={() => live && toSection(s.section)}
                type="button"
                disabled={!live}
              >
                <span className="map-n">{s.n}</span>
                <span className="map-title">{s.title}</span>
                {live && <span className="map-go">&rsaquo;</span>}
              </button>
            </div>
          )
        })}

        <div className="map-arrow" aria-hidden />
        <div className="map-end out">
          <span className="pin" />
          one new token, added to the end
        </div>
      </div>
    </div>
  )
}
