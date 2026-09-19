import { useState } from 'react'
import { Slider } from '../components/ui'

/**
 * A tiny, honest byte-pair-merge trainer. Nothing here is a canned result:
 * every merge is the actual most-frequent adjacent pair in the corpus below,
 * recomputed after each merge is applied.
 */

/** stands in for the space in front of a word */
export const MARK = '·'

export const CORPUS = [
  'the thin cat sat on the warm mat',
  'an unhappy dog felt unhappy again',
  'that unhappy feeling made the day unhappy too',
  'kindness sadness and happiness are words about feeling',
  'the running rabbit kept singing that thing',
  'an unfair ending felt like plain unkindness',
  'the morning light kept the darkness away',
  'the thin cat kept thinking about the running dog',
]

export const MAX_MERGES = 40

export interface MergeStep {
  a: string
  b: string
  merged: string
  count: number
}

function wordCounts(corpus: string[]): Map<string, number> {
  const counts = new Map<string, number>()
  for (const line of corpus) {
    for (const w of line.split(/\s+/).filter(Boolean)) {
      const key = MARK + w
      counts.set(key, (counts.get(key) ?? 0) + 1)
    }
  }
  return counts
}

/** Trains merges on the corpus. Every step: count every adjacent symbol pair
 *  across every word, weighted by how often that word occurs, then merge
 *  whichever pair is most frequent. Stops early if no pair occurs twice. */
function trainBPE(corpus: string[], maxMerges: number): MergeStep[] {
  const counts = wordCounts(corpus)
  const words: { symbols: string[]; count: number }[] = []
  for (const [w, c] of counts) words.push({ symbols: Array.from(w), count: c })

  const steps: MergeStep[] = []

  for (let step = 0; step < maxMerges; step++) {
    const pairCounts = new Map<string, number>()
    for (const { symbols, count } of words) {
      for (let i = 0; i < symbols.length - 1; i++) {
        const pair = symbols[i] + '' + symbols[i + 1]
        pairCounts.set(pair, (pairCounts.get(pair) ?? 0) + count)
      }
    }
    let bestPair = ''
    let bestCount = 0
    for (const [pair, c] of pairCounts) {
      if (c > bestCount) {
        bestCount = c
        bestPair = pair
      }
    }
    if (!bestPair || bestCount <= 1) break
    const [a, b] = bestPair.split('')
    const merged = a + b
    steps.push({ a, b, merged, count: bestCount })
    for (const entry of words) {
      const syms = entry.symbols
      const next: string[] = []
      let i = 0
      while (i < syms.length) {
        if (i < syms.length - 1 && syms[i] === a && syms[i + 1] === b) {
          next.push(merged)
          i += 2
        } else {
          next.push(syms[i])
          i += 1
        }
      }
      entry.symbols = next
    }
  }

  return steps
}

/** computed once, at module load, from the corpus above */
export const STEPS: MergeStep[] = trainBPE(CORPUS, MAX_MERGES)
export const MERGES: [string, string][] = STEPS.map((s) => [s.a, s.b])

/** Tokenises one word using the first `upTo` learned merges, in the order
 *  they were learned. This is the same procedure a trained tokenizer uses
 *  on a word it has never seen as a whole. */
export function applyMerges(word: string, upTo: number): string[] {
  let symbols = Array.from(MARK + word)
  for (let m = 0; m < upTo && m < MERGES.length; m++) {
    const [a, b] = MERGES[m]
    const next: string[] = []
    let i = 0
    while (i < symbols.length) {
      if (i < symbols.length - 1 && symbols[i] === a && symbols[i + 1] === b) {
        next.push(a + b)
        i += 2
      } else {
        next.push(symbols[i])
        i += 1
      }
    }
    symbols = next
  }
  return symbols
}

/** every symbol this tiny example ever learned: the starting characters,
 *  then each merge's result, in the order it was learned */
export function buildVocab(): string[] {
  const chars = new Set<string>([MARK])
  for (const line of CORPUS) {
    for (const ch of line.replace(/\s+/g, '')) chars.add(ch)
  }
  const vocab = [...chars].sort()
  for (const s of STEPS) if (!vocab.includes(s.merged)) vocab.push(s.merged)
  return vocab
}

function show(sym: string): string {
  return sym.replace(MARK, MARK + ' ')
}

export function MergeBuilder() {
  const [step, setStep] = useState(20)
  const current = step > 0 ? STEPS[step - 1] : null
  const word = applyMerges('unhappiness', step)

  return (
    <div className="figure">
      <div className="figure-head">
        <span className="dot" />
        building a vocabulary by counting
      </div>

      <Slider
        label="merge steps"
        value={step}
        min={0}
        max={STEPS.length}
        onChange={setStep}
        display={(v) => `${v} of ${STEPS.length}`}
      />

      <div className="era-stack mb-step">
        {[0, ...STEPS.map((_, i) => i + 1)].map((n) => (
          <div key={n} className={`era-pane${n === step ? ' on' : ''}`} aria-hidden={n !== step}>
            {n === 0 ? (
              <p className="mb-line" style={{ margin: 0 }}>
                No merges yet. Every word above is a sequence of single characters. The most
                frequent adjacent pair in the corpus, counted below, has not been merged.
              </p>
            ) : (
              <p className="mb-line" style={{ margin: 0 }}>
                Merge {n}:{' '}
                <span className="mono mb-sym">"{show(STEPS[n - 1].a)}"</span> +{' '}
                <span className="mono mb-sym">"{show(STEPS[n - 1].b)}"</span> →{' '}
                <span className="mono mb-sym mb-new">"{show(STEPS[n - 1].merged)}"</span>. This
                pair sat next to each other {STEPS[n - 1].count} times, more than any other pair
                in the corpus.
              </p>
            )}

            <div className="figure-caption" style={{ marginBottom: 4 }}>
              learned symbols so far ({n})
            </div>
            <div className="chips mb-chips">
              {n === 0 ? (
                <span className="mb-empty">none</span>
              ) : (
                STEPS.slice(0, n).map((s, i) => (
                  <span key={i} className="chip made">
                    <span className="txt">{show(s.merged)}</span>
                  </span>
                ))
              )}
            </div>

            <div className="figure-caption" style={{ marginBottom: 4 }}>
              "unhappiness" tokenised at this setting
            </div>
            <div className="chips">
              {applyMerges('unhappiness', n).map((p, i) => (
                <span key={i} className="chip">
                  <span className="txt">{show(p)}</span>
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="figure-caption">
        {current
          ? `Notice which pieces appear early: common fragments like "th", "the" and "ing" win before anything word-specific does, purely because they occur more often.`
          : 'Drag the slider to start merging.'}
        {' '}Currently {word.length} piece{word.length === 1 ? '' : 's'} for "unhappiness".
      </div>
    </div>
  )
}
