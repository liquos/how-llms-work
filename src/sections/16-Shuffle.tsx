import { useState } from 'react'
import { Slider } from '../components/ui'

const DIM = 4

// five distinct words, so every output can be tracked by which word it belongs to
const WORDS = ['cat', 'chased', 'dog', 'quickly', 'today']

// hand-chosen embeddings, one per word, fixed and not trained
const EMB: Record<string, number[]> = {
  cat: [0.9, 0.1, -0.4, 0.2],
  chased: [0.2, 0.8, 0.1, -0.3],
  dog: [-0.5, 0.3, 0.7, 0.1],
  quickly: [0.1, -0.6, 0.2, 0.5],
  today: [-0.2, 0.2, -0.5, 0.6],
}

// hand-chosen projection matrices, fixed and not trained; distinct from each
// other so query, key and value are visibly different views of the input
const WQ = [
  [0.6, 0.2, -0.1, 0.3],
  [-0.3, 0.7, 0.2, 0.0],
  [0.1, -0.4, 0.5, 0.2],
  [0.2, 0.1, -0.3, 0.6],
]
const WK = [
  [0.4, -0.2, 0.3, 0.1],
  [0.2, 0.5, -0.1, 0.3],
  [-0.3, 0.1, 0.6, 0.0],
  [0.1, 0.3, 0.2, 0.5],
]
const WV = [
  [0.5, 0.1, 0.2, -0.2],
  [0.0, 0.6, 0.1, 0.3],
  [0.3, -0.1, 0.5, 0.1],
  [0.1, 0.2, 0.0, 0.6],
]

// four arrangements of the same five words, index 0 is the original order
const ORDERS = [
  [0, 1, 2, 3, 4],
  [4, 0, 3, 1, 2],
  [2, 4, 0, 3, 1],
  [1, 3, 4, 2, 0],
]

function matVec(m: number[][], v: number[]): number[] {
  return m.map((row) => row.reduce((s, w, i) => s + w * v[i], 0))
}
function dot(a: number[], b: number[]): number {
  return a.reduce((s, x, i) => s + x * b[i], 0)
}
function addVec(a: number[], b: number[]): number[] {
  return a.map((x, i) => x + b[i])
}
function softmax(xs: number[]): number[] {
  const m = Math.max(...xs)
  const ex = xs.map((x) => Math.exp(x - m))
  const sum = ex.reduce((s, x) => s + x, 0)
  return ex.map((x) => x / sum)
}
// the same sinusoidal position vector used in 16-Positions
function posEnc(pos: number, dim: number): number[] {
  const out = new Array(dim).fill(0)
  for (let i = 0; i < dim; i += 2) {
    const angle = pos / Math.pow(10000, i / dim)
    out[i] = Math.sin(angle)
    if (i + 1 < dim) out[i + 1] = Math.cos(angle)
  }
  return out
}

interface WordOut { word: string; vec: number[] }

/** runs a real, small self-attention pass over whichever order is given */
function attend(order: number[], positionsOn: boolean): WordOut[] {
  const seq = order.map((i) => WORDS[i])
  const vecs = seq.map((w, slot) => (positionsOn ? addVec(EMB[w], posEnc(slot, DIM)) : EMB[w].slice()))
  const Q = vecs.map((v) => matVec(WQ, v))
  const K = vecs.map((v) => matVec(WK, v))
  const V = vecs.map((v) => matVec(WV, v))
  const n = seq.length
  const outputs: number[][] = []
  for (let i = 0; i < n; i++) {
    const scores = K.map((k) => dot(Q[i], k) / Math.sqrt(DIM))
    const w = softmax(scores)
    const out = new Array(DIM).fill(0)
    for (let j = 0; j < n; j++) for (let d = 0; d < DIM; d++) out[d] += w[j] * V[j][d]
    outputs.push(out)
  }
  return seq.map((word, slot) => ({ word, vec: outputs[slot] }))
}

const fmt = (v: number[]) => `[${v.map((x) => x.toFixed(2)).join(', ')}]`
const sameVec = (a: number[], b: number[]) => a.every((x, i) => Math.abs(x - b[i]) < 1e-4)

/**
 * Real attention, run twice: once for the original order, once for whichever
 * shuffle the slider picks. With position information off, every word's
 * output is the same in both runs. With it on, the outputs change.
 */
export function Shuffle16() {
  const [arr, setArr] = useState(0)
  const [posOn, setPosOn] = useState(false)

  const baseline = attend(ORDERS[0], posOn)
  const current = attend(ORDERS[arr], posOn)
  const baseByWord = new Map(baseline.map((o) => [o.word, o.vec]))
  const curByWord = new Map(current.map((o) => [o.word, o.vec]))

  return (
    <div className="figure">
      <div className="figure-head">
        <span className="dot" />
        shuffle the sentence, watch each word's output
      </div>

      <div className="chips">
        {current.map((o, i) => (
          <span key={i} className="chip">
            <span className="idx">{String(i).padStart(2, '0')}</span>
            <span className="txt">{o.word}</span>
          </span>
        ))}
      </div>

      <Slider
        label="arrangement"
        value={arr}
        min={0}
        max={ORDERS.length - 1}
        onChange={setArr}
        display={(v) => (v === 0 ? 'original order' : `shuffle ${v}`)}
      />

      <div className="segmented sh-seg">
        <button className={!posOn ? 'on' : ''} onClick={() => setPosOn(false)} type="button">
          position off
        </button>
        <button className={posOn ? 'on' : ''} onClick={() => setPosOn(true)} type="button">
          position on
        </button>
      </div>

      <table className="sh-table">
        <thead>
          <tr>
            <th>word</th>
            <th>output, original order</th>
            <th>output, this arrangement</th>
          </tr>
        </thead>
        <tbody>
          {WORDS.map((w) => {
            const b = baseByWord.get(w)!
            const c = curByWord.get(w)!
            const same = sameVec(b, c)
            return (
              <tr key={w} className={same ? 'same' : 'changed'}>
                <td>{w}</td>
                <td className="num">{fmt(b)}</td>
                <td className="num">
                  {fmt(c)} <span className="sh-tag">{same ? 'same' : 'changed'}</span>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>

      <div className="figure-caption">
        {posOn
          ? 'With position information added in, moving a word to a different slot changes its output: the table above should show every row as "changed" once you move off the original order.'
          : 'With position information off, every row reads "same" no matter which arrangement is selected. Each word’s output depends on which four other words are present, not on the order they arrive in.'}
      </div>
    </div>
  )
}
