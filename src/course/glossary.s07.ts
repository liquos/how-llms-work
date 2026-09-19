import type { GlossaryEntry } from './glossary'

/** glossary entries introduced by section 7 */
export const ENTRIES: GlossaryEntry[] = [
  {
    key: 'contextwindow',
    name: 'Context window',
    definition:
      'The fixed number of previous tokens a model is allowed to look at when it predicts the next one. The 2003 model in this course reads the last N tokens and nothing before them, however long the sentence actually is.',
    taughtIn: 7,
  },
]
