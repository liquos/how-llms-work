import type { GlossaryEntry } from './glossary'

/** glossary entries introduced by section 21 */
export const ENTRIES: GlossaryEntry[] = [
  {
    key: 'contrastive',
    name: 'Contrastive training',
    definition:
      'A way of training two encoders together. For a matching pair, such as a picture and its caption, their vectors are pulled closer together. For every non-matching pair, their vectors are pushed further apart.',
    taughtIn: 21,
  },
  {
    key: 'clip',
    name: 'CLIP',
    expansion: 'Contrastive Language-Image Pretraining',
    definition:
      'A model trained with contrastive training on images and their captions, so that an image encoder and a text encoder write into the same vector space. It is the approach that made this way of connecting images and text well known.',
    taughtIn: 21,
  },
]
