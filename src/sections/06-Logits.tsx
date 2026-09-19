// The final vector the network produced for this position, and a learned row of
// numbers for every token in the vocabulary. A score is the dot product of the two.
export const VOCAB = [
  'mat', 'floor', 'sofa', 'rug', 'chair', 'window', 'ceiling', 'door', 'rain', 'garden',
]

export const FINAL_VECTOR = [0.8, -0.3, 1.1, 0.4]

export const EMBED: number[][] = [
  [0.9, 0.1, 0.6, -0.2], // mat
  [0.7, 0.4, 0.3, -0.1], // floor
  [-0.3, 0.8, -0.5, 0.6], // sofa
  [0.5, -0.2, 0.4, 0.3], // rug
  [-0.6, 0.5, -0.3, 0.2], // chair
  [0.2, -0.9, 0.1, 0.7], // window
  [-0.8, -0.4, 0.2, -0.5], // ceiling
  [0.4, 0.3, -0.7, 0.1], // door
  [-0.1, 0.6, 0.8, -0.6], // rain
  [-0.5, -0.6, -0.4, 0.5], // garden
]

function dot(a: number[], b: number[]): number {
  return a.reduce((sum, v, i) => sum + v * b[i], 0)
}

export function computeScores(): number[] {
  return EMBED.map((row) => dot(row, FINAL_VECTOR))
}

export function Logits() {
  const scores = computeScores()
  const order = scores
    .map((_, i) => i)
    .sort((a, b) => scores[b] - scores[a])
  const topIdx = order[0]

  return (
    <div className="figure">
      <div className="figure-head">
        <span className="dot" />
        one score per token
      </div>

      <p className="figure-caption" style={{ marginTop: 0 }}>
        The network produced one vector for this position: ({FINAL_VECTOR.join(', ')}). Every
        token in the vocabulary has its own learned row of numbers, the same length. The score
        for a token is the dot product of its row with that vector.
      </p>

      <div className="logit-list">
        {order.map((i) => (
          <div key={VOCAB[i]} className={`logit-row${i === topIdx ? ' top' : ''}`}>
            <span className="logit-t">{VOCAB[i]}</span>
            <span className="logit-s mono">{scores[i] >= 0 ? '+' : ''}{scores[i].toFixed(2)}</span>
          </div>
        ))}
      </div>

      <div className="logit-detail">
        <div className="figure-caption" style={{ marginTop: 0 }}>
          Arithmetic for the top scorer, &ldquo;{VOCAB[topIdx]}&rdquo;, with its row (
          {EMBED[topIdx].join(', ')}):
        </div>
        <div className="mono logit-sum">
          {EMBED[topIdx]
            .map((v, i) => `${v} × ${FINAL_VECTOR[i]}`)
            .join(' + ')}
          {' = '}
          {scores[topIdx].toFixed(2)}
        </div>
      </div>

      <div className="figure-caption">
        These are raw scores, not probabilities. They can be negative, and they do not sum to
        anything in particular. Turning them into a probability for each token is the next step.
      </div>
    </div>
  )
}
