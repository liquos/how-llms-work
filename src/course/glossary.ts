import { ENTRIES as S02 } from './glossary.s02'
import { ENTRIES as S03 } from './glossary.s03'
import { ENTRIES as S04 } from './glossary.s04'
import { ENTRIES as S05 } from './glossary.s05'
import { ENTRIES as S06 } from './glossary.s06'
import { ENTRIES as S07 } from './glossary.s07'
import { ENTRIES as S08 } from './glossary.s08'
import { ENTRIES as S09 } from './glossary.s09'
import { ENTRIES as S10 } from './glossary.s10'
import { ENTRIES as S11 } from './glossary.s11'
import { ENTRIES as S12 } from './glossary.s12'
import { ENTRIES as S13 } from './glossary.s13'
import { ENTRIES as S14 } from './glossary.s14'
import { ENTRIES as S15 } from './glossary.s15'
import { ENTRIES as S16 } from './glossary.s16'
import { ENTRIES as S17 } from './glossary.s17'
import { ENTRIES as S18 } from './glossary.s18'
import { ENTRIES as S19 } from './glossary.s19'
import { ENTRIES as S20 } from './glossary.s20'
import { ENTRIES as S21 } from './glossary.s21'
import { ENTRIES as S22 } from './glossary.s22'
import { ENTRIES as S23 } from './glossary.s23'

export interface GlossaryEntry {
  /** key used in <T k="..."> */
  key: string
  /** displayed name */
  name: string
  /** what an acronym stands for, if it is one */
  expansion?: string
  /** one or two plain sentences */
  definition: string
  /** section where this is explained; undefined means not covered yet */
  taughtIn?: number
}

export const GLOSSARY: GlossaryEntry[] = [
  {
    key: 'llm',
    name: 'LLM',
    expansion: 'Large Language Model',
    definition:
      'A program that takes some text and produces a score for every possible next word. Large refers to the number of adjustable numbers inside it, which is usually in the billions.',
    taughtIn: 1,
  },
  {
    key: 'token',
    name: 'Token',
    definition:
      'One piece of text after it has been split up for the model. A token is often a whole word, but long or uncommon words are split into several tokens.',
    taughtIn: 1,
  },
  {
    key: 'vector',
    name: 'Vector',
    definition:
      'An ordered list of numbers. A position in 3D space is a vector of 3 numbers. A token inside a language model is a vector of a few hundred to a few thousand numbers.',
    taughtIn: 1,
  },
  {
    key: 'inference',
    name: 'Inference',
    definition:
      'Running the finished model to produce output. The numbers inside the model do not change during inference. This is what happens when you send a message.',
    taughtIn: 1,
  },
  {
    key: 'training',
    name: 'Training',
    definition:
      'The separate process that sets the numbers inside the model. It runs once, before anyone uses the model, and takes weeks or months.',
    taughtIn: 1,
  },
  {
    key: 'parameter',
    name: 'Parameter',
    definition:
      'One adjustable number inside the model. Weights and biases are both parameters. Training sets them; inference only reads them.',
    taughtIn: 1,
  },
  {
    key: 'weight',
    name: 'Weight',
    definition:
      'A number that an input gets multiplied by before it is added to the others. Weights are the majority of a model’s parameters.',
    taughtIn: 1,
  },
  {
    key: 'pretraining',
    name: 'Pretraining',
    definition:
      'The first and largest training stage. The model is repeatedly shown real text with the next word hidden, and asked to predict it. No human writes any answers, because the text already contains them.',
    taughtIn: 1,
  },
  {
    key: 'sft',
    name: 'SFT',
    expansion: 'Supervised Fine-Tuning',
    definition:
      'A training stage after pretraining. The model is shown written examples of a helpful assistant answering questions, so that it responds like one instead of simply continuing the text.',
    taughtIn: 1,
  },
  {
    key: 'rlhf',
    name: 'RLHF',
    expansion: 'Reinforcement Learning from Human Feedback',
    definition:
      'The last and smallest training stage. People are shown two answers from the model and pick the better one. The model is then adjusted towards the kind of answer that gets picked.',
    taughtIn: 1,
  },
  {
    key: 'transformer',
    name: 'Transformer',
    definition:
      'The arrangement of parts introduced in 2017 that almost every current language model uses. Its defining feature is that it processes every token at the same time rather than one after another.',
    taughtIn: 0,
  },
  {
    key: 'attention',
    name: 'Attention',
    definition:
      'A step that lets each token collect information from the other tokens before it is processed further. It is covered in detail in part 3.',
    taughtIn: 0,
  },
  {
    key: 'gpu',
    name: 'GPU',
    expansion: 'Graphics Processing Unit',
    definition:
      'A chip built to run many thousands of small calculations at the same time. It was designed for rendering graphics, and turned out to suit neural networks for the same reason.',
    taughtIn: 0,
  },
  {
    key: 'rnn',
    name: 'RNN',
    expansion: 'Recurrent Neural Network',
    definition:
      'A network that reads a sequence one token at a time, carrying a running summary forward from each step to the next. It was the standard approach for text before 2017.',
    taughtIn: 0,
  },
  {
    key: 'lstm',
    name: 'LSTM',
    expansion: 'Long Short-Term Memory',
    definition:
      'A recurrent neural network with extra controls deciding what to keep in its running summary and what to overwrite. Built because plain recurrent networks lose the start of a long sentence.',
    taughtIn: 0,
  },
  {
    key: 'neuralnet',
    name: 'Neural network',
    definition:
      'A stack of layers, where each layer multiplies its inputs by weights, adds them up, adds a bias, and applies a simple bending function. The whole model is built from this one repeated idea.',
    taughtIn: 0,
  },
]

const ALL: GlossaryEntry[] = [
  ...GLOSSARY,
  ...S02,
  ...S03,
  ...S04,
  ...S05,
  ...S06,
  ...S07,
  ...S08,
  ...S09,
  ...S10,
  ...S11,
  ...S12,
  ...S13,
  ...S14,
  ...S15,
  ...S16,
  ...S17,
  ...S18,
  ...S19,
  ...S20,
  ...S21,
  ...S22,
  ...S23,
]

const INDEX = new Map(ALL.map((g) => [g.key, g]))

export const lookup = (key: string): GlossaryEntry | undefined => INDEX.get(key)
