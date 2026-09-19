import { useState } from 'react'
import { Slider } from '../components/ui'

interface Pt { x: number; y: number; label: string }

const SOURCES: Pt[] = [
  { x: -70, y: 50, label: 'A' },
  { x: 80, y: 60, label: 'B' },
  { x: 50, y: -70, label: 'C' },
  { x: -60, y: -40, label: 'D' },
]

const W = 320
const H = 220
const CX = W / 2
const CY = H / 2
const toSvg = (p: { x: number; y: number }) => ({ x: CX + p.x, y: CY - p.y })

export function Blend() {
  const [raw, setRaw] = useState([0.7, 0.15, 0.1, 0.05])
  const sum = raw.reduce((a, b) => a + b, 0)
  const w = sum > 0 ? raw.map((v) => v / sum) : raw.map(() => 0.25)

  const out = SOURCES.reduce(
    (acc, p, i) => ({ x: acc.x + w[i] * p.x, y: acc.y + w[i] * p.y }),
    { x: 0, y: 0 },
  )
  const outSvg = toSvg(out)

  const setOne = (i: number, v: number) => {
    const next = raw.slice()
    next[i] = v
    setRaw(next)
  }

  return (
    <div className="figure">
      <div className="figure-head">
        <span className="dot" />
        the weighted blend, on vectors you can see
      </div>

      {SOURCES.map((p, i) => (
        <Slider
          key={p.label}
          label={`weight on ${p.label}`}
          value={raw[i]}
          min={0}
          max={1}
          step={0.05}
          onChange={(v) => setOne(i, v)}
          display={() => `${(w[i] * 100).toFixed(0)}%`}
        />
      ))}

      <svg className="blend-svg" viewBox={`0 0 ${W} ${H}`} role="img" aria-label="weighted blend of four vectors">
        {SOURCES.map((p, i) => {
          const s = toSvg(p)
          return (
            <line
              key={`l${i}`}
              className="blend-link"
              x1={s.x}
              y1={s.y}
              x2={outSvg.x}
              y2={outSvg.y}
              style={{ opacity: 0.15 + w[i] * 0.75 }}
            />
          )
        })}
        {SOURCES.map((p, i) => {
          const s = toSvg(p)
          return (
            <g key={p.label}>
              <circle className="blend-src" cx={s.x} cy={s.y} r={7} />
              <text className="blend-label" x={s.x} y={s.y - 12} textAnchor="middle">
                {p.label} {(w[i] * 100).toFixed(0)}%
              </text>
            </g>
          )
        })}
        <circle className="blend-out" cx={outSvg.x} cy={outSvg.y} r={7} />
        <text className="blend-label out" x={outSvg.x} y={outSvg.y - 12} textAnchor="middle">
          output
        </text>
      </svg>

      <div className="arith">
        output = {w[0].toFixed(2)}×A + {w[1].toFixed(2)}×B + {w[2].toFixed(2)}×C + {w[3].toFixed(2)}×D
        <br />
        = ({out.x.toFixed(1)}, {out.y.toFixed(1)})
      </div>

      <div className="figure-caption">
        With two vectors and weights that sum to 1, this same sum is exactly a linear
        interpolation: at weight (1, 0) the output sits on the first vector, at (0, 1) it sits on
        the second, and at (0.5, 0.5) it sits at the midpoint, the same lerp you already use in
        3D work. With four vectors it is the same operation extended: the output is still a
        weighted average, it just has four points pulling on it instead of two. Move a weight up
        and the output point moves toward that source vector.
      </div>
    </div>
  )
}
