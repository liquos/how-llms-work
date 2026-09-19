import { useEffect, useRef, useState } from 'react'
import { Slider } from '../components/ui'

/** side length, in pixels, of the square test image */
const IMG = 224

/** patch sizes on offer, all exact divisors of 224 so no pixel is left out */
const PATCH_OPTIONS = [8, 14, 16, 28, 32, 56]

function sign(px: number, py: number, ax: number, ay: number, bx: number, by: number) {
  return (px - bx) * (ay - by) - (ax - bx) * (py - by)
}

function inTriangle(
  px: number,
  py: number,
  ax: number,
  ay: number,
  bx: number,
  by: number,
  cx: number,
  cy: number,
) {
  const d1 = sign(px, py, ax, ay, bx, by)
  const d2 = sign(px, py, bx, by, cx, cy)
  const d3 = sign(px, py, cx, cy, ax, ay)
  const hasNeg = d1 < 0 || d2 < 0 || d3 < 0
  const hasPos = d1 > 0 || d2 > 0 || d3 > 0
  return !(hasNeg && hasPos)
}

/**
 * A drawn scene: sky, sun, a mountain, ground, a barn. No photograph is
 * loaded, every pixel is computed from these shapes so the image can be
 * cut apart honestly.
 */
export function scenePixel(x: number, y: number, size: number): [number, number, number] {
  const horizon = size * 0.6
  if (y < horizon) {
    const t = y / horizon
    const r = 118 + (200 - 118) * t
    const g = 168 + (215 - 168) * t
    const b = 232 + (245 - 232) * t
    const sx = size * 0.76
    const sy = size * 0.2
    const sr = size * 0.085
    if ((x - sx) ** 2 + (y - sy) ** 2 < sr * sr) return [255, 210, 90]
    const ax = size * 0.3
    const ay = size * 0.28
    const bx = size * 0.06
    const by = horizon
    const cx = size * 0.56
    const cy = horizon
    if (inTriangle(x, y, ax, ay, bx, by, cx, cy)) return [104, 96, 120]
    return [Math.round(r), Math.round(g), Math.round(b)]
  }
  const gy = (y - horizon) / (size - horizon)
  const gr = 74 + gy * 10
  const gg = 128 - gy * 20
  const gb = 62
  const bx0 = size * 0.66
  const bx1 = size * 0.82
  const by0 = horizon + size * 0.06
  const by1 = size * 0.9
  if (x > bx0 && x < bx1 && y > by0 && y < by1) return [176, 68, 58]
  const rax = size * 0.63
  const ray = by0
  const rbx = size * 0.85
  const rby = by0
  const rcx = size * 0.74
  const rcy = by0 - size * 0.09
  if (inTriangle(x, y, rax, ray, rbx, rby, rcx, rcy)) return [96, 60, 54]
  return [Math.round(gr), Math.round(gg), Math.round(gb)]
}

export function drawScene(ctx: CanvasRenderingContext2D, size: number) {
  const img = ctx.createImageData(size, size)
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const [r, g, b] = scenePixel(x, y, size)
      const i = (y * size + x) * 4
      img.data[i] = r
      img.data[i + 1] = g
      img.data[i + 2] = b
      img.data[i + 3] = 255
    }
  }
  ctx.putImageData(img, 0, 0)
}

export function Patches() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [oi, setOi] = useState(2) // index into PATCH_OPTIONS, default 16px

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!ctx) return
    drawScene(ctx, IMG)
  }, [])

  const patchSize = PATCH_OPTIONS[oi]
  const perSide = IMG / patchSize
  const tokens = perSide * perSide
  const lines = [...Array(perSide - 1)].map((_, i) => (i + 1) * patchSize)

  return (
    <div className="figure">
      <div className="figure-head">
        <span className="dot" />
        cutting the image into squares
      </div>

      <Slider
        label="patch size"
        value={oi}
        min={0}
        max={PATCH_OPTIONS.length - 1}
        step={1}
        onChange={setOi}
        display={(v) => `${PATCH_OPTIONS[v]} × ${PATCH_OPTIONS[v]} px`}
      />

      <div className="patch-stage">
        <canvas ref={canvasRef} width={IMG} height={IMG} className="scene-canvas" />
        <svg className="patch-overlay" viewBox={`0 0 ${IMG} ${IMG}`} aria-hidden>
          {lines.map((p) => (
            <line key={`v${p}`} x1={p} y1={0} x2={p} y2={IMG} className="grid-line" />
          ))}
          {lines.map((p) => (
            <line key={`h${p}`} x1={0} y1={p} x2={IMG} y2={p} className="grid-line" />
          ))}
        </svg>
      </div>

      <div className="patch-formula mono">
        {IMG} &divide; {patchSize} = {perSide} squares across. {perSide} &times; {perSide} ={' '}
        <b>{tokens} tokens</b> for this one picture.
      </div>

      <div className="figure-caption">
        Each square is one token, the same kind of thing a word became in section 2. Section 1
        explained that the machine runs once per token and every pass gets a little more
        expensive as the sequence grows. {tokens} tokens is roughly the length of a{' '}
        {tokens}-word reply, and it is added before the model reads a single word of your
        question.
      </div>
    </div>
  )
}
