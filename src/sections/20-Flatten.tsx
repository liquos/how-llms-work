import { useEffect, useRef, useState } from 'react'
import { Slider } from '../components/ui'
import { scenePixel } from './20-Patches'

const IMG = 224
const PATCH = 16
const PER_SIDE = IMG / PATCH // 14
const OUT_WIDTH = 8

/** deterministic pseudo-random numbers, so the projection is the same on every load */
function mulberry32(seed: number) {
  let a = seed
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// fixed projection matrix: OUT_WIDTH rows, one per output number, each row has
// one weight per flattened pixel value (16 * 16 * 3 = 768 of them)
const rand = mulberry32(20)
const FLAT_LEN = PATCH * PATCH * 3
const PROJECTION: number[][] = Array.from({ length: OUT_WIDTH }, () =>
  Array.from({ length: FLAT_LEN }, () => rand() * 0.1 - 0.05),
)

export function Flatten() {
  const zoomRef = useRef<HTMLCanvasElement | null>(null)
  // default patch lands on the barn wall, so it looks like something
  const [idx, setIdx] = useState(10 * PER_SIDE + 9)

  const row = Math.floor(idx / PER_SIDE)
  const col = idx % PER_SIDE
  const x0 = col * PATCH
  const y0 = row * PATCH

  const pixels: [number, number, number][] = []
  for (let y = 0; y < PATCH; y++) {
    for (let x = 0; x < PATCH; x++) {
      pixels.push(scenePixel(x0 + x, y0 + y, IMG))
    }
  }

  useEffect(() => {
    const canvas = zoomRef.current
    const ctx = canvas?.getContext('2d')
    if (!ctx) return
    const img = ctx.createImageData(PATCH, PATCH)
    pixels.forEach(([r, g, b], i) => {
      img.data[i * 4] = r
      img.data[i * 4 + 1] = g
      img.data[i * 4 + 2] = b
      img.data[i * 4 + 3] = 255
    })
    ctx.putImageData(img, 0, 0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx])

  const flat: number[] = []
  pixels.forEach(([r, g, b]) => {
    flat.push(r / 255, g / 255, b / 255)
  })

  const projected = PROJECTION.map((weights) => weights.reduce((sum, w, i) => sum + w * flat[i], 0))

  return (
    <div className="figure">
      <div className="figure-head">
        <span className="dot" />
        one square, flattened
      </div>

      <Slider
        label="which square"
        value={idx}
        min={0}
        max={PER_SIDE * PER_SIDE - 1}
        step={1}
        onChange={setIdx}
        display={() => `row ${row}, column ${col}`}
      />

      <div className="flatten-row">
        <canvas ref={zoomRef} width={PATCH} height={PATCH} className="zoom-canvas" />
        <span className="flatten-arrow">&rarr;</span>
        <div className="pixel-grid">
          {pixels.map(([r, g, b], i) => (
            <span key={i} style={{ background: `rgb(${r},${g},${b})` }} />
          ))}
        </div>
      </div>

      <div className="patch-formula mono">
        16 &times; 16 pixels &times; 3 color numbers each = <b>{FLAT_LEN} numbers</b>, one row.
      </div>

      <div className="figure-caption" style={{ marginTop: 4, marginBottom: 10 }}>
        That row of {FLAT_LEN} numbers is multiplied against a learned matrix and projected down
        to {OUT_WIDTH} numbers, the width every token's vector has inside this model. This is the
        same projection idea as section 3's lookup, run once per square instead of once per word.
      </div>

      <div className="weights">
        {projected.map((v, i) => (
          <div key={i} className="weight" style={{ color: v >= 0 ? 'var(--accent)' : 'var(--warn)' }}>
            {v.toFixed(2)}
          </div>
        ))}
      </div>

      <div className="figure-caption">
        {FLAT_LEN} numbers in, {OUT_WIDTH} numbers out. This output vector is now a token. Nothing
        in the rest of the machine can tell it apart from a token that started as a word.
      </div>
    </div>
  )
}
