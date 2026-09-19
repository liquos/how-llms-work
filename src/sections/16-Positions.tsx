import { useState } from 'react'
import { Slider } from '../components/ui'

const POS_COUNT = 16
const DIM = 12

// the same sinusoidal formula used in 16-Shuffle, at a wider dimension so the
// stripes are visible in a grid
function posEnc(pos: number, dim: number): number[] {
  const out = new Array(dim).fill(0)
  for (let i = 0; i < dim; i += 2) {
    const angle = pos / Math.pow(10000, i / dim)
    out[i] = Math.sin(angle)
    if (i + 1 < dim) out[i + 1] = Math.cos(angle)
  }
  return out
}

const ROWS = Array.from({ length: POS_COUNT }, (_, p) => posEnc(p, DIM))

function dot(a: number[], b: number[]): number {
  return a.reduce((s, x, i) => s + x * b[i], 0)
}
function norm(a: number[]): number {
  return Math.sqrt(dot(a, a))
}
function cosSim(a: number[], b: number[]): number {
  return dot(a, b) / (norm(a) * norm(b))
}

const CELL = 10
const W = DIM * CELL
const H = POS_COUNT * CELL

/**
 * The position vectors as a grid: position down the side, component across.
 * A dot product between two rows is the same comparison used throughout
 * attention, applied here to position instead of content.
 */
export function Positions16() {
  const [sel, setSel] = useState(5)
  const sims = ROWS.map((r) => cosSim(ROWS[sel], r))
  const farIndex = Math.floor((sel + POS_COUNT / 2) % POS_COUNT)

  return (
    <div className="figure">
      <div className="figure-head">
        <span className="dot" />
        position vectors, one row per position
      </div>

      <div className="pg-wrap">
        <svg className="pg-svg" viewBox={`0 0 ${W} ${H}`} role="img" aria-label="position vector grid">
          {ROWS.map((row, p) =>
            row.map((v, c) => (
              <rect
                key={`${p}-${c}`}
                x={c * CELL}
                y={p * CELL}
                width={CELL - 0.6}
                height={CELL - 0.6}
                className={v >= 0 ? 'pg-cell pos' : 'pg-cell neg'}
                style={{ fillOpacity: Math.abs(v) }}
              />
            )),
          )}
          <rect className="pg-hi" x={0} y={sel * CELL} width={W} height={CELL} />
        </svg>
      </div>

      <Slider
        label="position"
        value={sel}
        min={0}
        max={POS_COUNT - 1}
        onChange={setSel}
        display={(v) => `${v}`}
      />

      <div className="pg-sims">
        {sims.map((s, p) => (
          <div key={p} className="pg-sim-row">
            <span className="pg-sim-n">{p}</span>
            <span className="cand-track">
              <span className="cand-fill" style={{ width: `${Math.max(s, 0) * 100}%` }} />
            </span>
            <span className="pg-sim-v">{s.toFixed(2)}</span>
          </div>
        ))}
      </div>

      <div className="figure-caption">
        Position {sel} compared against every other position with a dot product, normalised to
        stay between -1 and 1, the same comparison used for query against key. Positions next to
        {' '}
        {sel} score close to 1. Position {farIndex} scores {sims[farIndex].toFixed(2)}, far lower,
        because it sits many steps away.
      </div>
    </div>
  )
}
