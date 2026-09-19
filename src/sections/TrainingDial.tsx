import { useState } from 'react'
import { Slider } from '../components/ui'

const START = [0.41, -0.77, 0.13, 0.92, -0.35, 0.68, -0.21, 0.54]
const TARGET = [-0.12, 0.63, 0.88, -0.41, 0.27, -0.95, 0.36, 0.09]

/** how much text has been seen, as a readable label */
function tokensSeen(v: number): string {
  if (v === 0) return 'none yet'
  const n = Math.pow(10, (v / 100) * 13)
  if (n < 1e3) return `${Math.round(n)} tokens`
  if (n < 1e6) return `${(n / 1e3).toFixed(0)} thousand tokens`
  if (n < 1e9) return `${(n / 1e6).toFixed(0)} million tokens`
  if (n < 1e12) return `${(n / 1e9).toFixed(0)} billion tokens`
  return `${(n / 1e12).toFixed(1)} trillion tokens`
}

function weightAt(i: number, v: number): number {
  const t = v / 100
  const settled = START[i] + (TARGET[i] - START[i]) * t
  // early in training the values move around a lot; the movement dies down later
  const jitter = Math.sin(v * (1.3 + i * 0.7) + i) * 0.55 * Math.pow(1 - t, 1.6)
  return settled + jitter
}

function completionAt(v: number): string {
  if (v < 4) return 'qx·zzt·· the the ,, kx'
  if (v < 18) return 'the the of and the to'
  if (v < 38) return 'floor of the was and'
  if (v < 62) return 'floor and looked at the'
  if (v < 84) return 'mat and watched the door'
  return 'mat and watched the rain through the window.'
}

export function TrainingDial() {
  const [v, setV] = useState(0)
  const done = v === 100

  return (
    <div className="figure">
      <div className="figure-head">
        <span className="dot" />
        training, from nothing to finished
      </div>
      <Slider
        label="Text seen so far"
        value={v}
        min={0}
        max={100}
        onChange={setV}
        display={() => tokensSeen(v)}
      />

      <div className="dial-label">
        eight of the parameters inside the model
        {done && <span className="frozen">frozen</span>}
      </div>
      <div className="weights">
        {START.map((_, i) => {
          const w = weightAt(i, v)
          return (
            <span key={i} className="weight">
              <span
                className="glow"
                style={{ opacity: done ? 0 : Math.min(0.22, Math.abs(w - START[i]) * 0.12) }}
              />
              <span style={{ position: 'relative' }}>
                {w >= 0 ? ' ' : ''}
                {w.toFixed(2)}
              </span>
            </span>
          )
        })}
      </div>
      <div className="dial-note">
        {done
          ? 'Training has finished. From this moment on these numbers never change again.'
          : 'Every small step of training nudges every one of these numbers. A real model has around 100 billion of them.'}
      </div>

      <div className="dial-label" style={{ marginTop: 18 }}>
        what it produces at this point
      </div>
      <div className="dial-out">
        <span className="dial-prompt">The cat sat on the </span>
        {completionAt(v)}
      </div>
    </div>
  )
}
