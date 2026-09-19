import type { GlossaryEntry } from './glossary'

/** glossary entries introduced by section 23 */
export const ENTRIES: GlossaryEntry[] = [
  {
    key: 'spectrogram',
    name: 'Spectrogram',
    definition:
      'A grid built from a sound: time across, frequency up the side, brightness for how much of each frequency is present at each moment. It turns a sound into a grid of numbers, which can be cut into patches the same way a picture is.',
    taughtIn: 23,
  },
  {
    key: 'diffusion',
    name: 'Diffusion',
    definition:
      'A way of generating an image by starting from random noise and repeatedly removing a little of it, using a model trained to predict what to remove. It edits the whole image at every step, unlike the token-by-token loop used for text.',
    taughtIn: 23,
  },
]
