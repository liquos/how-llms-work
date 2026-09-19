import { useState } from 'react'
import { bySection } from '../course/sections'
import { toSection } from '../router'

interface Era {
  year: string
  short: string
  name: string
  how: string
  sample: { prompt: string; output: string }
  note: string
  /** the section that covers this stop, if one does */
  section?: number
}

// the same history shown in section 0, repeated here with each stop linked
// to the section that covers it. Kept as a separate copy rather than an
// import, so this file can add the section links without touching section
// 0's component.
const ERAS: Era[] = [
  {
    year: '1966',
    short: '66',
    name: 'ELIZA',
    how: 'A list of hand-written patterns. If the input matches a pattern, rearrange it into a reply.',
    sample: { prompt: 'I am unhappy about my job', output: 'WHY ARE YOU UNHAPPY ABOUT YOUR JOB?' },
    note: 'Nothing is learned from data. A person wrote every rule by hand.',
  },
  {
    year: '1990s',
    short: '90s',
    name: 'Counting word pairs',
    how: 'Read a lot of text and count how often each word follows each other word. Predict the most common continuation.',
    sample: { prompt: 'the cat sat on the', output: 'floor' },
    note: 'This works for two or three words of context. Beyond that there are too many combinations to count.',
  },
  {
    year: '2003',
    short: '03',
    name: 'The first neural language model',
    how: 'Give every word a short list of numbers. Feed the last few words into a small network. Predict the next word.',
    sample: { prompt: 'the cat sat on the', output: 'mat' },
    note: 'This is the model you built in part 1.',
    section: 6,
  },
  {
    year: '2013',
    short: '13',
    name: 'word2vec',
    how: 'Train those per-word number lists on very large amounts of text, then look at what came out.',
    sample: { prompt: 'king minus man plus woman', output: 'queen, approximately' },
    note: 'Directions in the number space turned out to line up with meaning. Nobody put them there on purpose.',
    section: 3,
  },
  {
    year: '2014',
    short: '14',
    name: 'Sequence to sequence',
    how: 'Read the whole input sentence one word at a time into a single vector. Then write the output sentence one word at a time out of that vector.',
    sample: { prompt: 'translate a 6-word sentence', output: 'usable translation' },
    note: 'Machine translation became good enough to use. Long sentences still failed, because everything had to fit through one vector.',
    section: 11,
  },
  {
    year: '2015',
    short: '15',
    name: 'Attention, added on',
    how: 'While writing each output word, look back at every input word and take a weighted blend of them.',
    sample: { prompt: 'translate a 40-word sentence', output: 'still good' },
    note: 'The single-vector bottleneck is gone. Attention is an extra part bolted onto the existing machine.',
    section: 12,
  },
  {
    year: '2017',
    short: '17',
    name: 'Attention Is All You Need',
    how: 'Remove the one-word-at-a-time loop completely. Keep only attention. Process every word at the same time.',
    sample: { prompt: 'the same translation task', output: 'better, and far faster to train' },
    note: 'The change this course is built around. Its main effect was not quality. It was that training could now be spread across thousands of chips at once.',
    section: 13,
  },
  {
    year: '2018 to 2020',
    short: '18',
    name: 'GPT-2 and GPT-3',
    how: 'Take the 2017 design, stack more copies of the same block, and train on far more text.',
    sample: { prompt: 'write a paragraph about a lighthouse', output: 'a fluent paragraph' },
    note: 'The design barely changed. The size and the amount of text changed by a factor of thousands.',
    section: 18,
  },
  {
    year: '2022',
    short: '22',
    name: 'ChatGPT',
    how: 'Take a trained model and add two smaller training stages that teach it to answer rather than continue.',
    sample: { prompt: 'how do I fix a dripping tap?', output: 'a direct, ordered answer' },
    note: 'The underlying model was already about two years old. What changed was how it was asked to behave.',
    section: 1,
  },
  {
    year: '2023 on',
    short: '23',
    name: 'Images and audio',
    how: 'Cut an image into squares, turn each square into a vector, and feed those vectors in alongside the text.',
    sample: { prompt: 'a photo of a fridge, and "what can I cook?"', output: 'a list using what is visible' },
    note: 'No new architecture. Pictures are converted into the same kind of vector that words already were.',
    section: 20,
  },
]

export function Timeline() {
  const [i, setI] = useState(6) // opens on the 2017 stop, the subject of this section
  const pct = (n: number) => (n / (ERAS.length - 1)) * 100

  return (
    <div className="figure">
      <div className="figure-head">
        <span className="dot" />
        the same sixty years, with a way back into each one
      </div>

      <div className="tl-axis">
        <div className="tl-line" />
        <div className="tl-fill" style={{ width: `calc(${pct(i)}% - ${pct(i) * 0.12}px)` }} />
        {ERAS.map((e, n) => (
          <button
            key={e.year}
            className={`tl-dot${n === i ? ' now' : n < i ? ' past' : ''}`}
            style={{ left: `calc(6px + ${pct(n)}% - ${pct(n) * 0.12}px)` }}
            onClick={() => setI(n)}
            aria-label={e.year}
            type="button"
          />
        ))}
        {ERAS.map((e, n) => {
          const isEdge = n === 0 || n === ERAS.length - 1
          if (n !== i && !isEdge) return null
          if (isEdge && Math.abs(n - i) < 2) return null
          const shift = n === 0 ? '0' : n === ERAS.length - 1 ? '-100%' : '-50%'
          return (
            <span
              key={`y${e.year}`}
              className={`tl-year${n === i ? ' now' : ''}`}
              style={{
                left: `calc(6px + ${pct(n)}% - ${pct(n) * 0.12}px)`,
                transform: `translateX(${n === i ? (i === 0 ? '0' : i === ERAS.length - 1 ? '-100%' : '-50%') : shift})`,
              }}
            >
              {n === i ? e.year : e.short}
            </span>
          )
        })}
      </div>

      <input
        type="range"
        min={0}
        max={ERAS.length - 1}
        value={i}
        onChange={(ev) => setI(Number(ev.target.value))}
        aria-label="Drag through time"
      />

      <div className="era-stack">
        {ERAS.map((e, n) => {
          const eraTarget = e.section !== undefined ? bySection(e.section) : undefined
          return (
            <div key={e.year} className={`era-pane${n === i ? ' on' : ''}`} aria-hidden={n !== i}>
              <div className="era-head">
                <span className="era-year">{e.year}</span>
                <span className="era-name">{e.name}</span>
              </div>
              <p className="era-how">{e.how}</p>
              <div className="era-sample">
                <div className="era-row">
                  <span className="era-tag">in</span>
                  <span className="era-val">{e.sample.prompt}</span>
                </div>
                <div className="era-row o">
                  <span className="era-tag out">out</span>
                  <span className="era-val">{e.sample.output}</span>
                </div>
              </div>
              <p className="era-note">{e.note}</p>
              {eraTarget?.ready ? (
                <button
                  className="btn ghost wide tl-open"
                  onClick={() => toSection(eraTarget.id)}
                  type="button"
                >
                  Open section {eraTarget.id}: {eraTarget.title}
                </button>
              ) : (
                <div className="tl-nolink">This stop is not covered by its own section.</div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
