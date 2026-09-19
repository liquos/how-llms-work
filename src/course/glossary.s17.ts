import type { GlossaryEntry } from './glossary'

/** glossary entries introduced by section 17 */
export const ENTRIES: GlossaryEntry[] = [
  {
    key: 'block',
    name: 'Transformer block',
    definition:
      'Self-attention, then add the input back and normalise, then a small network run on each token separately, then add and normalise again. A vector of a given width goes in and a vector of the same width comes out, which is what allows the block to be stacked.',
    taughtIn: 17,
  },
  {
    key: 'residual',
    name: 'Residual connection',
    definition:
      'Adding a step’s input to its output instead of replacing it. It means a block adjusts the vector rather than producing a new one, so a signal survives through a stack of a hundred blocks.',
    taughtIn: 17,
  },
  {
    key: 'layernorm',
    name: 'Layer normalisation',
    definition:
      'Subtract the average of a vector’s numbers, then divide by how far they typically sit from that average. The result always has the same spread, whatever went in.',
    taughtIn: 17,
  },
]
