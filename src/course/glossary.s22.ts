import type { GlossaryEntry } from './glossary'

/** glossary entries introduced by section 22 */
export const ENTRIES: GlossaryEntry[] = [
  {
    key: 'visionencoder',
    name: 'Vision encoder',
    definition:
      'The network that turns an image into a sequence of vectors: cut it into patches, flatten each one, and project it down to a vector. Section 20 built the idea; this is its name.',
    taughtIn: 22,
  },
  {
    key: 'crossattention',
    name: 'Cross-attention',
    definition:
      'An attention step where the queries come from one sequence and the keys and values come from another, for example text tokens querying image vectors. Ordinary self-attention, from section 14, uses the same sequence for all three.',
    taughtIn: 22,
  },
]
