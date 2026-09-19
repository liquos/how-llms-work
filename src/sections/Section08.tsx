import '../styles/s08.css'
import { Block, Eyebrow } from '../components/ui'
import { Check } from '../components/Check'
import { T } from '../components/Term'
import { Unroll } from './08-Unroll'
import { StateWatch } from './08-StateWatch'

export function Section08() {
  return (
    <>
      <p className="lede">
        Section 7 ended on a question: what would it take for a model to reach back an
        arbitrary distance, without paying for every extra position by name. A{' '}
        <T k="rnn">recurrent neural network</T> answers it by changing the shape of the
        computation itself: instead of reading N tokens at once, it reads one token at a time,
        and carries a running summary forward.
      </p>

      <Eyebrow>One token in, one state out</Eyebrow>
      <p>
        At each step the network takes two things: the current token, and the{' '}
        <T k="hiddenstate">state</T> left over from the previous step. From those two it
        computes a new state. That new state is the only thing passed to the next step. The
        token before it is not re-read.
      </p>
      <p>
        Drag the slider below to step through a sentence one token at a time and watch its
        8-number state change.
      </p>

      <Unroll />

      <Block label="the part that is easy to miss">
        <p style={{ marginBottom: 0 }}>
          The diagram at the top is not eight different blocks joined in a row. It is one block,
          drawn eight times because it runs eight times. The numbers inside that block, the ones
          that turn a token and a state into the next state, are identical at every step. What
          changes from step to step is only the state and the current token, both of which are
          data, not weights.
        </p>
      </Block>

      <Check
        question="Can the step that processes token 5 start before the step that processes token 4 has finished?"
        options={[
          {
            label: 'No, because it needs the state that step 4 produces',
            tone: 'right',
            response: (
              <p>
                Correct. Step 5 takes the state coming out of step 4 as one of its two inputs.
                Until that state exists, step 5 has nothing to compute with. The same is true all
                the way back to step 0, so the whole sequence has to run in order, one step after
                the other.
              </p>
            ),
          },
          {
            label: 'Yes, since the two steps use the same weights',
            tone: 'wrong',
            response: (
              <p>
                Using the same weights does not remove the dependency. Step 5 still needs the
                state that step 4 produces as one of its inputs. Sharing weights only means the
                two steps do the same kind of computation, not that they can run at the same
                time.
              </p>
            ),
          },
          {
            label: 'Yes, if the token at position 5 is already known',
            tone: 'wrong',
            response: (
              <p>
                Knowing the token is not enough. The other input to step 5 is the state produced
                by step 4, which itself depends on step 3, and so on. Step 5 cannot run until
                that chain has actually been computed, regardless of whether the token text is
                available in advance.
              </p>
            ),
          },
        ]}
      />

      <Eyebrow>What one component of the state can carry</Eyebrow>
      <p>
        A state does not have to mean anything on its own, but a network can shape one of its
        numbers to track something specific. Below, one component is hand-built to rise when it
        reads a plural subject and fade afterwards, so it can still be raised when the verb
        arrives several tokens later.
      </p>

      <StateWatch />

      <Check
        question="The sentence is 40 tokens long. How many separate sets of weights does the network use to process it?"
        options={[
          {
            label: 'One, reused at every step',
            tone: 'right',
            response: (
              <p>
                Right. There is exactly one set of weights, the block from the figure above. It
                is applied 40 times, once per token, and it is the same numbers every time. This
                is also why the network's size does not depend on the sentence length: a 40-token
                sentence and a 4-token sentence use the same weights.
              </p>
            ),
          },
          {
            label: '40, one for each token',
            tone: 'wrong',
            response: (
              <p>
                It only looks that way because the same block is drawn once per token in the
                unrolled diagram. Every one of those drawings is the same weights. There is one
                set, not 40, and that is what makes the network's size independent of sentence
                length.
              </p>
            ),
          },
          {
            label: '2, one for the state and one for the token',
            tone: 'partly',
            response: (
              <p>
                It is true that the state and the token each go through their own weight matrix
                inside the block, so there are two matrices in that sense. But that pair is the
                same pair at every one of the 40 steps. There is one complete set of weights for
                the whole sentence, not one set per step.
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
            Why a recurrent network has no fixed window: its state can in principle carry
            information from any earlier token, however far back, because nothing is thrown away
            by design the way a window throws away everything past position N.
          </li>
          <li>
            Why its steps cannot run at the same time: each one needs the state the previous step
            produced.
          </li>
        </ul>
        <p style={{ marginTop: 14, marginBottom: 0 }}>
          The thing to turn over away from the screen: "can in principle carry anything" is not
          the same as "does carry it in practice". The next section is about the gap between
          those two.
        </p>
      </Block>
    </>
  )
}
