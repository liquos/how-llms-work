import type { GlossaryEntry } from './glossary'

/** glossary entries introduced by section 3 */
export const ENTRIES: GlossaryEntry[] = [
  {
    key: 'embedding',
    name: 'Embedding',
    definition:
      'The vector a token turns into after its ID is looked up in the embedding table. Same idea as any other vector, but "embedding" is the specific name for the one that comes out of this lookup step.',
    taughtIn: 3,
  },
  {
    key: 'embeddingtable',
    name: 'Embedding table',
    definition:
      'The full list of embeddings, one row per token ID. Looking up a token means reading one row of this table. Training sets the numbers in every row; inference only reads them.',
    taughtIn: 3,
  },
]
