import type { ComponentType } from 'react'
import { PARTS, bySection, nextReady, prevReady } from '../course/sections'
import { toSection, toContents } from '../router'
import { Section00 } from './Section00'
import { Section01 } from './Section01'
import { Section02 } from './Section02'
import { Section03 } from './Section03'
import { Section04 } from './Section04'
import { Section05 } from './Section05'
import { Section06 } from './Section06'
import { Section07 } from './Section07'
import { Section08 } from './Section08'
import { Section09 } from './Section09'
import { Section10 } from './Section10'
import { Section11 } from './Section11'
import { Section12 } from './Section12'
import { Section13 } from './Section13'
import { Section14 } from './Section14'
import { Section15 } from './Section15'
import { Section16 } from './Section16'
import { Section17 } from './Section17'
import { Section18 } from './Section18'
import { Section19 } from './Section19'
import { Section20 } from './Section20'
import { Section21 } from './Section21'
import { Section22 } from './Section22'
import { Section23 } from './Section23'

const REGISTRY: Record<number, ComponentType> = {
  0: Section00,
  1: Section01,
  2: Section02,
  3: Section03,
  4: Section04,
  5: Section05,
  6: Section06,
  7: Section07,
  8: Section08,
  9: Section09,
  10: Section10,
  11: Section11,
  12: Section12,
  13: Section13,
  14: Section14,
  15: Section15,
  16: Section16,
  17: Section17,
  18: Section18,
  19: Section19,
  20: Section20,
  21: Section21,
  22: Section22,
  23: Section23,
}

export function SectionView({ id }: { id: number }) {
  const meta = bySection(id)
  const Body = REGISTRY[id]
  if (!meta || !Body) {
    return (
      <div className="shell">
        <h1>Not written yet</h1>
        <p className="lede">This section does not exist in the app yet.</p>
        <button className="btn primary" onClick={toContents}>
          Back to the contents
        </button>
      </div>
    )
  }

  const part = PARTS.find((p) => p.id === meta.part)
  const prev = prevReady(id)
  const next = nextReady(id)

  return (
    <div className="shell">
      <div className="chapline">
        <span className="accent">section {String(meta.id).padStart(2, '0')}</span>
        <span className="rule" />
        <span>{meta.minutes ? `${meta.minutes} min` : ''}</span>
        {part && part.id !== 0 && (
          <>
            <span className="rule" />
            <span>part {part.id}</span>
          </>
        )}
      </div>

      <h1>{meta.title}</h1>

      <Body />

      <div className="secnav">
        {prev ? (
          <button className="btn ghost" onClick={() => toSection(prev.id)} aria-label="previous section">
            &larr;
          </button>
        ) : (
          <button className="btn ghost" onClick={toContents} aria-label="contents">
            &#8801;
          </button>
        )}
        {next ? (
          <button className="btn primary" onClick={() => toSection(next.id)}>
            <span className="nextlabel">
              <span className="k">next, section {String(next.id).padStart(2, '0')}</span>
              <span className="v">{next.title}</span>
            </span>
            <span>&rarr;</span>
          </button>
        ) : (
          <button className="btn ghost wide" onClick={toContents}>
            Back to the contents
          </button>
        )}
      </div>
    </div>
  )
}
