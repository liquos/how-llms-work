import type { GlossaryEntry } from './glossary'

/** glossary entries introduced by section 5 */
export const ENTRIES: GlossaryEntry[] = [
  {
    key: 'loss',
    name: 'Loss',
    definition:
      'A single number measuring how wrong the model’s prediction was, computed by comparing the prediction against the correct answer. Training changes the weights to make this number smaller.',
    taughtIn: 5,
  },
  {
    key: 'gradient',
    name: 'Gradient',
    definition:
      'For one weight, the direction that increases the loss the fastest. Moving a weight a small amount against its gradient reduces the loss. Every weight has its own gradient, computed at the same time.',
    taughtIn: 5,
  },
  {
    key: 'stepsize',
    name: 'Step size',
    definition:
      'How far each weight moves against its gradient on one step of training, also called the learning rate. Too small and training crawls. Too large and the weights overshoot the bottom of the loss curve and move further away instead of closer.',
    taughtIn: 5,
  },
]
