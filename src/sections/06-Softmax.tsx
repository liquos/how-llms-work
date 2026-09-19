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

export function Softmax() {
  const [temp, setTemp] = useState(1)
  const scores = computeScores()
  const probs = softmax(scores, temp)

  const order = scores.map((_, i) => i).sort((a, b) => probs[b] - probs[a])
  const topIdx = order[0]

  const topScaled = scores[topIdx] / temp
  const expTop = Math.exp(topScaled)
  const sumExp = scores.reduce((s, v) => s + Math.exp(v / temp), 0)

  return (
    <div className="figure">
      <div className="figure-head">
        <span className="dot" />
        temperature turns scores into probabilities
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

      <div className="cands">
        {order.map((i) => (
          <div key={VOCAB[i]} className={`cand${i === topIdx ? ' top' : ''}`}>
            <span className="cand-t">{VOCAB[i]}</span>
            <span className="cand-track">
              <span className="cand-fill" style={{ width: `${(probs[i] * 100).toFixed(1)}%` }} />
            </span>
            <span className="cand-p">{(probs[i] * 100).toFixed(1)}%</span>
          </div>
        ))}
      </div>

      <div className="logit-detail">
        <div className="figure-caption" style={{ marginTop: 0 }}>
          Arithmetic for &ldquo;{VOCAB[topIdx]}&rdquo; at temperature {temp.toFixed(2)}, score{' '}
          {scores[topIdx].toFixed(2)}:
        </div>
        <div className="mono logit-sum">
          exp({scores[topIdx].toFixed(2)} / {temp.toFixed(2)}) = {expTop.toFixed(3)}
        </div>
        <div className="mono logit-sum">
          {expTop.toFixed(3)} / {sumExp.toFixed(3)} (sum over all {VOCAB.length} tokens) ={' '}
          {(probs[topIdx] * 100).toFixed(1)}%
        </div>
      </div>

      <div className="figure-caption">
        {temp < 0.3
          ? 'At a low temperature, dividing by a small number stretches the differences between scores apart before they are exponentiated, so the largest score takes nearly all of the probability.'
          : temp > 1.4
            ? 'At a high temperature, dividing by a large number squeezes the scores toward each other before they are exponentiated, so the probabilities flatten out and no single token dominates.'
            : 'The probabilities always sum to exactly 100%, whatever the temperature. Temperature only changes how unevenly that 100% is split between tokens.'}
      </div>
    </div>
  )
}
