import { useMemo, useState } from 'react'
import { Slider } from '../components/ui'

const SENTENCE = ['The', 'keys', 'to', 'the', 'old', 'cabinet', 'are', 'missing']
const STATE_SIZE = 8

// small deterministic random number generator, so the same "weights" come out
// on every load without writing 8x8 numbers out by hand
function mulberry32(seed: number) {
  let a = seed
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function randMatrix(rows: number, cols: number, rng: () => number): number[][] {
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => rng() * 2 - 1),
  )
}

// one fixed vector per word, standing in for a learned token embedding
function embedding(rng: () => number): number[] {
  return Array.from({ length: STATE_SIZE }, () => rng() * 2 - 1)
}

const rng = mulberry32(7)
const Wx = randMatrix(STATE_SIZE, STATE_SIZE, rng) // token -> state
const Wh = randMatrix(STATE_SIZE, STATE_SIZE, rng) // previous state -> state
const bias = Array.from({ length: STATE_SIZE }, () => rng() * 0.4 - 0.2)
const wordVectors = new Map(
  SENTENCE.map((w) => [w, embedding(mulberry32(w.length * 97 + w.charCodeAt(0)))]),
)

function tanh(x: number): number {
  return Math.tanh(x)
}

/** one recurrent step: new state from the current token and the previous state */
function step(prevState: number[], word: string): number[] {
  const x = wordVectors.get(word)!
  return Array.from({ length: STATE_SIZE }, (_, i) => {
    let sum = bias[i]
    for (let j = 0; j < STATE_SIZE; j++) {
      sum += Wx[i][j] * x[j] + Wh[i][j] * prevState[j]
    }
    return tanh(sum)
  })
}

/** run the recurrence honestly, token by token, and keep every intermediate state */
function runAll(): number[][] {
  let s = Array(STATE_SIZE).fill(0)
  const states: number[][] = [s]
  for (const w of SENTENCE) {
    s = step(s, w)
    states.push(s)
  }
  return states
}

export function Unroll() {
  const states = useMemo(runAll, [])
  const [t, setT] = useState(SENTENCE.length)

  const state = states[t]

  return (
    <div className="figure">
      <div className="figure-head">
        <span className="dot" />
        one loop, unrolled across a sentence
      </div>

      <svg className="u8-loop" viewBox="0 0 220 90" role="img" aria-label="one recurrent step">
        <rect x="60" y="18" width="70" height="46" rx="8" className="u8-box" />
        <text x="95" y="46" textAnchor="middle" className="u8-box-label">
          same weights
        </text>
        <path className="u8-selfarrow" d="M 130 30 C 168 20, 168 62, 130 52" fill="none" />
        <path className="u8-arrowhead" d="M 126 50 L 132 52 L 130 46 Z" />
        <text x="185" y="42" className="u8-loop-label">
          state
        </text>
        <line x1="10" y1="41" x2="58" y2="41" className="u8-inarrow" />
        <text x="8" y="34" className="u8-loop-label" textAnchor="start">
          token
        </text>
      </svg>

      <Slider
        label="tokens processed"
        value={t}
        min={0}
        max={SENTENCE.length}
        onChange={setT}
        display={(v) => `${v} of ${SENTENCE.length}`}
      />

      <div className="chips">
        {SENTENCE.map((w, i) => (
          <span
            key={i}
            className={`chip${i < t ? ' made' : ''}${i === t - 1 ? ' fresh' : ''}`}
          >
            <span className="idx">{String(i).padStart(2, '0')}</span>
            <span className="txt">{w}</span>
          </span>
        ))}
      </div>

      <div className="u8-state-label">
        state after token {t === 0 ? '0 (nothing read yet)' : `${t - 1} ("${SENTENCE[t - 1]}")`}
      </div>
      <div className="u8-bars">
        {state.map((v, i) => (
          <div key={i} className="u8-bar-track">
            <div
              className="u8-bar-fill"
              style={{
                height: `${Math.abs(v) * 50}%`,
                bottom: v >= 0 ? '50%' : undefined,
                top: v < 0 ? '50%' : undefined,
              }}
            />
          </div>
        ))}
      </div>

      <div className="figure-caption">
        Every box in the diagram above is the same block: the same {STATE_SIZE * STATE_SIZE * 2}{' '}
        weight numbers and {STATE_SIZE} biases are used at token 0, at token {SENTENCE.length},
        and at every token between. Only the state and the current token change from step to
        step; the block computing the next state never does.
      </div>
      <div className="figure-caption">
        The slider lets you jump straight to any point, because the state at every step was
        already computed above. The computation itself cannot jump: producing the state after
        token 4 requires the state after token 3 as an input, which requires the state after
        token 2, back to the start of the sentence.
      </div>
    </div>
  )
}
