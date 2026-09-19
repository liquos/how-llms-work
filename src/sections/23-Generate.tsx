import { useState } from 'react'
import { Slider } from '../components/ui'
import { scenePixel } from './20-Patches'

const GRID = 8
const IMG = 224
const BLOCK = IMG / GRID

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

// the same drawn scene from section 20, averaged down to an 8 by 8 grid of
// target colors, standing in for the "finished picture" the model produces
const TARGET: [number, number, number][] = []
for (let gy = 0; gy < GRID; gy++) {
  for (let gx = 0; gx < GRID; gx++) {
    let r = 0
    let g = 0
    let b = 0
    let count = 0
    for (let y = gy * BLOCK; y < (gy + 1) * BLOCK; y += 4) {
      for (let x = gx * BLOCK; x < (gx + 1) * BLOCK; x += 4) {
        const [pr, pg, pb] = scenePixel(x, y, IMG)
        r += pr
        g += pg
        b += pb
        count++
      }
    }
    TARGET.push([r / count, g / count, b / count])
  }
}

const rand = mulberry32(7)
const NOISE: [number, number, number][] = TARGET.map(() => [
  Math.floor(rand() * 255),
  Math.floor(rand() * 255),
  Math.floor(rand() * 255),
])

const DENOISE_STEPS = 20

type Mode = 'tokens' | 'diffusion'

export function Generate() {
  const [mode, setMode] = useState<Mode>('tokens')
  const [tokensDone, setTokensDone] = useState(20)
  const [step, setStep] = useState(8)
  const tokenMode = mode === 'tokens'

  const t = step / DENOISE_STEPS

  return (
    <div className="figure">
      <div className="figure-head">
        <span className="dot" />
        two ways to produce a picture
      </div>

      <div className="segmented">
        <button className={tokenMode ? 'on' : ''} onClick={() => setMode('tokens')} type="button">
          Predict tokens
        </button>
        <button className={!tokenMode ? 'on' : ''} onClick={() => setMode('diffusion')} type="button">
          Remove noise
        </button>
      </div>

      <div className="era-stack">
        <div className={`era-pane${tokenMode ? ' on' : ''}`} aria-hidden={!tokenMode}>
          <Slider
            label="tokens generated"
            value={tokensDone}
            min={0}
            max={GRID * GRID}
            step={1}
            onChange={setTokensDone}
            display={(v) => `${v} of ${GRID * GRID}`}
          />
          <div className="gen-grid">
            {TARGET.map((color, i) => (
              <span
                key={i}
                className={i < tokensDone ? '' : 'blank'}
                style={i < tokensDone ? { background: `rgb(${color.join(',')})` } : undefined}
              />
            ))}
          </div>
          <div className="figure-caption" style={{ marginBottom: 0 }}>
            The same loop from section 1: score every possible next image token, pick one, add
            it, run again. The picture appears one square at a time, in a fixed order, exactly
            like a reply appears one word at a time.
          </div>
        </div>

        <div className={`era-pane${!tokenMode ? ' on' : ''}`} aria-hidden={tokenMode}>
          <Slider
            label="denoising steps"
            value={step}
            min={0}
            max={DENOISE_STEPS}
            step={1}
            onChange={setStep}
            display={(v) => `${v} of ${DENOISE_STEPS}`}
          />
          <div className="gen-grid">
            {TARGET.map((color, i) => {
              const n = NOISE[i]
              const mixed = color.map((c, k) => Math.round(n[k] * (1 - t) + c * t))
              return <span key={i} style={{ background: `rgb(${mixed.join(',')})` }} />
            })}
          </div>
          <div className="figure-caption" style={{ marginBottom: 0 }}>
            A different architecture, not the token loop. Every square starts as random noise. A
            separate model is trained to guess, at each step, what to remove to make the picture
            slightly cleaner, and that guess is subtracted a little at a time. This figure only
            shows the noise fraction falling in a straight line, to make the shape of the idea
            visible; the real per-step arithmetic is not covered here.
          </div>
        </div>
      </div>
    </div>
  )
}
