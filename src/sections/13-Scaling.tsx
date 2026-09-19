import { useState } from 'react'
import { Slider } from '../components/ui'

interface Pt {
  year: number
  name: string
  millions: number
  note?: string
}

// publicly reported or widely reported estimated sizes, in millions of parameters.
// illustrative of the trend, not a precise record.
const POINTS: Pt[] = [
  { year: 2014, name: 'Sequence to sequence translation model', millions: 384 },
  { year: 2016, name: 'GNMT, Google’s production translator', millions: 278 },
  { year: 2017, name: 'Transformer (big), the 2017 paper', millions: 213 },
  { year: 2018, name: 'BERT-large', millions: 340 },
  { year: 2019, name: 'GPT-2', millions: 1500 },
  { year: 2020, name: 'GPT-3', millions: 175000 },
  { year: 2021, name: 'Megatron-Turing NLG', millions: 530000 },
  { year: 2022, name: 'PaLM', millions: 540000 },
  { year: 2023, name: 'GPT-4', millions: 1000000, note: 'size not published, this is a widely reported estimate' },
]

const W = 320
const H = 176
const PAD_L = 40
const PAD_B = 22
const PAD_T = 10
const LOG_MIN = 2 // 10^2 million = 100 million parameters
const LOG_MAX = 6.3 // a little above 10^6 million = 1 trillion parameters

const xFor = (i: number) => PAD_L + (i / (POINTS.length - 1)) * (W - PAD_L - 8)
const yFor = (millions: number) => {
  const t = (Math.log10(millions) - LOG_MIN) / (LOG_MAX - LOG_MIN)
  return H - PAD_B - t * (H - PAD_B - PAD_T)
}

const REF_LINES = [
  { millions: 100, label: '100M' },
  { millions: 1000, label: '1B' },
  { millions: 100000, label: '100B' },
  { millions: 1000000, label: '1T' },
]

const fmtSize = (m: number) =>
  m >= 1000 ? `${(m / 1000).toLocaleString()} billion` : `${m} million`

/**
 * Model size actually trained, by year, on a log axis. Log axis because the
 * jump from GPT-2 to GPT-3 alone is more than 100x; a straight axis would
 * flatten everything before 2020 into a single line at the bottom.
 */
export function Scaling13() {
  const [i, setI] = useState(5)
  const p = POINTS[i]
  const path = POINTS.map((pt, idx) => `${idx === 0 ? 'M' : 'L'} ${xFor(idx)} ${yFor(pt.millions)}`).join(' ')

  return (
    <div className="figure">
      <div className="figure-head">
        <span className="dot" />
        model size actually trained, by year
      </div>

      <svg className="scale-svg" viewBox={`0 0 ${W} ${H}`} role="img" aria-label="model size by year, log scale">
        {REF_LINES.map((r) => (
          <g key={r.label}>
            <line className="scale-grid" x1={PAD_L} x2={W - 4} y1={yFor(r.millions)} y2={yFor(r.millions)} />
            <text className="scale-axlabel" x={2} y={yFor(r.millions) + 3}>
              {r.label}
            </text>
          </g>
        ))}
        <path className="scale-line" d={path} fill="none" />
        {POINTS.map((pt, idx) => (
          <circle
            key={pt.year}
            className={`scale-pt${idx === i ? ' on' : ''}`}
            cx={xFor(idx)}
            cy={yFor(pt.millions)}
            r={idx === i ? 5.5 : 3}
            onClick={() => setI(idx)}
          />
        ))}
        {POINTS.map((pt, idx) => (
          <text key={`y${pt.year}`} className="scale-yr" x={xFor(idx)} y={H - 6} textAnchor="middle">
            {String(pt.year).slice(2)}
          </text>
        ))}
      </svg>

      <Slider label="year" value={i} min={0} max={POINTS.length - 1} onChange={setI} display={() => `${p.year}`} />

      <div className="figure-caption">
        {p.name}, about {fmtSize(p.millions)} parameters{p.note ? ` (${p.note})` : ''}. Section 0 put
        the 2017 paper on this same timeline as one stop. This is what training moved on to build once
        it was no longer limited to running one step at a time.
      </div>
    </div>
  )
}
