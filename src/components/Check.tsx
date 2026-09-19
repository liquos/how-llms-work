import { useState } from 'react'
import type { ReactNode } from 'react'

export interface CheckOption {
  label: string
  /** right = fully correct, partly = contains something correct, wrong = not correct */
  tone: 'right' | 'partly' | 'wrong'
  response: ReactNode
}

const VERDICT: Record<CheckOption['tone'], string> = {
  right: 'that is the one',
  partly: 'partly right',
  wrong: 'not quite',
}

/**
 * A small check. Not scored, not recorded. Every option gets a specific response
 * saying what was correct about it, including the wrong ones.
 */
export function Check({ question, options }: { question: ReactNode; options: CheckOption[] }) {
  const [picked, setPicked] = useState<number | null>(null)
  const chosen = picked === null ? null : options[picked]

  return (
    <div className="block accent">
      <div className="block-label">small check</div>
      <p style={{ marginBottom: 0, color: 'var(--text)' }}>{question}</p>
      <div className="check-options">
        {options.map((o, i) => (
          <button
            key={i}
            className={`check-option${picked === i ? ' picked' : ''}`}
            onClick={() => setPicked(i)}
            type="button"
          >
            <span className="key">{String.fromCharCode(65 + i)}</span>
            <span>{o.label}</span>
          </button>
        ))}
      </div>
      {chosen && (
        <div className={`check-response ${chosen.tone === 'wrong' ? '' : chosen.tone}`}>
          <div className="verdict">{VERDICT[chosen.tone]}</div>
          {chosen.response}
        </div>
      )}
    </div>
  )
}
