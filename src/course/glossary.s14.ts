import type { GlossaryEntry } from './glossary'

/** glossary entries introduced by section 14 */
export const ENTRIES: GlossaryEntry[] = [
  {
    key: 'selfattention',
    name: 'Self-attention',
    definition:
      'Attention used between a sequence and itself, so every token collects information from every other token in the same sequence. Section 12 used attention between two different sequences; this uses one.',
    taughtIn: 14,
  },
  {
    key: 'query',
    name: 'Query',
    definition:
      'A vector produced from a token’s embedding by one learned matrix. It is compared against every key to decide how much attention this token pays to each other token.',
    taughtIn: 14,
  },
  {
    key: 'key',
    name: 'Key',
    definition:
      'A vector produced from a token’s embedding by a second learned matrix. A query is compared against it with a dot product to produce a score.',
    taughtIn: 14,
  },
  {
    key: 'value',
    name: 'Value',
    definition:
      'A vector produced from a token’s embedding by a third learned matrix. It is what actually gets blended into the output when a token is attended to.',
    taughtIn: 14,
  },
  {
    key: 'dotproduct',
    name: 'Dot product',
    definition:
      'Multiply two vectors component by component and add the results. It measures how much of one vector lies along the other: large and positive when they point the same way, zero at right angles, negative when opposed.',
    taughtIn: 14,
  },
  {
    key: 'mask',
    name: 'Causal mask',
    definition:
      'Blocking a token from attending to tokens that come after it. A model trained to predict the next token must not be shown the answer, so later positions are set aside before the weights are worked out.',
    taughtIn: 14,
  },
]
