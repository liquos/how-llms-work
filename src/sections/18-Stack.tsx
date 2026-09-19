import { useState } from 'react'
import { Slider } from '../components/ui'

// a fixed vector width, matching the width GPT-2 small uses for every token.
// Real large models also widen this vector as they add blocks; this figure
// holds it fixed so the effect of depth alone is visible.
const D_MODEL = 768
// GPT-2's vocabulary size, used only to size the lookup table at the start
const VOCAB = 50257

// one block: 4 matrices of size d by d for attention (query, key, value,
// output), plus 2 matrices of size d by 4d for the per-token network, which
// is 8 times d squared. Together that is 12 times d squared.
const PARAMS_PER_BLOCK = 12 * D_MODEL * D_MODEL
const EMBED_PARAMS = VOCAB * D_MODEL

function totalParams(blocks: number): number {
  return EMBED_PARAMS + blocks * PARAMS_PER_BLOCK
}

function fmt(n: number): string {
  if (n >= 1e9) return `${(n / 1e9).toFixed(2)} billion`
  if (n >= 1e6) return `${(n / 1e6).toFixed(1)} million`
  return Math.round(n).toLocaleString()
}

const BASE_VECTOR = [0.12, -0.44, 0.81, -0.09, 0.63, -0.27, 0.05, -0.71]

// stands in for "the vector has been edited by this many blocks". Not a real
// forward pass, only a way to show the same 8 numbers moving further from
// where they started as more blocks are added.
function vectorAfter(blocks: number): number[] {
  return BASE_VECTOR.map((b, i) => {
    const drift = Math.sin(blocks * (0.35 + i * 0.11) + i) * Math.min(1, blocks / 24) * 0.85
    return b + drift
  })
}

const TOP = 22
const BOTTOM = 212
const LEFT = 30
const WIDTH = 100

export function Stack() {
  const [blocks, setBlocks] = useState(12)
  const rowH = (BOTTOM - TOP) / blocks
  const outVec = vectorAfter(blocks)
  const firstY = TOP + rowH / 2
  const lastY = BOTTOM - rowH / 2

  return (
    <div className="figure">
      <div className="figure-head">
        <span className="dot" />
        one block, repeated
      </div>

      <Slider
        label="blocks"
        value={blocks}
        min={1}
        max={96}
        onChange={setBlocks}
        display={(v) => `${v} of 96`}
      />

      <svg
        className="stack-svg"
        viewBox={`0 0 340 250`}
        role="img"
        aria-label={`a stack of ${blocks} identical blocks`}
      >
        <text className="stack-tag" x={LEFT + WIDTH / 2} y="10" textAnchor="middle">
          vector in
        </text>
        <line className="stack-leader" x1={LEFT + WIDTH / 2} y1="12" x2={LEFT + WIDTH / 2} y2={TOP - 2} />

        {Array.from({ length: blocks }).map((_, i) => (
          <rect
            key={i}
            className={`stack-block${i % 2 === 1 ? ' alt' : ''}`}
            x={LEFT}
            y={(TOP + i * rowH).toFixed(2)}
            width={WIDTH}
            height={Math.max(rowH - 0.8, 0.6).toFixed(2)}
          />
        ))}

        <line
          className="stack-leader"
          x1={LEFT + WIDTH / 2}
          y1={BOTTOM + 2}
          x2={LEFT + WIDTH / 2}
          y2={BOTTOM + 10}
        />
        <text className="stack-tag" x={LEFT + WIDTH / 2} y="230" textAnchor="middle">
          vector out
        </text>

        {blocks > 1 ? (
          <>
            <line
              className="stack-leader"
              x1={LEFT + WIDTH}
              y1={firstY.toFixed(2)}
              x2="230"
              y2={firstY.toFixed(2)}
            />
            <text className="stack-tag accent" x="234" y={(firstY + 3).toFixed(2)}>
              block 1
            </text>
            <line
              className="stack-leader"
              x1={LEFT + WIDTH}
              y1={lastY.toFixed(2)}
              x2="230"
              y2={lastY.toFixed(2)}
            />
            <text className="stack-tag accent" x="234" y={(lastY + 3).toFixed(2)}>
              block {blocks}
            </text>
          </>
        ) : (
          <>
            <line
              className="stack-leader"
              x1={LEFT + WIDTH}
              y1={firstY.toFixed(2)}
              x2="230"
              y2={firstY.toFixed(2)}
            />
            <text className="stack-tag accent" x="234" y={(firstY + 3).toFixed(2)}>
              the only block
            </text>
          </>
        )}
      </svg>

      <div className="dial-out">
        d = {D_MODEL} numbers per vector · one block = 12·{D_MODEL}² ≈ {fmt(PARAMS_PER_BLOCK)} numbers
        · {blocks} block{blocks === 1 ? '' : 's'} + the lookup table ≈ {fmt(totalParams(blocks))} numbers
        in total
      </div>

      <div className="dial-label" style={{ marginTop: 14 }}>
        one token's vector, entering the stack
      </div>
      <div className="weights">
        {BASE_VECTOR.map((w, i) => (
          <span key={i} className="weight">
            <span style={{ position: 'relative' }}>
              {w >= 0 ? ' ' : ''}
              {w.toFixed(2)}
            </span>
          </span>
        ))}
      </div>

      <div className="dial-label" style={{ marginTop: 14 }}>
        the same vector, after {blocks} block{blocks === 1 ? '' : 's'} have each read it and added
        something back
      </div>
      <div className="weights">
        {outVec.map((w, i) => (
          <span key={i} className="weight">
            <span style={{ position: 'relative' }}>
              {w >= 0 ? ' ' : ''}
              {w.toFixed(2)}
            </span>
          </span>
        ))}
      </div>

      <div className="figure-caption">
        Every rectangle above is the same shape: the same 4 matrices for attention and the same 2
        matrices for the per-token network, described in section 17. Only the numbers inside them
        differ from block to block. At 96 blocks the individual rectangles are too thin to read
        as separate shapes, which is itself the point: depth is just more of the same part.
      </div>
    </div>
  )
}
