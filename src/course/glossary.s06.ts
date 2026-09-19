import type { GlossaryEntry } from './glossary'

/** glossary entries introduced by section 6 */
export const ENTRIES: GlossaryEntry[] = [
  {
    key: 'logit',
    name: 'Logit',
    definition:
      'A raw score the model produces for one token, before it is turned into a probability. Logits can be negative and do not sum to anything in particular.',
    taughtIn: 6,
  },
  {
    key: 'softmax',
    name: 'Softmax',
    definition:
      'The calculation that turns a list of raw scores into probabilities that sum to 100%. Each score is exponentiated, then divided by the sum of all the exponentiated scores.',
    taughtIn: 6,
  },
  {
    key: 'temperature',
    name: 'Temperature',
    definition:
      'A number that scales the scores before softmax is applied. Low temperature makes the highest score take nearly all of the probability. High temperature flattens the probabilities toward each other.',
    taughtIn: 6,
  },
  {
    key: 'sampling',
    name: 'Sampling',
    definition:
      'Picking one token at random according to the probabilities softmax produced, rather than always taking the highest one. Sampling is why the same input can produce a different token on different runs.',
    taughtIn: 6,
  },
]
