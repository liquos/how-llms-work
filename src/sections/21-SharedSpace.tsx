import { useRef, useState } from 'react'
import { ShapeIcon } from './21-Contrastive'
import type { Shape } from './21-Contrastive'

const VB_W = 300
const VB_H = 190

interface Point {
  kind: 'word' | 'icon'
  label: string
  shape?: Shape
  x: number
  y: number
}

// hand-placed so that each caption sits close to its matching drawn shape,
// but not on top of it: the shared space only lands them near one another
const ICONS: Point[] = [
  { kind: 'icon', label: 'circle', shape: 'circle', x: 55, y: 45 },
  { kind: 'icon', label: 'square', shape: 'square', x: 225, y: 35 },
  { kind: 'icon', label: 'triangle', shape: 'triangle', x: 150, y: 150 },
  { kind: 'icon', label: 'star', shape: 'star', x: 258, y: 120 },
  { kind: 'icon', label: 'heart', shape: 'heart', x: 40, y: 150 },
]
const WORDS: Point[] = ICONS.map((p) => ({
  kind: 'word',
  label: p.label,
  x: p.x + 26,
  y: p.y - 14,
}))
const POINTS = [...ICONS, ...WORDS]

export function SharedSpace() {
  const svgRef = useRef<SVGSVGElement | null>(null)
  const [q, setQ] = useState({ x: 150, y: 95 })
  const dragging = useRef(false)

  const moveTo = (clientX: number, clientY: number) => {
    const svg = svgRef.current
    if (!svg) return
    const rect = svg.getBoundingClientRect()
    const fx = (clientX - rect.left) / rect.width
    const fy = (clientY - rect.top) / rect.height
    const x = Math.min(VB_W - 6, Math.max(6, fx * VB_W))
    const y = Math.min(VB_H - 6, Math.max(6, fy * VB_H))
    setQ({ x, y })
  }

  let nearest = POINTS[0]
  let best = Infinity
  for (const p of POINTS) {
    const d = (p.x - q.x) ** 2 + (p.y - q.y) ** 2
    if (d < best) {
      best = d
      nearest = p
    }
  }

  return (
    <div className="figure">
      <div className="figure-head">
        <span className="dot" />
        one space, two kinds of point
      </div>

      <svg
        ref={svgRef}
        className="shared-space"
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        onPointerDown={(e) => {
          dragging.current = true
          ;(e.target as Element).setPointerCapture(e.pointerId)
          moveTo(e.clientX, e.clientY)
        }}
        onPointerMove={(e) => {
          if (dragging.current) moveTo(e.clientX, e.clientY)
        }}
        onPointerUp={() => {
          dragging.current = false
        }}
      >
        <line
          className="ss-link"
          x1={q.x}
          y1={q.y}
          x2={nearest.x}
          y2={nearest.y}
        />
        {ICONS.map((p) => (
          <g key={`i${p.label}`} transform={`translate(${p.x - 9}, ${p.y - 9})`} className="ss-icon">
            <ShapeIcon shape={p.shape!} size={18} />
          </g>
        ))}
        {WORDS.map((p) => (
          <text key={`w${p.label}`} x={p.x} y={p.y} className="ss-word">
            {p.label}
          </text>
        ))}
        <circle cx={nearest.x} cy={nearest.y} r="13" className="ss-nearest" />
        <circle cx={q.x} cy={q.y} r="24" className="ss-hit" />
        <circle cx={q.x} cy={q.y} r="8" className="ss-query" />
      </svg>

      <div className="figure-caption">
        Drag the bright dot. It stands for a search: a point in the same space that words and
        drawn shapes both live in. The nearest point lights up, which is what an image search
        does with a real model: it does not read the picture, it finds the closest vector.
        Right now nearest is <b>{nearest.label}</b> ({nearest.kind === 'icon' ? 'a shape' : 'a word'}).
      </div>
    </div>
  )
}
