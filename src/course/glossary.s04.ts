import type { GlossaryEntry } from './glossary'

/** glossary entries introduced by section 4 */
export const ENTRIES: GlossaryEntry[] = [
  {
    key: 'relu',
    name: 'ReLU',
    expansion: 'Rectified Linear Unit',
    definition:
      'An activation function. It returns its input unchanged if the input is positive, and 0 otherwise: max(x, 0). This is the bending function most networks use.',
    taughtIn: 4,
  },
  {
    key: 'bias',
    name: 'Bias',
    definition:
      'A number added after the weighted inputs are summed, before the activation function is applied. It lets a neuron shift its output up or down independently of its inputs.',
    taughtIn: 4,
  },
  {
    key: 'activation',
    name: 'Activation function',
    definition:
      'A function applied to a neuron’s weighted sum before it is passed on. Without one, stacking layers is pointless, because a stack of purely linear layers is itself linear and collapses into one. ReLU is the most common choice.',
    taughtIn: 4,
  },
]
