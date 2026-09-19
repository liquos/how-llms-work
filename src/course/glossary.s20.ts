import type { GlossaryEntry } from './glossary'

/** glossary entries introduced by section 20 */
export const ENTRIES: GlossaryEntry[] = [
  {
    key: 'patch',
    name: 'Patch',
    definition:
      'A small square cut from an image, for example 16 by 16 pixels. A patch is flattened into a row of numbers and projected down to a vector, which becomes one token, the same way a word becomes one token.',
    taughtIn: 20,
  },
]
