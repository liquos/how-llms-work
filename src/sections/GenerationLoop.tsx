import { useState } from 'react'
import { Slider } from '../components/ui'

interface Step {
  token: string
  candidates: { t: string; p: number }[]
}

const PROMPT = ['The', 'cat', 'sat', 'on', 'the']

const STEPS: Step[] = [
  { token: 'mat', candidates: [{ t: 'mat', p: 41 }, { t: 'floor', p: 18 }, { t: 'sofa', p: 9 }] },
  { token: 'and', candidates: [{ t: 'and', p: 27 }, { t: '.', p: 24 }, { t: 'by', p: 11 }] },
  { token: 'watched', candidates: [{ t: 'watched', p: 22 }, { t: 'looked', p: 20 }, { t: 'waited', p: 12 }] },
  { token: 'the', candidates: [{ t: 'the', p: 52 }, { t: 'it', p: 10 }, { t: 'us', p: 6 }] },
  { token: 'rain', candidates: [{ t: 'rain', p: 19 }, { t: 'door', p: 17 }, { t: 'birds', p: 15 }] },
  { token: '.', candidates: [{ t: '.', p: 46 }, { t: 'fall', p: 21 }, { t: 'outside', p: 14 }] },
]

export function GenerationLoop() {
  const [step, setStep] = useState(0)
  const produced = STEPS.slice(0, step)
  const current = step < STEPS.length ? STEPS[step] : null
  const total = PROMPT.length + produced.length

  return (
    <div className="figure">
      <div className="figure-head">
        <span className="dot" />
        the generation loop
      </div>

      <Slider
        label="passes so far"
        value={step}
        min={0}
        max={STEPS.length}
        onChange={setStep}
        display={(v) => `${v} of ${STEPS.length}`}
      />

      <div className="chips">
        {PROMPT.map((t, i) => (
          <span key={`p${i}`} className="chip">
            <span className="idx">{String(i).padStart(2, '0')}</span>
            <span className="txt">{t}</span>
          </span>
        ))}
        {produced.map((s, i) => (
          <span
            key={`g${i}`}
            className={`chip made${i === produced.length - 1 ? ' fresh' : ''}`}
          >
            <span className="idx">{String(PROMPT.length + i).padStart(2, '0')}</span>
            <span className="txt">{s.token}</span>
          </span>
        ))}
      </div>

      {/* both states share one grid cell so the panel does not resize at the last pass */}
      <div className="era-stack">
        <div className={`era-pane${current ? ' on' : ''}`} aria-hidden={!current}>
          <div className="figure-caption" style={{ marginBottom: 2, marginTop: 0 }}>
            Pass {step + 1} reads all {total} tokens above, then scores every token in the
            vocabulary. The three highest:
          </div>
          <div className="cands">
            {(current ?? STEPS[STEPS.length - 1]).candidates.map((c, i) => (
              <div key={c.t} className={`cand${i === 0 ? ' top' : ''}`}>
                <span className="cand-t">{c.t}</span>
                <span className="cand-track">
                  <span className="cand-fill" style={{ width: `${c.p * 1.9}%` }} />
                </span>
                <span className="cand-p">{c.p}%</span>
              </div>
            ))}
          </div>
          <div className="figure-caption">
            One gets picked and becomes token {String(total).padStart(2, '0')}. Then the machine
            starts again from the top, on the longer text.
          </div>
        </div>
        <div className={`era-pane${current ? '' : ' on'}`} aria-hidden={!!current}>
          <div className="figure-caption" style={{ marginTop: 0 }}>
            Six tokens of output took six complete passes. Nothing was carried between passes
            except the text itself.
          </div>
        </div>
      </div>
    </div>
  )
}
