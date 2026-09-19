import { Fragment, useState } from 'react'
import { Slider } from '../components/ui'

export const SHAPES = ['circle', 'square', 'triangle', 'star', 'heart'] as const
export type Shape = (typeof SHAPES)[number]
export const CAPTIONS = ['a circle', 'a square', 'a triangle', 'a star', 'a heart']

export function ShapeIcon({ shape, size = 22 }: { shape: Shape; size?: number }) {
  const s = size
  const stroke = 'currentColor'
  switch (shape) {
    case 'circle':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" aria-hidden>
          <circle cx="12" cy="12" r="8" fill="none" stroke={stroke} strokeWidth="2" />
        </svg>
      )
    case 'square':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" aria-hidden>
          <rect x="5" y="5" width="14" height="14" fill="none" stroke={stroke} strokeWidth="2" />
        </svg>
      )
    case 'triangle':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" aria-hidden>
          <polygon points="12,5 20,19 4,19" fill="none" stroke={stroke} strokeWidth="2" />
        </svg>
      )
    case 'star':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" aria-hidden>
          <polygon
            points="12,4 14.5,9.6 20.5,10.2 16,14.2 17.3,20.1 12,17 6.7,20.1 8,14.2 3.5,10.2 9.5,9.6"
            fill="none"
            stroke={stroke}
            strokeWidth="2"
          />
        </svg>
      )
    case 'heart':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" aria-hidden>
          <path
            d="M12 20 C 4 14, 2 9, 6 6 C 9 4, 12 6.5, 12 9 C 12 6.5, 15 4, 18 6 C 22 9, 20 14, 12 20 Z"
            fill="none"
            stroke={stroke}
            strokeWidth="2"
          />
        </svg>
      )
  }
}

function normalize(v: number[]): number[] {
  const n = Math.sqrt(v.reduce((s, x) => s + x * x, 0)) || 1
  return v.map((x) => x / n)
}
function dot(a: number[], b: number[]): number {
  return a.reduce((s, x, i) => s + x * b[i], 0)
}
function oneHot(i: number, n: number): number[] {
  return Array.from({ length: n }, (_, j) => (j === i ? 1 : 0))
}

const N = SHAPES.length
// caption embeddings: fixed, one direction per caption
const CAPTION_VEC = Array.from({ length: N }, (_, i) => oneHot(i, N))
// image embeddings before any training: each image starts pointing at the
// WRONG caption's direction, two positions over
const START_VEC = Array.from({ length: N }, (_, i) => oneHot((i + 2) % N, N))

/**
 * Similarity is computed for real from vectors that are actually interpolated
 * by the slider, not a pre-drawn picture of a result.
 */
export function Contrastive() {
  const [pct, setPct] = useState(0)
  const t = pct / 100

  const imageVec = Array.from({ length: N }, (_, i) =>
    normalize(START_VEC[i].map((v, k) => v * (1 - t) + CAPTION_VEC[i][k] * t)),
  )
  const sim: number[][] = imageVec.map((iv) => CAPTION_VEC.map((cv) => dot(iv, cv)))

  return (
    <div className="figure">
      <div className="figure-head">
        <span className="dot" />
        training pulls matching pairs together
      </div>

      <Slider
        label="training progress"
        value={pct}
        min={0}
        max={100}
        step={1}
        onChange={setPct}
        display={(v) => `${v}%`}
      />

      <div className="sim-grid" style={{ gridTemplateColumns: `28px repeat(${N}, 1fr)` }}>
        <div />
        {CAPTIONS.map((c) => (
          <div key={c} className="sim-cap">
            {c.replace('a ', '')}
          </div>
        ))}
        {SHAPES.map((shape, i) => (
          <Fragment key={shape}>
            <div className="sim-icon">
              <ShapeIcon shape={shape} size={18} />
            </div>
            {sim[i].map((v, j) => (
              <div
                key={`${shape}${j}`}
                className={`sim-cell${i === j ? ' diag' : ''}`}
                style={{ background: `rgba(106,168,255,${Math.max(0, v) * 0.85})` }}
              >
                {v.toFixed(2)}
              </div>
            ))}
          </Fragment>
        ))}
      </div>

      <div className="figure-caption">
        Row = a drawn shape's vector. Column = a caption's vector. Each cell is the two vectors'
        dot product after both are scaled to length 1, so 1 means pointing the same direction and
        0 means at a right angle. At 0% every image vector points at the wrong caption. Drag to
        100% and watch only the diagonal, the correct pairs, rise toward 1 while every other cell
        falls toward 0. That pull toward matching pairs and push away from everything else is the
        entire training signal.
      </div>
    </div>
  )
}
