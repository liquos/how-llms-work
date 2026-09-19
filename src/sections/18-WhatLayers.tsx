import { useState } from 'react'
import { Slider } from '../components/ui'

const TOTAL_LAYERS = 24

function gauss(t: number, center: number, width: number): number {
  const d = (t - center) / width
  return Math.exp(-0.5 * d * d)
}

// a smoothed, made-up curve standing in for a rough pattern reported across
// several interpretability studies. It is evaluated from a formula, not
// looked up from a table, but the formula itself is a stylised summary, not
// a measurement.
function weightsAt(layer: number) {
  const t = (layer - 0.5) / TOTAL_LAYERS
  const surface = gauss(t, 0.14, 0.2)
  const syntax = gauss(t, 0.5, 0.24)
  const predict = gauss(t, 0.86, 0.2)
  const sum = surface + syntax + predict
  return {
    surface: surface / sum,
    syntax: syntax / sum,
    predict: predict / sum,
  }
}

export function WhatLayers() {
  const [layer, setLayer] = useState(1)
  const w = weightsAt(layer)
  const rows: { name: string; v: number }[] = [
    { name: 'surface form', v: w.surface },
    { name: 'syntax and roles', v: w.syntax },
    { name: 'next-token prediction', v: w.predict },
  ]

  return (
    <div className="figure">
      <div className="figure-head">
        <span className="dot" />
        what a layer seems to work on
      </div>

      <Slider
        label="layer"
        value={layer}
        min={1}
        max={TOTAL_LAYERS}
        onChange={setLayer}
        display={(v) => `${v} of ${TOTAL_LAYERS}`}
      />

      {rows.map((r) => (
        <div className="wl-row" key={r.name}>
          <span className="wl-name">{r.name}</span>
          <span className="wl-track">
            <span className="wl-fill" style={{ width: `${Math.round(r.v * 100)}%` }} />
          </span>
          <span className="wl-pct">{Math.round(r.v * 100)}%</span>
        </div>
      ))}

      <div className="figure-caption">
        The three bars overlap on purpose at every layer. No layer does only one of these things,
        and the three categories are not a measurement of this or any specific model, only a
        rough summary of a pattern reported across several studies of trained models.
      </div>
    </div>
  )
}
