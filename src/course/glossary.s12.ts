import type { GlossaryEntry } from './glossary'

/** glossary entries introduced by section 12 */
export const ENTRIES: GlossaryEntry[] = [
  {
    key: 'alignmentweights',
    name: 'Alignment weights',
    definition:
      'A set of numbers, one per source word, that sum to 1 and say how much each source word contributes to the current output word. Produced fresh for every output word.',
    taughtIn: 12,
  },
  {
    key: 'contextvector',
    name: 'Context vector',
    definition:
      'The weighted sum of all the encoder’s states, using that step’s alignment weights. It replaces the single fixed final vector as the decoder’s input at each step, so the decoder can draw on any part of the source sentence, not only the end of it.',
    taughtIn: 12,
  },
]
