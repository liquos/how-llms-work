import { useState } from 'react'

type Mode = 'training' | 'inference'

const MACHINES = [70, 152, 234]

/**
 * Two processes, same machine. In training the parameters inside the machines
 * are being changed. In inference they are fixed and only the material moves.
 */
export function FactoryDiagram() {
  const [mode, setMode] = useState<Mode>('inference')
  const training = mode === 'training'

  return (
    <div className="figure">
      <div className="figure-head">
        <span className="dot" />
        the same machine, two different times
      </div>

      <div className="segmented">
        <button className={training ? 'on' : ''} onClick={() => setMode('training')} type="button">
          Training
        </button>
        <button className={!training ? 'on' : ''} onClick={() => setMode('inference')} type="button">
          Inference
        </button>
      </div>

      <div className={`factory ${mode}`}>
        <svg className="fct-svg" viewBox="0 22 340 134" role="img" aria-label="factory diagram">
          {/* belt */}
          <line className="belt" x1="14" y1="74" x2="326" y2="74" />
          {[...Array(13)].map((_, i) => (
            <line key={i} className="belt-tick" x1={20 + i * 25} y1="78" x2={20 + i * 25} y2="83" />
          ))}

          {/* machines */}
          {MACHINES.map((x, mi) => (
            <g key={x}>
              <rect className="machine" x={x} y="34" width="58" height="40" rx="7" />
              {[...Array(6)].map((_, i) => (
                <circle
                  key={i}
                  className="param"
                  cx={x + 13 + (i % 3) * 16}
                  cy={48 + Math.floor(i / 3) * 14}
                  r="3.2"
                  style={{ animationDelay: `${(mi * 6 + i) * 90}ms` }}
                />
              ))}
            </g>
          ))}

          {/* material travelling along the belt */}
          <circle className="material" cy="74" r="5" />

          {/* ends */}
          <text className="fct-label" x="14" y="100">
            text in
          </text>
          <text className="fct-label end" x="326" y="100" textAnchor="end">
            token out
          </text>

          {/* feedback path, only meaningful during training */}
          <path
            className="feedback"
            d="M 312 112 C 312 138, 250 138, 180 138 C 110 138, 44 138, 44 112"
            fill="none"
          />
          <path className="feedback-head" d="M 40 116 L 44 106 L 48 116 Z" />
          <text className="fct-label fb" x="178" y="152" textAnchor="middle">
            compare, then adjust every parameter
          </text>
        </svg>
      </div>

      {/* both notes occupy the same grid cell so switching mode does not resize the panel */}
      <div className="era-stack fct-note">
        <p className={`era-pane${training ? ' on' : ''}`} aria-hidden={!training}>
          <b>Training.</b> Material still flows through, but the point is the return path: every
          pass compares the output with the word that was really there and nudges every parameter.
          The machines themselves are being rebuilt, billions of times, over weeks.
        </p>
        <p className={`era-pane${!training ? ' on' : ''}`} aria-hidden={training}>
          <b>Inference.</b> The parameters are fixed. Nothing about the machines changes, ever. The
          only thing moving is the material on the belt. This is what happens when you press enter.
        </p>
      </div>
    </div>
  )
}
