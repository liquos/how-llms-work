import { createContext, useContext } from 'react'
import type { ReactNode } from 'react'
import type { Vec } from './14-model'

interface Mapping {
  sx: (x: number) => number
  sy: (y: number) => number
  w: number
  h: number
}

const MapCtx = createContext<Mapping>({ sx: (x) => x, sy: (y) => y, w: 320, h: 240 })

const W = 320
const PAD = 26

/**
 * Work out bounds that fit every vector passed in, keeping the origin visible
 * and keeping one unit the same length on both axes so angles are not distorted.
 */
function boundsFor(vs: Vec[]) {
  let x0 = 0
  let x1 = 0
  let y0 = 0
  let y1 = 0
  for (const v of vs) {
    x0 = Math.min(x0, v[0])
    x1 = Math.max(x1, v[0])
    y0 = Math.min(y0, v[1])
    y1 = Math.max(y1, v[1])
  }
  const mx = (x1 - x0) * 0.16 + 0.25
  const my = (y1 - y0) * 0.16 + 0.25
  return { x0: x0 - mx, x1: x1 + mx, y0: y0 - my, y1: y1 + my }
}

export function Plot({
  vectors,
  children,
  label,
}: {
  /** every vector that will be drawn, used to size the view */
  vectors: Vec[]
  children: ReactNode
  label?: string
}) {
  const b = boundsFor(vectors)
  const inner = W - PAD * 2
  const unit = inner / (b.x1 - b.x0)
  const h = (b.y1 - b.y0) * unit + PAD * 2

  const sx = (x: number) => PAD + (x - b.x0) * unit
  const sy = (y: number) => h - PAD - (y - b.y0) * unit

  return (
    <MapCtx.Provider value={{ sx, sy, w: W, h }}>
      <svg className="vplot" viewBox={`0 0 ${W} ${h}`} role="img" aria-label={label ?? 'vector plot'}>
        {b.y0 < 0 && b.y1 > 0 && (
          <line className="axis" x1={sx(b.x0)} y1={sy(0)} x2={sx(b.x1)} y2={sy(0)} />
        )}
        {b.x0 < 0 && b.x1 > 0 && (
          <line className="axis" x1={sx(0)} y1={sy(b.y0)} x2={sx(0)} y2={sy(b.y1)} />
        )}
        {children}
      </svg>
    </MapCtx.Provider>
  )
}

export function Arrow({
  to,
  from = [0, 0],
  tone,
  label,
  dim,
}: {
  to: Vec
  from?: Vec
  tone: 'q' | 'k' | 'v' | 'out' | 'e'
  label?: string
  dim?: boolean
}) {
  const { sx, sy } = useContext(MapCtx)
  const ax = sx(to[0])
  const ay = sy(to[1])
  const bx = sx(from[0])
  const by = sy(from[1])
  const d = Math.hypot(ax - bx, ay - by)
  if (d < 2) return null
  const ux = (ax - bx) / d
  const uy = (ay - by) / d
  const hl = 9
  const hw = 4.4
  const basex = ax - ux * hl
  const basey = ay - uy * hl

  return (
    <g className={`arr ${tone}${dim ? ' dim' : ''}`}>
      <line x1={bx} y1={by} x2={basex} y2={basey} />
      <polygon
        points={`${ax},${ay} ${basex - uy * hw},${basey + ux * hw} ${basex + uy * hw},${basey - ux * hw}`}
      />
      {label && (
        <text
          x={ax + ux * 10}
          y={ay + uy * 10 + 3.5}
          textAnchor={ux < -0.3 ? 'end' : ux > 0.3 ? 'start' : 'middle'}
        >
          {label}
        </text>
      )}
    </g>
  )
}

export function Dot({ at, tone, label }: { at: Vec; tone: string; label?: string }) {
  const { sx, sy } = useContext(MapCtx)
  return (
    <g className={`pdot ${tone}`}>
      <circle cx={sx(at[0])} cy={sy(at[1])} r="4" />
      {label && (
        <text x={sx(at[0]) + 8} y={sy(at[1]) + 4}>
          {label}
        </text>
      )}
    </g>
  )
}

export function Dashed({ a, b }: { a: Vec; b: Vec }) {
  const { sx, sy } = useContext(MapCtx)
  return <line className="perp" x1={sx(a[0])} y1={sy(a[1])} x2={sx(b[0])} y2={sy(b[1])} />
}
