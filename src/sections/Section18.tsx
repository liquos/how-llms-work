import '../styles/s18.css'
import { Block, Eyebrow } from '../components/ui'
import { Check } from '../components/Check'
import { T } from '../components/Term'
import { Stack } from './18-Stack'
import { WhatLayers } from './18-WhatLayers'

export function Section18() {
  return (
    <>
      <p className="lede">
        Section 17 built one transformer block: attention, an addition, a per-token network,
        another addition. A real model is not one block. It is the same block repeated, end to
        end, with a different set of numbers inside each copy. This section covers what changes,
        and what does not, as more copies are added.
      </p>

      <Eyebrow>The same shape, a different set of numbers each time</Eyebrow>
      <p>
        In section 8, a recurrent network reused one set of weights at every step of a loop. A
        transformer does not do that. Each block in the stack has its own weights, used once, in
        a fixed sequence from block 1 to the last block. What repeats is the arrangement of parts
        inside a block, not the numbers.
      </p>
      <p>Drag the slider to change how many blocks are stacked.</p>

      <Stack />

      <Block label="the same thing as an equation">
        <p style={{ marginBottom: 0 }}>
          One block's parameters: 4·d² for the attention matrices (query, key, value, output)
          plus 8·d² for the per-token network, which is 12·d² in total. With d = 768, that is
          12 × 768² ≈ 7.08 million numbers, repeated with different values in every block.
        </p>
      </Block>

      <p>
        The vector for one token is passed into block 1, edited, passed into block 2, edited
        again, and so on to the last block. Nothing about the vector is replaced at each step; it
        is only added to. This running, continuously edited vector is called the{' '}
        <T k="residualstream">residual stream</T>. A model with 96 blocks edits it 96 times before
        producing an output.
      </p>

      <Check
        question="In a model with 96 blocks, are all 96 of them using the same set of weights?"
        options={[
          {
            label: 'Yes, the same weights run 96 times',
            tone: 'wrong',
            response: (
              <p>
                That describes the recurrent network from section 8, where one set of weights is
                reused at every step of a loop. A transformer does not reuse weights across
                blocks. Each of the 96 blocks has its own separate set of numbers, even though all
                96 have the same arrangement of parts.
              </p>
            ),
          },
          {
            label: 'No, each block has its own separate weights',
            tone: 'right',
            response: (
              <p>
                Right. All 96 blocks are shaped the same way, but the 12·d² numbers inside block 1
                are independent of the 12·d² numbers inside block 2, and so on. A 96-block model
                with d = 768 has roughly 96 × 7.08 million ≈ 679 million numbers in its blocks
                alone, every one of them set separately during training.
              </p>
            ),
          },
          {
            label: 'Only the first block has real weights; the rest copy it',
            tone: 'wrong',
            response: (
              <p>
                No block copies another. Every block is adjusted independently during training,
                including the first one. If a later block happened to end up with the same numbers
                as an earlier one, that would be a coincidence of training, not a rule of the
                design.
              </p>
            ),
          },
        ]}
      />

      <Eyebrow>What is known about what the layers do</Eyebrow>
      <p>
        Once a vector has passed through several blocks, does it become "about" something
        specific at each stage? Researchers have tried to answer this by running small tests
        against the vectors at each layer of trained models and checking what those tests can
        recover. One frequently cited example tested a 12-layer model called BERT: tests for
        surface properties such as part of speech succeeded earliest in the stack, tests for
        sentence structure succeeded around the middle, and tests that needed the whole sentence,
        such as which word a pronoun refers to, succeeded only in the later layers. The order
        roughly matched the stages of a traditional, hand-built language processing pipeline, even
        though nobody designed the model to work that way.
      </p>
      <p>
        This is not a settled account of what every layer does, and it is not the same in every
        model. Move the slider below and notice that the three bars always overlap.
      </p>

      <WhatLayers />

      <Block tone="quiet">
        <p style={{ marginBottom: 0 }}>
          Two reasons to treat this as approximate rather than exact. First, the tests used to
          probe a layer can themselves influence what looks like it is "found" there, so different
          studies report the transitions at different depths. Second, a block edits the vector by
          addition, so whatever an early block wrote is still present, in some form, at every
          later layer; a late layer is not a blank page that only contains late-stage information.
        </p>
      </Block>

      <Check
        question="The vector for a token has just come out of block 40 of a 96-block model. What is it 'about' at that point?"
        options={[
          {
            label: 'The grammatical subject of the sentence',
            tone: 'wrong',
            response: (
              <p>
                Block 40 of 96 is a little under halfway, which studies place closer to sentence
                structure in general than to one specific property like the subject. But the
                larger problem with this answer is the word "the": no single block hands off one
                clean concept to the next. Each block edits the vector a little, in many
                directions at once.
              </p>
            ),
          },
          {
            label: "Nothing meaningful yet; only the final block's output matters",
            tone: 'wrong',
            response: (
              <p>
                The vector is meaningful at every block, not only the last one. It is the residual
                stream: each block reads the vector as it currently stands and adds something to
                it, rather than discarding what came before and starting over. Block 40's output is
                block 41's input, already carrying everything blocks 1 through 40 added.
              </p>
            ),
          },
          {
            label: 'There is no single clean answer, and researchers do not fully agree',
            tone: 'right',
            response: (
              <p>
                Right. The early-surface, middle-syntax, late-prediction picture is a rough,
                averaged pattern, not a description of any one vector at any one layer. What can be
                said with more confidence is mechanical: it is the same vector that entered block
                1, edited 40 times by addition, carrying forward everything earlier blocks wrote
                into it.
              </p>
            ),
          },
        ]}
      />

      <Eyebrow>Take away</Eyebrow>
      <Block tone="takeaway">
        <p>You can now explain two things you could not before:</p>
        <ul style={{ margin: 0, paddingLeft: 20 }}>
          <li>
            Why a 96-block model is not 96 different designs: it is one design, copied, with
            independent numbers in each copy.
          </li>
          <li>
            Why "what does layer 40 do" does not have a short, exact answer, and why the tidy
            early/middle/late story is a rough summary rather than a measured fact.
          </li>
        </ul>
        <p style={{ marginTop: 14, marginBottom: 0 }}>
          The thing to turn over away from the screen: depth is the only structural change between
          a small model and a large one. Everything that separates a small model from a large one,
          section 19's subject, comes from adding more of an already-finished part, not from
          inventing a new one.
        </p>
      </Block>
    </>
  )
}
