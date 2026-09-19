import { useEffect, useMemo, useRef, useState } from 'react'
import { Slider } from '../components/ui'

// a synthetic two-syllable sound, computed in code so nothing has to be loaded
const N = 528 // total samples
const SEG = N / 2
const K1 = 18 // cycles across the first half: the higher tone
const K2 = 11 // cycles across the second half: the lower tone

function signalAt(n: number): number {
  const seg = n < SEG ? 0 : 1
  const local = n - seg * SEG
  const k = seg === 0 ? K1 : K2
  const envelope = Math.sin((Math.PI * local) / SEG)
  return envelope * Math.sin((2 * Math.PI * k * local) / SEG)
}

const SIGNAL = Array.from({ length: N }, (_, n) => signalAt(n))

const WINDOW = 33 // odd length keeps the frame centred on a sample
const HOP = 16
const FRAMES = 32
const BINS = 16 // frequency bins kept per frame

function hann(i: number, w: number): number {
  return 0.5 - 0.5 * Math.cos((2 * Math.PI * i) / (w - 1))
}

/** naive discrete Fourier transform magnitude, computed directly, no library */
function frameMagnitudes(start: number): number[] {
  const mags: number[] = []
  for (let k = 0; k < BINS; k++) {
    let re = 0
    let im = 0
    for (let i = 0; i < WINDOW; i++) {
      const sample = SIGNAL[Math.min(N - 1, start + i)] * hann(i, WINDOW)
      const angle = (-2 * Math.PI * k * i) / WINDOW
      re += sample * Math.cos(angle)
      im += sample * Math.sin(angle)
    }
    mags.push(Math.sqrt(re * re + im * im))
  }
  return mags
}

const SPECTROGRAM: number[][] = Array.from({ length: FRAMES }, (_, f) => frameMagnitudes(f * HOP))
const MAX_MAG = Math.max(...SPECTROGRAM.flat())

const PATCH_T = 4
const PATCH_F = 4
const PATCHES_ACROSS = FRAMES / PATCH_T // 8
const PATCHES_DOWN = BINS / PATCH_F // 4

export function Audio() {
  const [frame, setFrame] = useState(16)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!ctx) return
    const img = ctx.createImageData(FRAMES, BINS)
    for (let f = 0; f < FRAMES; f++) {
      for (let b = 0; b < BINS; b++) {
        const v = SPECTROGRAM[f][b] / MAX_MAG
        const row = BINS - 1 - b // low frequency at the bottom
        const i = (row * FRAMES + f) * 4
        img.data[i] = Math.round(30 + v * 110)
        img.data[i + 1] = Math.round(60 + v * 150)
        img.data[i + 2] = Math.round(120 + v * 135)
        img.data[i + 3] = 255
      }
    }
    ctx.putImageData(img, 0, 0)
  }, [])

  const wavePath = useMemo(() => {
    const step = Math.max(1, Math.floor(N / 150))
    const pts: string[] = []
    for (let n = 0; n < N; n += step) {
      const x = (n / (N - 1)) * 300
      const y = 20 - SIGNAL[n] * 17
      pts.push(`${x.toFixed(1)},${y.toFixed(1)}`)
    }
    return pts.join(' ')
  }, [])

  const markerX = ((frame * HOP + WINDOW / 2) / (N - 1)) * 300
  const patchCol = Math.floor(frame / PATCH_T)

  return (
    <div className="figure">
      <div className="figure-head">
        <span className="dot" />
        sound, cut into patches
      </div>

      <Slider
        label="time"
        value={frame}
        min={0}
        max={FRAMES - 1}
        step={1}
        onChange={setFrame}
        display={(v) => `frame ${v} of ${FRAMES}`}
      />

      <svg className="wave-svg" viewBox="0 0 300 40" aria-hidden>
        <polyline points={wavePath} className="wave-line" fill="none" />
        <line x1={markerX} y1="0" x2={markerX} y2="40" className="wave-marker" />
      </svg>

      <div className="spectro-stage">
        <canvas ref={canvasRef} width={FRAMES} height={BINS} className="spectro-canvas" />
        <svg className="spectro-overlay" viewBox={`0 0 ${FRAMES} ${BINS}`} aria-hidden>
          {[...Array(PATCHES_ACROSS - 1)].map((_, i) => (
            <line key={`v${i}`} x1={(i + 1) * PATCH_T} y1={0} x2={(i + 1) * PATCH_T} y2={BINS} className="grid-line" />
          ))}
          {[...Array(PATCHES_DOWN - 1)].map((_, i) => (
            <line key={`h${i}`} x1={0} y1={(i + 1) * PATCH_F} x2={FRAMES} y2={(i + 1) * PATCH_F} className="grid-line" />
          ))}
          <rect x={patchCol * PATCH_T} y={0} width={PATCH_T} height={BINS} className="spectro-highlight" />
        </svg>
      </div>

      <div className="figure-caption">
        Top: the waveform, amplitude over time. Bottom: the same sound converted to a
        spectrogram, frequency up the side, time across, brightness for how much of that
        frequency is present. The spectrogram is then cut into {PATCH_T} by {PATCH_F} squares,
        {' '}
        {PATCHES_ACROSS} &times; {PATCHES_DOWN} = {PATCHES_ACROSS * PATCHES_DOWN} of them, exactly
        the way the picture was cut in section 20. Drag the slider and watch which square the
        current moment in time falls into.
      </div>
    </div>
  )
}
