import { useState } from 'react'
import { Slider } from '../components/ui'

const TEXT_TOKENS = ['what', 'is', 'in', 'this', 'photo', '?']

export function Wiring() {
  const [imgCount, setImgCount] = useState(9)

  const total = imgCount + TEXT_TOKENS.length

  return (
    <div className="figure">
      <div className="figure-head">
        <span className="dot" />
        one sequence, two sources
      </div>

      <Slider
        label="image tokens"
        value={imgCount}
        min={2}
        max={16}
        step={1}
        onChange={setImgCount}
        display={(v) => String(v)}
      />

      <div className="chips wiring-chips">
        {[...Array(imgCount)].map((_, i) => (
          <span key={`i${i}`} className="chip img">
            <span className="idx">{String(i).padStart(2, '0')}</span>
            <span className="txt">img</span>
          </span>
        ))}
        {TEXT_TOKENS.map((t, i) => (
          <span key={`t${i}`} className="chip made">
            <span className="idx">{String(imgCount + i).padStart(2, '0')}</span>
            <span className="txt">{t}</span>
          </span>
        ))}
      </div>

      <svg className="wiring-flow" viewBox="0 0 300 70" aria-hidden>
        <line x1="150" y1="4" x2="150" y2="24" className="wiring-line" markerEnd="url(#wf-arrow)" />
        <rect x="55" y="26" width="190" height="30" rx="8" className="wiring-box" />
        <text x="150" y="45" textAnchor="middle" className="wiring-label">
          same stack of blocks, section 17
        </text>
        <line x1="150" y1="56" x2="150" y2="68" className="wiring-line" markerEnd="url(#wf-arrow)" />
        <defs>
          <marker id="wf-arrow" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
            <path d="M0,0 L8,4 L0,8 Z" className="wiring-arrowhead" />
          </marker>
        </defs>
      </svg>

      <div className="figure-caption">
        {imgCount} image tokens, then {TEXT_TOKENS.length} text tokens, {total} positions in
        total. They are placed one after another in a single sequence and handed to the exact
        same stack of blocks built in part 3. Attention inside that stack does not check where a
        token came from. A block that compares token 3 against token 7 has no way to know that
        one started as a picture and the other started as a word.
      </div>
    </div>
  )
}
