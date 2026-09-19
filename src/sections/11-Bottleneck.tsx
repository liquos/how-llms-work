import { useState } from 'react'
import { Slider } from '../components/ui'

const VECTOR_SIZE = 8
const WORDS = [
  'the', 'small', 'grey', 'cat', 'that', 'lived', 'in', 'the', 'old', 'house',
  'near', 'the', 'river', 'slept', 'through', 'most', 'of', 'the', 'long', 'winter',
  'afternoon', 'without', 'once', 'waking', 'up', 'to', 'eat', 'or', 'look', 'outside',
  'while', 'the', 'rain', 'kept', 'falling', 'on', 'the', 'roof', 'above', 'it',
  'and', 'nobody', 'in', 'the', 'house', 'noticed', 'or', 'came', 'to', 'check',
]

// A fixed vector, deterministic from the sentence length, standing in for
// whatever the encoder finally produces. Only used so the bars have something
// stable to show; the exact numbers do not matter.
function encodedVector(len: number): number[] {
  return Array.from({ length: VECTOR_SIZE }, (_, i) => Math.sin(len * (i + 1) * 0.7 + i) * 0.85)
}

export function Bottleneck() {
  const [len, setLen] = useState(8)
  const words = WORDS.slice(0, len)
  const vec = encodedVector(len)

  return (
    <div className="figure">
      <div className="figure-head">
        <span className="dot" />
        encoder into one vector, decoder out of it
      </div>

      <Slider label="input sentence length" value={len} min={2} max={WORDS.length} onChange={setLen} display={(v) => `${v} words`} />

      <div className="funnel">
        <div className="funnel-words">
          {words.map((w, i) => (
            <span key={i} className="funnel-word">{w}</span>
          ))}
        </div>
        <div className="funnel-narrow" aria-hidden="true">
          <svg viewBox="0 0 320 40" preserveAspectRatio="none">
            <path d="M 0 0 L 320 0 L 200 40 L 120 40 Z" />
          </svg>
        </div>
        <div className="funnel-vec">
          {vec.map((v, i) => (
            <span key={i} className="funnel-cell" style={{ opacity: 0.35 + Math.abs(v) * 0.5 }} />
          ))}
        </div>
        <div className="figure-caption" style={{ marginTop: 4, textAlign: 'center' }}>
          {VECTOR_SIZE} numbers, always
        </div>
      </div>

      <div className="figure-caption">
        {words.length} words went in. The vector the decoder receives still has exactly{' '}
        {VECTOR_SIZE} numbers, the same count as it would for a 2-word sentence or a 50-word one.
        Nothing about the encoder or the vector changes size to make room for a longer sentence.
      </div>
    </div>
  )
}
