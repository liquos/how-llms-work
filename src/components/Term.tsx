import { createContext, useCallback, useContext, useState } from 'react'
import type { ReactNode } from 'react'
import { lookup } from '../course/glossary'
import { bySection } from '../course/sections'
import { toSection } from '../router'

const OpenTerm = createContext<(key: string) => void>(() => {})

/**
 * Wraps the app so that any <T> anywhere can open the explanation panel.
 */
export function TermProvider({ children }: { children: ReactNode }) {
  const [openKey, setOpenKey] = useState<string | null>(null)
  const open = useCallback((k: string) => setOpenKey(k), [])
  const close = () => setOpenKey(null)

  const entry = openKey ? lookup(openKey) : undefined
  const taught = entry?.taughtIn !== undefined ? bySection(entry.taughtIn) : undefined

  return (
    <OpenTerm.Provider value={open}>
      {children}
      {entry && (
        <>
          <div className="scrim" onClick={close} />
          <div className="termcard" role="dialog" aria-label={entry.name}>
            <div className="termcard-grip" />
            <div className="termcard-name">{entry.name}</div>
            {entry.expansion && <div className="termcard-expansion">{entry.expansion}</div>}
            <p style={{ marginBottom: 0 }}>{entry.definition}</p>
            <div className="termcard-actions">
              {taught?.ready && (
                <button
                  className="btn primary"
                  onClick={() => {
                    close()
                    toSection(taught.id)
                  }}
                >
                  Go to section {taught.id}
                </button>
              )}
              <button className="btn ghost" onClick={close}>
                Close
              </button>
            </div>
          </div>
        </>
      )}
    </OpenTerm.Provider>
  )
}

/**
 * Inline clickable term. Usage: <T k="token">tokens</T>
 *
 * If the key has no glossary entry the text is rendered plainly rather than as
 * a link that opens nothing.
 */
export function T({ k, children }: { k: string; children: ReactNode }) {
  const open = useContext(OpenTerm)
  if (!lookup(k)) return <>{children}</>
  return (
    <button className="term" onClick={() => open(k)} type="button">
      {children}
    </button>
  )
}
