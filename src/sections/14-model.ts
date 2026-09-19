/**
 * The toy sentence used through section 14.
 *
 * Vectors are 2D so every step can be drawn. The embeddings and the three
 * matrices were chosen by hand so that the resulting attention rows differ from
 * each other in a way that matches the sentence. In a real model all four of
 * these are learned.
 */

export const TOKENS = ['the', 'cat', 'chased', 'it'] as const

export type Vec = [number, number]
export type Mat = [number, number, number, number] // row major

export const EMBED: Vec[] = [
  [-0.25, 0.82],
  [-1.13, 1.2],
  [-1.55, 0.43],
  [-1.6, 0.18],
]

export const WQ: Mat = [-1.54, -1.49, 0.77, 0.04]
export const WK: Mat = [-1.59, 0.57, -1.01, -1.6]
export const WV: Mat = [0.95, 0.4, -0.5, 0.9]

/** the width of the vectors, used for the 1/sqrt(d) scaling */
export const DIM = 2

export const apply = (M: Mat, v: Vec): Vec => [M[0] * v[0] + M[1] * v[1], M[2] * v[0] + M[3] * v[1]]
export const dot = (a: Vec, b: Vec) => a[0] * b[0] + a[1] * b[1]
export const len = (v: Vec) => Math.hypot(v[0], v[1])
export const scale = (v: Vec, s: number): Vec => [v[0] * s, v[1] * s]
export const add = (a: Vec, b: Vec): Vec => [a[0] + b[0], a[1] + b[1]]

export const QUERIES = EMBED.map((e) => apply(WQ, e))
export const KEYS = EMBED.map((e) => apply(WK, e))
export const VALUES = EMBED.map((e) => apply(WV, e))

export function softmax(xs: number[]): number[] {
  const m = Math.max(...xs)
  const e = xs.map((x) => Math.exp(x - m))
  const s = e.reduce((a, b) => a + b, 0)
  return e.map((x) => x / s)
}

/** raw scores for one asking token: its query against every key */
export function scoresFor(i: number): number[] {
  return KEYS.map((k) => dot(QUERIES[i], k) / Math.sqrt(DIM))
}

/** attention weights for one asking token, optionally hiding later tokens */
export function weightsFor(i: number, sharpness = 1, masked = false): number[] {
  const raw = scoresFor(i).map((s) => s * sharpness)
  if (!masked) return softmax(raw)
  const allowed = raw.map((s, j) => (j <= i ? s : -Infinity))
  return softmax(allowed)
}

/** the output vector for one asking token: the weighted average of every value */
export function outputFor(i: number, sharpness = 1, masked = false): Vec {
  const w = weightsFor(i, sharpness, masked)
  return VALUES.reduce<Vec>((acc, v, j) => add(acc, scale(v, w[j])), [0, 0])
}

/** how far along the query the key projects: the dot product, drawn as a length */
export function projectionOnto(k: Vec, q: Vec): { point: Vec; along: number } {
  const qq = dot(q, q)
  const along = qq === 0 ? 0 : dot(k, q) / qq
  return { point: scale(q, along), along }
}

/**
 * Fixed extents for the plots, so that dragging a slider never rescales the
 * view. Each list covers every value the matching figure can reach.
 */

/** every q, k and v reachable by rotating one embedding through a full turn */
export const QKV_EXTENT: Vec[] = (() => {
  const out: Vec[] = []
  const r = len(EMBED[1])
  for (let a = 0; a < 360; a += 15) {
    const e: Vec = [Math.cos((a * Math.PI) / 180) * r, Math.sin((a * Math.PI) / 180) * r]
    out.push(e, apply(WQ, e), apply(WK, e), apply(WV, e))
  }
  return out
})()

/** every query, key and projection point the scoring figure can draw */
export const SCORE_EXTENT: Vec[] = (() => {
  const out: Vec[] = [...QUERIES, ...KEYS]
  for (const q of QUERIES) for (const k of KEYS) out.push(projectionOnto(k, q).point)
  return out
})()
