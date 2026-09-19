import type { GlossaryEntry } from './glossary'

/** glossary entries introduced by section 9 */
export const ENTRIES: GlossaryEntry[] = [
  {
    key: 'vanishinggradient',
    name: 'Vanishing gradient',
    definition:
      'What happens when a multiplier below 1 is applied once per step over many steps: the quantity shrinks toward zero geometrically. In a recurrent network this is why information from early tokens fades out.',
    taughtIn: 9,
  },
]
