import { useState } from 'react'
import { Slider } from '../components/ui'

// word-level tokens, kept simple on purpose so the point is the window, not tokenisation
const SENTENCE = [
  'The', 'keys', 'to', 'the', 'cabinet', 'that', 'the', 'movers',
  'left', 'in', 'the', 'hallway', 'are',
]
const SUBJECT = 1 // "keys"
const VERB = 12 // "are"

export function Window() {
  const [size, setSize] = useState(4)
  const [position, setPosition] = useState(VERB)

  const start = Math.max(0, position - size)
  const inWindow = (i: number) => i >= start && i < position
  const subjectIn = inWindow(SUBJECT)

  return (
    <div className="figure">
      <div className="figure-head">
        <span className="dot" />
        the fixed window
      </div>

      <Slider
        label="window size"
        value={size}
        min={1}
        max={13}
        onChange={setSize}
        display={(v) => `${v} token${v === 1 ? '' : 's'}`}
      />
      <Slider
        label="predicting position"
        value={position}
        min={1}
        max={SENTENCE.length - 1}
        onChange={setPosition}
        display={(v) => `token ${v} ("${SENTENCE[v]}")`}
      />

      <div className="w7-sentence">
        {SENTENCE.map((w, i) => {
          const cls = [
            'w7-tok',
            inWindow(i) ? 'w7-in' : 'w7-out',
            i === position ? 'w7-target' : '',
            i === SUBJECT ? 'w7-subject' : '',
          ]
            .filter(Boolean)
            .join(' ')
          return (
            <span key={i} className={cls}>
              {w}
            </span>
          )
        })}
      </div>

      <div className="figure-caption" style={{ marginTop: 14 }}>
        The model is about to predict the word after position {position} ("
        {SENTENCE[position]}"). With a window of {size}, it reads positions {start} to{' '}
        {position - 1}, {position - start} token{position - start === 1 ? '' : 's'} in total.
        "keys" is at position {SUBJECT}, and it is{' '}
        <strong>{subjectIn ? 'inside' : 'outside'}</strong> that window.
      </div>
      <div className="figure-caption">
        {subjectIn
          ? 'The window reaches back far enough this time, so the model can in principle use "keys" to pick "are" over "is".'
          : 'The window does not reach "keys". The model has no access to it at all, so nothing about it can affect the prediction, no matter how the rest of the sentence reads.'}
      </div>
    </div>
  )
}
