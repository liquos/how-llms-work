import type { GlossaryEntry } from './glossary'

/** glossary entries introduced by section 10 */
export const ENTRIES: GlossaryEntry[] = [
  {
    key: 'lstm',
    name: 'LSTM',
    expansion: 'Long Short-Term Memory',
    definition:
      'A recurrent network where each stored value is updated by new value = retain × old value + write × candidate. Retain and write are learned numbers between 0 and 1, set by the network itself at every step from its current input. Setting retain to 1 and write to 0 keeps a value unchanged for any number of steps.',
    taughtIn: 10,
  },
  {
    key: 'gate',
    name: 'Gate',
    definition:
      'A learned number between 0 and 1 that multiplies something else. A gate at 1 lets the whole value through, a gate at 0 blocks it, and anything in between passes a fraction of it. Retain and write, in an LSTM, are both gates.',
    taughtIn: 10,
  },
  {
    key: 'cellstate',
    name: 'Cell state',
    definition:
      'The value an LSTM carries forward from one step to the next. It changes only through addition, retain × old value plus write × candidate, rather than by being replaced outright.',
    taughtIn: 10,
  },
]
