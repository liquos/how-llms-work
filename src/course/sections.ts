export type PartId = 0 | 1 | 2 | 3 | 4

export interface PartMeta {
  id: PartId
  title: string
  blurb: string
}

export interface SectionMeta {
  id: number
  part: PartId
  title: string
  /** false while the section has not been written yet */
  ready: boolean
  /** rough minutes for one sitting */
  minutes?: number
}

export const PARTS: PartMeta[] = [
  { id: 0, title: 'Before we start', blurb: 'What this covers and why.' },
  { id: 1, title: 'Build a small language model', blurb: 'Every piece, assembled by you.' },
  { id: 2, title: 'What came before', blurb: 'And what was wrong with it.' },
  { id: 3, title: 'The paper', blurb: 'Attention Is All You Need, 2017.' },
  { id: 4, title: 'Multimodal models', blurb: 'Images and audio in the same machine.' },
]

export const SECTIONS: SectionMeta[] = [
  { id: 0, part: 0, title: 'What you are going to understand', ready: true, minutes: 10 },

  { id: 1, part: 1, title: 'The map, and the two separate machines', ready: true, minutes: 20 },
  { id: 2, part: 1, title: 'Text to tokens', ready: true, minutes: 15 },
  { id: 3, part: 1, title: 'Tokens to vectors, and what a direction means', ready: true, minutes: 20 },
  { id: 4, part: 1, title: 'A neuron, a layer, and why it has to bend', ready: true, minutes: 20 },
  { id: 5, part: 1, title: 'How the numbers get set', ready: true, minutes: 25 },
  { id: 6, part: 1, title: 'Turning the last vector into a word', ready: true, minutes: 15 },

  { id: 7, part: 2, title: 'Why that model cannot read a sentence', ready: true, minutes: 15 },
  { id: 8, part: 2, title: 'Recurrent networks: the loop', ready: true, minutes: 20 },
  { id: 9, part: 2, title: 'The forgetting problem', ready: true, minutes: 20 },
  { id: 10, part: 2, title: 'LSTM: keeping and overwriting', ready: true, minutes: 20 },
  { id: 11, part: 2, title: 'Translation, and the vector everything squeezed through', ready: true, minutes: 20 },
  { id: 12, part: 2, title: 'Attention, bolted onto a recurrent network', ready: true, minutes: 25 },

  { id: 13, part: 3, title: 'The bottleneck: sequential work will not parallelise', ready: true, minutes: 20 },
  { id: 14, part: 3, title: 'Self-attention: query, key, value', ready: true, minutes: 30 },
  { id: 15, part: 3, title: 'Multiple heads', ready: true, minutes: 20 },
  { id: 16, part: 3, title: 'Putting word order back in', ready: true, minutes: 20 },
  { id: 17, part: 3, title: 'Assembling one transformer block', ready: true, minutes: 25 },
  { id: 18, part: 3, title: 'Stacking blocks', ready: true, minutes: 20 },
  { id: 19, part: 3, title: 'Why this changed the field', ready: true, minutes: 20 },

  { id: 20, part: 4, title: 'An image as a sequence of tokens', ready: true, minutes: 20 },
  { id: 21, part: 4, title: 'Text and images in one space', ready: true, minutes: 20 },
  { id: 22, part: 4, title: 'Connecting a vision encoder to a language model', ready: true, minutes: 20 },
  { id: 23, part: 4, title: 'Audio, video, and generating instead of reading', ready: true, minutes: 20 },
]

export const bySection = (id: number) => SECTIONS.find((s) => s.id === id)

export const readySections = () => SECTIONS.filter((s) => s.ready)

export function nextReady(id: number): SectionMeta | undefined {
  return SECTIONS.filter((s) => s.ready && s.id > id).sort((a, b) => a.id - b.id)[0]
}

export function prevReady(id: number): SectionMeta | undefined {
  return SECTIONS.filter((s) => s.ready && s.id < id).sort((a, b) => b.id - a.id)[0]
}
