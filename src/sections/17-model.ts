/**
 * A real transformer block, small enough to show every number.
 *
 * Four tokens, eight numbers per vector. The matrices are produced by a fixed
 * generator so the numbers are the same every time, but nothing here is
 * hand-written output: every stage is computed when the page renders.
 */

export const D = 8
export const HIDDEN = 16
export const TOKENS = ['the', 'cat', 'chased', 'it'] as const

/** small deterministic generator, so the figures are stable between reloads */
function rng(seed: number) {
  let s = seed >>> 0
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0
    return (s / 0xffffffff) * 2 - 1
  }
}

const mkMat = (rows: number, cols: number, seed: number, gain = 1) => {
  const r = rng(seed)
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => (r() * gain) / Math.sqrt(cols)),
  )
}

export const EMBED = mkMat(4, D, 7, 2.2)
const WQ = mkMat(D, D, 11)
const WK = mkMat(D, D, 23)
const WV = mkMat(D, D, 41)
const WO = mkMat(D, D, 67)
const W1 = mkMat(HIDDEN, D, 89, 1.6)
const W2 = mkMat(D, HIDDEN, 101, 1.6)

export const matvec = (M: number[][], v: number[]) => M.map((row) => row.reduce((a, x, i) => a + x * v[i], 0))
export const addv = (a: number[], b: number[]) => a.map((x, i) => x + b[i])
export const dotv = (a: number[], b: number[]) => a.reduce((s, x, i) => s + x * b[i], 0)
export const norm = (v: number[]) => Math.hypot(...v)

export function layerNorm(v: number[]): number[] {
  const mean = v.reduce((a, b) => a + b, 0) / v.length
  const varr = v.reduce((a, b) => a + (b - mean) ** 2, 0) / v.length
  const sd = Math.sqrt(varr + 1e-5)
  return v.map((x) => (x - mean) / sd)
}

export function softmax(xs: number[]): number[] {
  const m = Math.max(...xs)
  const e = xs.map((x) => Math.exp(x - m))
  const s = e.reduce((a, b) => a + b, 0)
  return e.map((x) => x / s)
}

/** self-attention over all four tokens, returning one output vector per token */
export function attention(X: number[][]): { out: number[][]; weights: number[][] } {
  const Q = X.map((x) => matvec(WQ, x))
  const K = X.map((x) => matvec(WK, x))
  const V = X.map((x) => matvec(WV, x))
  const weights = Q.map((q) => softmax(K.map((k) => dotv(q, k) / Math.sqrt(D))))
  const blended = weights.map((w) =>
    V.reduce((acc, v, j) => addv(acc, v.map((x) => x * w[j])), new Array(D).fill(0)),
  )
  return { out: blended.map((b) => matvec(WO, b)), weights }
}

/** the per-token network: one hidden layer with ReLU, exactly as in section 4 */
export function mlp(v: number[]): number[] {
  const h = matvec(W1, v).map((x) => Math.max(0, x))
  return matvec(W2, h)
}

export interface Stage {
  key: string
  name: string
  /** section that explains this step, if there is one */
  section?: number
  note: string
}

export const STAGES: Stage[] = [
  { key: 'in', name: 'vector in', note: 'One vector per token, arriving from the block below.' },
  {
    key: 'attn',
    name: 'self-attention',
    section: 14,
    note: 'Each token collects a blend of every token’s value vector. This is the only step where tokens meet.',
  },
  {
    key: 'add1',
    name: 'add the input back',
    note: 'The attention result is added to the vector that went in, rather than replacing it.',
  },
  { key: 'norm1', name: 'normalise', note: 'The eight numbers are rescaled to a fixed spread.' },
  {
    key: 'mlp',
    name: 'per-token network',
    section: 4,
    note: 'A two-layer network with ReLU, run separately on each token. It sees one token and nothing else.',
  },
  { key: 'add2', name: 'add again', note: 'The network result is added to what went into it.' },
  { key: 'norm2', name: 'normalise', note: 'Rescaled again. This is the vector the next block receives.' },
]

/** every intermediate vector for one token, in order */
export function runBlock(token: number): number[][] {
  const X = EMBED.map((e) => layerNorm(e))
  const { out: attnOut } = attention(X)

  const v0 = X[token]
  const v1 = attnOut[token]
  const v2 = addv(v0, v1)
  const v3 = layerNorm(v2)
  const v4 = mlp(v3)
  const v5 = addv(v3, v4)
  const v6 = layerNorm(v5)
  return [v0, v1, v2, v3, v4, v5, v6]
}

/**
 * Stack the same block repeatedly and measure how much of the original vector
 * is still recognisable, with and without the addition step.
 */
export function stackTrace(depth: number, withResidual: boolean): number[] {
  let v = layerNorm(EMBED[1])
  const start = [...v]
  const out: number[] = [1]
  for (let i = 0; i < depth; i++) {
    const edit = mlp(v)
    v = withResidual ? layerNorm(addv(v, edit)) : layerNorm(edit)
    const cos = dotv(v, start) / (norm(v) * norm(start) || 1)
    out.push(cos)
  }
  return out
}
