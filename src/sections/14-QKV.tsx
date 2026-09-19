import { useState } from 'react'
import { Slider } from '../components/ui'
import { Arrow, Plot } from './14-plot'
import { EMBED, QKV_EXTENT, WK, WQ, WV, apply, len } from './14-model'
import type { Vec } from './14-model'

const BASE = EMBED[1] // "cat"
const BASE_ANGLE = (Math.atan2(BASE[1], BASE[0]) * 180) / Math.PI
const BASE_LEN = len(BASE)

/**
 * Three matrices applied to one vector. Rotating the input rotates all three
 * outputs, which is the point: they are three views of the same thing.
 */
export function QKVFigure() {
  const [deg, setDeg] = useState(Math.round(BASE_ANGLE))
  const rad = (deg * Math.PI) / 180
  const e: Vec = [Math.cos(rad) * BASE_LEN, Math.sin(rad) * BASE_LEN]

  const q = apply(WQ, e)
  const k = apply(WK, e)
  const v = apply(WV, e)

  const row = (name: string, m: number[], out: Vec, tone: string) => (
    <div className="qkv-row">
      <span className={`qkv-name ${tone}`}>{name}</span>
      <span className="qkv-mat mono">
        [{m[0].toFixed(2)} {m[1].toFixed(2)}; {m[2].toFixed(2)} {m[3].toFixed(2)}]
      </span>
      <span className="qkv-out mono">
        ({out[0].toFixed(2)}, {out[1].toFixed(2)})
      </span>
    </div>
  )

  return (
    <div className="figure">
      <div className="figure-head">
        <span className="dot" />
        one vector, three projections
      </div>

      <Plot vectors={QKV_EXTENT} label="query key and value from one embedding">
        <Arrow to={e} tone="e" label="in" />
        <Arrow to={q} tone="q" label="q" />
        <Arrow to={k} tone="k" label="k" />
        <Arrow to={v} tone="v" label="v" />
      </Plot>

      <Slider
        label="rotate the input vector"
        value={deg}
        min={-180}
        max={180}
        onChange={setDeg}
        display={(d) => `${d}°`}
      />

      <div className="qkv-rows">
        <div className="qkv-row head">
          <span className="qkv-name" />
          <span className="qkv-mat">matrix</span>
          <span className="qkv-out">result</span>
        </div>
        {row('q', WQ, q, 'q')}
        {row('k', WK, k, 'k')}
        {row('v', WV, v, 'v')}
      </div>

      <div className="figure-caption">
        The input vector is the embedding for one token. Three fixed matrices turn it into three
        different vectors. Rotate the input and all three move together, because all three are
        transforms of the same vector. In a real model the three matrices are learned during
        training, and they are the only thing that makes a query differ from a key.
      </div>
    </div>
  )
}
