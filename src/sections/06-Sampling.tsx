import { useState } from 'react'
import { Slider } from '../components/ui'
import { VOCAB, computeScores } from './06-Logits'

function softmax(scores: number[], temperature: number): number[] {
  const scaled = scores.map((s) => s / temperature)
  const max = Math.max(...scaled)
  const exps = scaled.map((s) => Math.exp(s - max))
  const total = exps.reduce((a, b) => a + b, 0)
  return exps.map((e) => e / total)
}

/** Draws one index from `probs` using a single random number. */
function drawFrom(probs: number[]): number {
  const r = Math.random()
  let acc = 0
  for (let i = 0; i < probs.length; i++) {
    acc += probs[i]
    if (r <= acc) return i
  }
  return probs.length - 1
}

export function Sampling() {
  const [temp, setTemp] = useState(0.8)
  const [counts, setCounts] = useState<number[]>(() => VOCAB.map(() => 0))
  const scores = computeScores()
  const probs = softmax(scores, temp)
  const total = counts.reduce((a, b) => a + b, 0)

  const order = scores.map((_, i) => i).sort((a, b) => probs[b] - probs[a])

  function draw() {
    const i = drawFrom(probs)
    setCounts((c) => c.map((n, j) => (j === i ? n + 1 : n)))
  }
  function reset() {
    setCounts(VOCAB.map(() => 0))
  }

  return (
    <div className="figure">
      <div className="figure-head">
        <span className="dot" />
        drawing from the distribution
      </div>

      <Slider
        label="temperature"
        value={temp}
        min={0.1}
        max={2}
        step={0.05}
        onChange={setTemp}
        display={(v) => v.toFixed(2)}
      />

      <div className="samp-buttons">
        <button className="btn primary" onClick={draw} type="button">
          Draw one sample
        </button>
        <button className="btn ghost" onClick={reset} type="button">
          Reset tally
        </button>
      </div>

      <div className="cands">
        {order.map((i) => (
          <div key={VOCAB[i]} className="cand">
            <span className="cand-t">{VOCAB[i]}</span>
            <span className="cand-track">
              <span
                className="cand-fill"
                style={{ width: `${total === 0 ? 0 : (counts[i] / total) * 100}%` }}
              />
            </span>
            <span className="cand-p">{counts[i]}</span>
          </div>
        ))}
      </div>

      <div className="figure-caption">
        {total === 0
          ? 'No draws yet. The bars above show the probability each token has of being picked; the tally on the right fills in as you draw.'
          : `${total} draw${total === 1 ? '' : 's'} so far. The probabilities above do not change between draws, only which token gets picked. Given enough draws, the tally settles toward the same shape as the probabilities.`}
      </div>
    </div>
  )
}
