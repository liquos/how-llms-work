import type { ReactNode } from 'react'

export function Block({
  label,
  tone,
  children,
}: {
  label?: string
  tone?: 'accent' | 'quiet' | 'takeaway'
  children: ReactNode
}) {
  return (
    <div className={`block${tone ? ' ' + tone : ''}`}>
      {label && <div className="block-label">{label}</div>}
      {children}
    </div>
  )
}

export function Figure({ caption, children }: { caption?: ReactNode; children: ReactNode }) {
  return (
    <div className="figure">
      {children}
      {caption && <div className="figure-caption">{caption}</div>}
    </div>
  )
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return <div className="eyebrow">{children}</div>
}

export function Slider({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  display,
}: {
  label: string
  value: number
  min: number
  max: number
  step?: number
  onChange: (v: number) => void
  display?: (v: number) => string
}) {
  return (
    <div className="slider">
      <div className="slider-head">
        <span className="slider-label">{label}</span>
        <span className="slider-value">{display ? display(value) : String(value)}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label={label}
      />
    </div>
  )
}
