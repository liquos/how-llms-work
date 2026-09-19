import { useState } from 'react'

// a fixed 9-token sentence, hand chosen so three different patterns each have
// a clean answer: a previous token, a subject for a verb, and a matching pair
// of quote marks.
const TOKENS = ['The', 'cat', 'said', '“', 'stop', '”', 'and', 'left', '.']
const N = TOKENS.length
const SUBJECT = 1 // "cat"
const VERB = 2 // "said"
const QUOTE_A = 3
const QUOTE_B = 5

type HeadKind = 'prev' | 'subject' | 'brackets'

/** every row sums to 1; this is a hand-built weight matrix, not a trained one */
function buildHead(kind: HeadKind): number[][] {
  const rows: number[][] = []
  for (let i = 0; i < N; i++) {
    const row = new Array(N).fill(0)
    if (kind === 'prev') {
      if (i === 0) {
        row[0] = 1
      } else {
        row[i - 1] = 0.82
        row[i] = 0.18
      }
    } else if (kind === 'subject') {
      if (i === VERB) {
        row[SUBJECT] = 0.82
        row[VERB] = 0.18
      } else if (i === 0) {
        row[0] = 1
      } else {
        row[i - 1] = 0.3
        row[i] = 0.7
      }
    } else {
      if (i === QUOTE_A) {
        row[QUOTE_B] = 0.82
        row[QUOTE_A] = 0.18
      } else if (i === QUOTE_B) {
        row[QUOTE_A] = 0.82
        row[QUOTE_B] = 0.18
      } else if (i === 0) {
        row[0] = 1
      } else {
        row[i - 1] = 0.3
        row[i] = 0.7
      }
    }
    rows.push(row)
  }
  return rows
}

const HEADS: { key: HeadKind; name: string; caption: string }[] = [
  {
    key: 'prev',
    name: 'head 1: previous token',
    caption: 'Every row puts most of its weight one column to the left of the diagonal.',
  },
  {
    key: 'subject',
    name: 'head 2: subject of the verb',
    caption: `Row "said" (3) puts most of its weight on column "cat" (2), the word doing the saying.`,
  },
  {
    key: 'brackets',
    name: 'head 3: matching quote marks',
    caption: 'The two quote-mark rows point at each other, and at nothing else in particular.',
  },
]

const GRID = 100
const CELL = GRID / N

function Grid({ weights }: { weights: number[][] }) {
  return (
    <svg className="hd-svg" viewBox={`0 0 ${GRID} ${GRID}`} role="img" aria-label="attention weights">
      {weights.map((row, i) =>
        row.map((w, j) => (
          <rect
            key={`${i}-${j}`}
            x={j * CELL}
            y={i * CELL}
            width={CELL - 0.6}
            height={CELL - 0.6}
            className="hd-cell"
            style={{ fillOpacity: w }}
          />
        )),
      )}
    </svg>
  )
}

/**
 * Three heads on the same sentence, each hand-designed to pick out a
 * different relationship. Real heads are found by training, not written by
 * hand; this figure exists to make it obvious what "a different kind of
 * relationship" can mean before the reader is told real heads specialise on
 * their own.
 */
export function Heads15() {
  const [sel, setSel] = useState<'all' | HeadKind>('all')
  const matrices = HEADS.map((h) => ({ ...h, weights: buildHead(h.key) }))

  return (
    <div className="figure">
      <div className="figure-head">
        <span className="dot" />
        the same sentence, three heads
      </div>

      <div className="chips">
        {TOKENS.map((t, i) => (
          <span key={i} className="chip">
            <span className="idx">{String(i).padStart(2, '0')}</span>
            <span className="txt">{t}</span>
          </span>
        ))}
      </div>

      <div className="segmented hd-seg">
        {(['prev', 'subject', 'brackets', 'all'] as const).map((k) => (
          <button key={k} className={sel === k ? 'on' : ''} onClick={() => setSel(k)} type="button">
            {k === 'prev' ? 'previous' : k === 'subject' ? 'subject' : k === 'brackets' ? 'match' : 'all three'}
          </button>
        ))}
      </div>

      <div className="heads-row">
        {matrices.map((h) => (
          <div key={h.key} className={`head-card${sel === 'all' || sel === h.key ? ' active' : ' dim'}`}>
            <div className="head-name">{h.name}</div>
            <Grid weights={h.weights} />
            <div className="head-caption">{h.caption}</div>
          </div>
        ))}
      </div>

      <div className="figure-caption">
        Each row is one token deciding how much weight to put on every other token, including
        itself. One set of query, key and value matrices can only produce one weighting per row.
        Three heads, three separate sets of those matrices, give three different weightings of
        the same sentence at once.
      </div>
    </div>
  )
}
