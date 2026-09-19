import type { GlossaryEntry } from './glossary'

/** glossary entries introduced by section 8 */
export const ENTRIES: GlossaryEntry[] = [
  {
    key: 'rnn',
    name: 'RNN',
    expansion: 'Recurrent Neural Network',
    definition:
      'A network that reads a sequence one token at a time. At each step it takes the current token and the state carried from the previous step, and produces a new state. The same weights are used at every step.',
    taughtIn: 8,
  },
  {
    key: 'hiddenstate',
    name: 'Hidden state',
    definition:
      'The vector a recurrent network carries from one step to the next. It is the only information passed forward; the network cannot see earlier tokens directly, only what the state retained about them.',
    taughtIn: 8,
  },
]
