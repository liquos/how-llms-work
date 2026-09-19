import type { GlossaryEntry } from './glossary'

/** glossary entries introduced by section 19 */
export const ENTRIES: GlossaryEntry[] = [
  {
    key: 'scalinglaw',
    name: 'Scaling law',
    definition:
      'A regular relationship between the compute spent on training and the resulting loss. Over a wide range, loss falls in a straight line when both are plotted on logarithmic axes, which makes the effect of spending more compute predictable in advance.',
    taughtIn: 19,
  },
  {
    key: 'flop',
    name: 'FLOP',
    expansion: 'Floating Point Operation',
    definition:
      'One arithmetic operation on a real number, such as one multiplication. Training compute is usually measured in FLOPs, the total count of these operations carried out during training.',
    taughtIn: 19,
  },
  {
    key: 'emergentability',
    name: 'Emergent ability',
    definition:
      'A capability that shows up only once a model passes a certain size, rather than improving gradually from the smallest models upward. Whether a given case is a real change in the model or an effect of how the task is scored is an open, disputed question.',
    taughtIn: 19,
  },
]
