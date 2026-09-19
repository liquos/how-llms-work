import type { GlossaryEntry } from './glossary'

/** glossary entries introduced by section 16 */
export const ENTRIES: GlossaryEntry[] = [
  {
    key: 'position_encoding',
    name: 'Position encoding',
    definition:
      'A vector added to each token’s vector before attention runs, carrying where in the sequence that token sits. Without it, attention treats the input as an unordered set of tokens, since nothing else in the calculation reads position.',
    taughtIn: 16,
  },
]
