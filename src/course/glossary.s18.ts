import type { GlossaryEntry } from './glossary'

/** glossary entries introduced by section 18 */
export const ENTRIES: GlossaryEntry[] = [
  {
    key: 'residualstream',
    name: 'Residual stream',
    definition:
      'The one vector per token that runs through the whole stack of blocks. Each block reads it, computes something, and adds the result back rather than replacing it, so the vector accumulates edits as it passes through more blocks.',
    taughtIn: 18,
  },
]
