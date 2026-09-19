import { useState } from 'react'
import { Slider } from '../components/ui'

// A fixed, concrete pair of inputs. Only the weights and the bias move.
const X1 = 1.4
const X2 = -0.9

type Activation = 'relu' | 'off'

function relu(z: number): number {
  return Math.max(z, 0)
}

export function Neuron() {
  const [w1, setW1] = useState(0.8)
  const [w2, setW2] = useState(0.6)
  const [b, setB] = useState(-0.3)
  const [act, setAct] = useState<Activation>('relu')

  const t1 = w1 * X1
  const t2 = w2 * X2
  const z = t1 + t2 + b
  const out = act === 'relu' ? relu(z) : z

  const fmt = (n: number) => (n >= 0 ? `${n.toFixed(2)}` : `-${Math.abs(n).toFixed(2)}`)

  return (
    <div className="figure">
      <div className="figure-head">
        <span className="dot" />
        one neuron, two inputs
      </div>

      <div className="neuron-inputs">
        <span>
          input 1 <b className="mono">x&#8321; = {X1}</b>
        </span>
        <span>
          input 2 <b className="mono">x&#8322; = {X2}</b>
        </span>
      </div>

      <Slider label="weight 1" value={w1} min={-2} max={2} step={0.1} onChange={setW1} display={(v) => v.toFixed(1)} />
      <Slider label="weight 2" value={w2} min={-2} max={2} step={0.1} onChange={setW2} display={(v) => v.toFixed(1)} />
      <Slider label="bias" value={b} min={-2} max={2} step={0.1} onChange={setB} display={(v) => v.toFixed(1)} />

      <div className="segmented">
        <button className={act === 'relu' ? 'on' : ''} onClick={() => setAct('relu')} type="button">
          ReLU
        </button>
        <button className={act === 'off' ? 'on' : ''} onClick={() => setAct('off')} type="button">
          activation off
        </button>
      </div>

      <div className="neuron-eq">
        <div className="neuron-row">
          <span className="neuron-l">w&#8321; &times; x&#8321;</span>
          <span className="neuron-r mono">
            {w1.toFixed(1)} &times; {X1} = {fmt(t1)}
          </span>
        </div>
        <div className="neuron-row">
          <span className="neuron-l">w&#8322; &times; x&#8322;</span>
          <span className="neuron-r mono">
            {w2.toFixed(1)} &times; {X2} = {fmt(t2)}
          </span>
        </div>
        <div className="neuron-row">
          <span className="neuron-l">sum + bias</span>
          <span className="neuron-r mono">
            {fmt(t1)} + {fmt(t2)} + {b.toFixed(1)} = {fmt(z)}
          </span>
        </div>
        <div className="neuron-row neuron-out">
          <span className="neuron-l">{act === 'relu' ? 'ReLU(z)' : 'output (no activation)'}</span>
          <span className="neuron-r mono">
            {act === 'relu' ? `max(${fmt(z)}, 0)` : fmt(z)} = {fmt(out)}
          </span>
        </div>
      </div>

      <div className="figure-caption">
        Nothing here should be new: two products, a sum, a bias, and ReLU keeping only the
        positive part. Move the bias slider until z crosses zero and watch ReLU clip the output
        to exactly 0.
      </div>
    </div>
  )
}
