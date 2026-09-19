import { PARTS, SECTIONS } from '../course/sections'
import { toSection } from '../router'

export function Contents() {
  return (
    <div className="shell">
      <div className="chapline" style={{ marginTop: 34 }}>
        <span className="accent">a course</span>
        <span className="rule" />
        <span>24 sections</span>
      </div>
      <h1>How language models work</h1>
      <p className="lede">
        You build a small language model first, then find out what people tried before it, then
        read the idea that replaced all of it. Each section is meant to be finished in one
        sitting.
      </p>

      {PARTS.map((part) => {
        const items = SECTIONS.filter((s) => s.part === part.id)
        if (items.length === 0) return null
        return (
          <div key={part.id}>
            <div className="part-head">
              <div className="part-kicker">
                {part.id === 0 ? part.title : `part ${part.id} — ${part.title}`}
              </div>
              {part.id !== 0 && <div className="part-blurb">{part.blurb}</div>}
            </div>
            {items.map((s) => (
              <button
                key={s.id}
                className={`toc-item${s.ready ? '' : ' soon'}`}
                onClick={() => s.ready && toSection(s.id)}
                disabled={!s.ready}
                type="button"
              >
                <span className="toc-num">{String(s.id).padStart(2, '0')}</span>
                <span className="toc-title">{s.title}</span>
                {s.ready ? (
                  <>
                    {s.minutes && <span className="toc-tag">{s.minutes} min</span>}
                    <span className="toc-arrow">&rsaquo;</span>
                  </>
                ) : (
                  <span className="toc-tag">soon</span>
                )}
              </button>
            ))}
          </div>
        )
      })}
    </div>
  )
}
