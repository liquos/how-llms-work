import { useState } from 'react'
import { Slider } from '../components/ui'

interface Word {
  text: string
  /** approximate rank of this word by frequency in ordinary English text, 1 = most common */
  rank: number
}

const SENTENCE: Word[] = [
  { text: 'The', rank: 1 },
  { text: 'elephant', rank: 4800 },
  { text: 'carefully', rank: 1400 },
  { text: 'avoided', rank: 2600 },
  { text: 'the', rank: 1 },
  { text: 'biodegradable', rank: 55000 },
  { text: 'packaging', rank: 9000 },
  { text: 'near', rank: 900 },
  { text: 'the', rank: 1 },
  { text: 'hydroponic', rank: 150000 },
  { text: 'riverbank', rank: 42000 },
  { text: '.', rank: 1 },
]

// Rough coverage of ordinary English text at a few vocabulary sizes. English
// word frequency is heavily skewed: a handful of words account for most of
// any running text, and coverage rises more and more slowly after that.
// These anchor points are widely reported estimates; the curve between them
// is computed by interpolation, not by a separate number per slider position.
const ANCHORS: [number, number][] = [
  [100, 50],
  [1000, 75],
  [3000, 90],
  [10000, 95],
  [50000, 98],
  [100000, 99],
]

function coverageAt(v: number): number {
  if (v <= ANCHORS[0][0]) return ANCHORS[0][1]
  for (let i = 0; i < ANCHORS.length - 1; i++) {
    const [v0, c0] = ANCHORS[i]
    const [v1, c1] = ANCHORS[i + 1]
    if (v <= v1) {
      const t = (Math.log(v) - Math.log(v0)) / (Math.log(v1) - Math.log(v0))
      return c0 + (c1 - c0) * t
    }
  }
  return ANCHORS[ANCHORS.length - 1][1]
}

/** slider 0..100 maps log-linearly onto a vocabulary size from 100 to 100,000 */
function vocabAt(slider: number): number {
  return Math.round(100 * Math.pow(1000, slider / 100))
}

function fmt(n: number): string {
  return n.toLocaleString('en-US')
}

export function VocabTradeoff() {
  const [slider, setSlider] = useState(50)
  const vocab = vocabAt(slider)
  const coverage = coverageAt(vocab)
  const known = SENTENCE.filter((w) => w.rank <= vocab).length

  return (
    <div className="figure">
      <div className="figure-head">
        <span className="dot" />
        one word per token, at different list sizes
      </div>

      <Slider
        label="vocabulary size"
        value={slider}
        min={0}
        max={100}
        onChange={setSlider}
        display={() => `${fmt(vocab)} words`}
      />

      <div className="vocab-sentence">
        {SENTENCE.map((w, i) => (
          <span key={i} className={`vocab-word${w.rank > vocab ? ' unknown' : ''}`}>
            {w.rank > vocab ? '[UNK]' : w.text}
          </span>
        ))}
      </div>

      <div className="vocab-stats">
        <div className="vocab-stat">
          <span className="vocab-stat-n">
            {known} of {SENTENCE.length}
          </span>
          <span className="vocab-stat-l">words in this sentence are on the list</span>
        </div>
        <div className="vocab-stat">
          <span className="vocab-stat-n">{coverage.toFixed(0)}%</span>
          <span className="vocab-stat-l">of ordinary English text is covered at this size</span>
        </div>
      </div>

      <div className="figure-caption">
        {vocab <= 500
          ? 'At this size almost every word is missing, including ordinary ones like "carefully" and "near".'
          : vocab >= 80000
            ? 'Even at 100,000 words, a word like "hydroponic" is still missing. There is always a rarer word waiting outside the list.'
            : 'Coverage keeps rising as the list grows, but more and more slowly. Doubling the list size does not double the coverage.'}
      </div>
    </div>
  )
}
