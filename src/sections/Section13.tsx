import '../styles/s13.css'
import { Block, Eyebrow } from '../components/ui'
import { Check } from '../components/Check'
import { T } from '../components/Term'
import { Parallel13 } from './13-Parallel'
import { Scaling13 } from './13-Scaling'

export function Section13() {
  return (
    <>
      <p className="lede">
        Section 12 ended with a claim: the 2017 paper kept the attention step from section 12 and
        removed everything else. This section answers the question that claim raises. What was so
        wrong with the part that got removed?
      </p>

      <Eyebrow>What a recurrent network cannot do</Eyebrow>
      <p>
        A <T k="rnn">recurrent network</T> processes a sentence one token at a time. Step 2 reads
        the state left behind by step 1. Step 3 reads the state left behind by step 2. This is
        true regardless of how much hardware is available, because step 3 needs a number that
        does not exist until step 2 has finished producing it.
      </p>
      <p>
        Buying a second chip does not help. The second chip has nothing to work on until the
        first chip finishes step 1, because step 2's input is step 1's output. The steps are
        chained, not because of a hardware limit, but because of what the calculation is.
      </p>

      <Block label="Why this matters specifically for training">
        <p style={{ marginBottom: 0 }}>
          Training runs this calculation over billions of sentences. If one sentence of 40 tokens
          always costs 40 sequential steps, no amount of extra hardware shortens it. The chips sit
          idle waiting their turn.
        </p>
      </Block>

      <Eyebrow>What the 2017 design removed</Eyebrow>
      <p>
        <T k="attention">Attention</T>, the operation from section 12, computes each token's
        output from the other tokens' current vectors directly. Token 7's output does not read a
        state carried over from token 6. It reads token 6's vector itself, the same way it reads
        every other token's vector, in one dot product per pair.
      </p>
      <p>
        Nothing in that calculation for token 7 waits on the result for token 6. All of the
        tokens' outputs can be computed at the same time, each on its own chip, because none of
        them is an input to another.
      </p>

      <Parallel13 />

      <Check
        question="A sentence is 40 tokens long and 40 chips are available. How long does each design take, in time steps?"
        options={[
          {
            label: 'Recurrent 40, parallel 40',
            tone: 'wrong',
            response: (
              <p>
                Recurrent is right: 40 steps, one per token, no matter how many chips are free.
                Parallel is not 40. Every one of the 40 token computations only reads the
                sentence, not another token's output, so all 40 can run at the same time, one per
                chip: ceil(40 / 40) = 1 step.
              </p>
            ),
          },
          {
            label: 'Recurrent 1, parallel 40',
            tone: 'wrong',
            response: (
              <p>
                This has the two designs swapped. Recurrent cannot drop to 1 step by adding chips,
                because step 20 still needs the number that step 19 produces, and that dependency
                does not go away. Recurrent stays at 40 steps. Parallel is the one that drops, to
                ceil(40 / 40) = 1 step, because none of its 40 token computations depends on
                another.
              </p>
            ),
          },
          {
            label: 'Recurrent 40, parallel 1',
            tone: 'right',
            response: (
              <p>
                Recurrent: 40 steps, one per token, regardless of chip count. Parallel: the 40
                token computations are independent of each other, so with 40 chips they all run in
                the same step. ceil(40 / 40) = 1. This is the gap the figure above draws: at 1
                chip the two bars are equal, and it opens as chips are added.
              </p>
            ),
          },
        ]}
      />

      <Eyebrow>What that difference was worth</Eyebrow>
      <p>
        Section 1 established that compute, not data, is the limit on pretraining: text is free,
        chips and time are not. A design that can spend thousands of chips on one batch of
        sentences, instead of leaving most of them idle, can spend far more compute in the same
        wall-clock time. That is the whole trade the 2017 paper made.
      </p>

      <Scaling13 />

      <p>
        Training a sentence one token at a time and scoring the whole known target sentence at
        once are different calculations. During training, the correct next token for every
        position is already known, because it is sitting right there in the training text, so
        every position's loss can be computed in the same pass. Producing a reply is not like
        this: token 7 of a reply does not exist until the model has chosen it, so there is nothing
        for a later position to compute yet.
      </p>

      <Check
        question="The transformer is much faster to train than a recurrent network of the same size. Is it also faster at producing one reply?"
        options={[
          {
            label: 'Yes, the same parallel processing speeds up both',
            tone: 'wrong',
            response: (
              <p>
                No. Training is fast to parallelise because the entire target sentence is already
                known text, so every position's prediction can be scored in one pass. Generating a
                reply does not have that luxury: token 7 cannot be produced until token 6 has been
                chosen and added to the text, exactly as in section 1's generation loop. Producing
                a reply is still one full pass of the machine per token.
              </p>
            ),
          },
          {
            label: 'No, because each pass still reads the whole conversation so far',
            tone: 'partly',
            response: (
              <p>
                That is true, and it is what section 1 covered, but it is not the reason
                generation did not get faster. The reason is narrower: token 7 does not exist
                until the model has produced it, so there is nothing to compute in parallel across
                positions that have not been generated yet. Generation is one pass per token,
                whether that pass rereads a short conversation or a long one.
              </p>
            ),
          },
          {
            label: 'No, generation is still one pass per token',
            tone: 'right',
            response: (
              <p>
                Correct, and this is the part people expect to be different. The 2017 design
                changed how training uses hardware. It did not change the generation loop from
                section 1 at all: score every token in the vocabulary, pick one, append it, run
                the whole machine again. That loop still costs one pass per output token, no
                matter how parallel the inside of one pass is.
              </p>
            ),
          },
        ]}
      />

      <Eyebrow>Take away</Eyebrow>
      <Block tone="takeaway">
        <p>You can now explain the central question of this course:</p>
        <ul style={{ margin: 0, paddingLeft: 20 }}>
          <li>
            A recurrent network cannot be parallelised along a sentence, because each step's input
            is the previous step's output.
          </li>
          <li>
            Attention has no such chain: every token's output reads the other tokens directly, so
            all of them can be computed at once, on separate chips.
          </li>
          <li>
            That gap is a training-time gap only. Generating a reply is still one pass per token,
            because the text being generated does not exist yet to parallelise across.
          </li>
        </ul>
        <p style={{ marginTop: 14, marginBottom: 0 }}>
          The thing to turn over away from the screen: the 2017 paper did not make the model think
          faster. It removed a constraint on how much compute could be spent building it. Every
          section after this one is a consequence of what people did once that constraint was
          gone.
        </p>
      </Block>
    </>
  )
}
