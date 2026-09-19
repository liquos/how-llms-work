import { useState } from 'react'

type Mode = 'shared' | 'cross'

export function CrossAttend() {
  const [mode, setMode] = useState<Mode>('shared')
  const shared = mode === 'shared'

  return (
    <div className="figure">
      <div className="figure-head">
        <span className="dot" />
        two ways to wire it in
      </div>

      <div className="segmented">
        <button className={shared ? 'on' : ''} onClick={() => setMode('shared')} type="button">
          One sequence
        </button>
        <button className={!shared ? 'on' : ''} onClick={() => setMode('cross')} type="button">
          Cross-attention
        </button>
      </div>

      <svg className="xa-svg" viewBox="0 0 300 116" role="img" aria-label="two wiring arrangements">
        {shared ? (
          <>
            <rect x="14" y="14" width="60" height="22" rx="6" className="xa-src img" />
            <text x="44" y="29" textAnchor="middle" className="xa-t">image</text>
            <rect x="226" y="14" width="60" height="22" rx="6" className="xa-src txt" />
            <text x="256" y="29" textAnchor="middle" className="xa-t">text</text>
            <line x1="44" y1="36" x2="150" y2="70" className="xa-line" />
            <line x1="256" y1="36" x2="150" y2="70" className="xa-line" />
            <rect x="80" y="70" width="140" height="28" rx="7" className="xa-box" />
            <text x="150" y="88" textAnchor="middle" className="xa-t">one stack of blocks</text>
          </>
        ) : (
          <>
            <rect x="14" y="14" width="60" height="22" rx="6" className="xa-src img" />
            <text x="44" y="29" textAnchor="middle" className="xa-t">image</text>
            <rect x="226" y="14" width="60" height="22" rx="6" className="xa-src txt" />
            <text x="256" y="29" textAnchor="middle" className="xa-t">text</text>
            <rect x="196" y="52" width="90" height="24" rx="6" className="xa-box small" />
            <text x="241" y="68" textAnchor="middle" className="xa-t small">cross-attention</text>
            <line x1="44" y1="36" x2="220" y2="60" className="xa-line dashed" />
            <line x1="256" y1="36" x2="256" y2="52" className="xa-line" />
            <line x1="241" y1="76" x2="241" y2="98" className="xa-line" markerEnd="url(#xa-arrow)" />
            <rect x="80" y="86" width="140" height="26" rx="7" className="xa-box" />
            <text x="150" y="103" textAnchor="middle" className="xa-t">text-only blocks</text>
            <defs>
              <marker id="xa-arrow" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
                <path d="M0,0 L8,4 L0,8 Z" className="wiring-arrowhead" />
              </marker>
            </defs>
          </>
        )}
      </svg>

      <div className="era-stack">
        <div className={`era-pane${shared ? ' on' : ''}`} aria-hidden={!shared}>
          <div className="figure-caption" style={{ marginTop: 0 }}>
            Image and text tokens sit in one sequence and every block attends over all of them.
            No new machinery, but the cost of attention grows with the square of the sequence
            length, so many image tokens make every block more expensive, including the parts
            that only involve text.
          </div>
        </div>
        <div className={`era-pane${!shared ? ' on' : ''}`} aria-hidden={shared}>
          <div className="figure-caption" style={{ marginTop: 0 }}>
            Text tokens attend to image vectors through one added step, and never attend directly
            to each other's image relationships. Cheaper as the number of image tokens grows, but
            it is a second kind of attention that has to be built and trained, not the one from
            section 14 reused as is.
          </div>
        </div>
      </div>
    </div>
  )
}
