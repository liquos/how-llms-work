import type { GlossaryEntry } from './glossary'

/** glossary entries introduced by section 2 */
export const ENTRIES: GlossaryEntry[] = [
  {
    key: 'vocabulary',
    name: 'Vocabulary',
    definition:
      'The fixed list of pieces a tokenizer can produce. Every piece on the list has a position number. A piece of text that is not on the list cannot be produced at all; it has to be built out of smaller pieces that are.',
    taughtIn: 2,
  },
  {
    key: 'bpe',
    name: 'BPE',
    expansion: 'Byte-Pair Encoding',
    definition:
      'The method used to build a token vocabulary. Start from single characters. Repeatedly find the most frequent adjacent pair anywhere in a body of text and merge it into one new piece. Stop after a chosen number of merges.',
    taughtIn: 2,
  },
  {
    key: 'tokenid',
    name: 'Token ID',
    definition:
      "The position number of one piece inside the vocabulary list. This is the only thing that reaches the model: a list of integers, one per token, with the original letters gone.",
    taughtIn: 2,
  },
]
