import type { GlossaryEntry } from './glossary'

/** glossary entries introduced by section 15 */
export const ENTRIES: GlossaryEntry[] = [
  {
    key: 'head',
    name: 'Attention head',
    definition:
      'One run of the query, key, value and weighted-sum calculation, with its own separate learned matrices. A layer runs several heads in parallel, each free to pick out a different relationship between tokens, then joins their outputs back into one vector.',
    taughtIn: 15,
  },
]
