import type { GlossaryEntry } from './glossary'

/** glossary entries introduced by section 11 */
export const ENTRIES: GlossaryEntry[] = [
  {
    key: 'encoder',
    name: 'Encoder',
    definition:
      'The half of a translation network that reads the input sentence, one word at a time, and ends with a single fixed-size vector summarising the whole sentence.',
    taughtIn: 11,
  },
  {
    key: 'decoder',
    name: 'Decoder',
    definition:
      'The half of a translation network that writes the output sentence, one word at a time, starting from the encoder’s fixed-size vector and nothing else.',
    taughtIn: 11,
  },
  {
    key: 'seq2seq',
    name: 'Sequence to sequence',
    definition:
      'A network made of an encoder and a decoder, used to turn one sequence, such as a sentence in French, into another sequence, such as the same sentence in English.',
    taughtIn: 11,
  },
]
