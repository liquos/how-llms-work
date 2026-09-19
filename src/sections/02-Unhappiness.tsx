import { MARK, STEPS, applyMerges, buildVocab } from './02-MergeBuilder'

const VOCAB = buildVocab()
const PIECES = applyMerges('unhappiness', STEPS.length)

function show(sym: string): string {
  return sym.replace(MARK, MARK + ' ')
}

export function Unhappiness() {
  return (
    <div className="figure">
      <div className="figure-head">
        <span className="dot" />
        one word, fully tokenised
      </div>

      <p className="figure-caption" style={{ marginTop: 0, marginBottom: 10 }}>
        "unhappiness" never appeared as a whole word in the eight training sentences above. It is
        built out of pieces the merge steps learned from other words.
      </p>

      <div className="chips">
        {PIECES.map((p, i) => (
          <span key={i} className="chip made">
            <span className="idx">id {VOCAB.indexOf(p)}</span>
            <span className="txt">{show(p)}</span>
          </span>
        ))}
      </div>

      <div className="figure-caption">
        {PIECES.length} tokens for one word. The first one carries the leading space, shown as
        "{MARK}". Each number above is this piece's position in the {VOCAB.length}-symbol list
        this tiny example learned. A real tokenizer's list has tens of thousands of entries,
        built by the same counting process, run on far more text.
      </div>
    </div>
  )
}
