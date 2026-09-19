import '../styles/s06.css'
import { Block, Eyebrow } from '../components/ui'
import { Check } from '../components/Check'
import { T } from '../components/Term'
import { Logits } from './06-Logits'
import { Softmax } from './06-Softmax'
import { Sampling } from './06-Sampling'

export function Section06() {
  return (
    <>
      <p className="lede">
        Section 5 explained how the weights get set. This section covers the last step of a
        single pass: turning the network&rsquo;s final vector into an actual word. This closes
        out part 1.
      </p>

      <Eyebrow>A score for every token</Eyebrow>
      <p>
        The network produces one vector for the position it is predicting. Every token in the
        vocabulary has its own learned row of numbers, and the model scores each token by taking
        the dot product of its row with that vector. Nothing here is new arithmetic; it is the
        same weighted sum from section 4, run once per token in the vocabulary.
      </p>

      <Logits />

      <Eyebrow>Turning scores into probabilities</Eyebrow>
      <p>
        Raw scores are not probabilities. They can be negative, and the highest one is not
        pinned to any particular value. <T k="softmax">Softmax</T> fixes both problems: it
        exponentiates every score, which makes them all positive, then divides each by the total,
        which makes them sum to exactly 100%.
      </p>
      <p>
        <T k="temperature">Temperature</T> is a knob on that calculation, not a separate step.
        Dividing every score by the temperature before exponentiating stretches the scores apart
        when temperature is low and squeezes them together when temperature is high.
      </p>

      <Softmax />

      <Check
        question="Temperature is set to a value very close to 0. What does the model produce?"
        options={[
          {
            label: 'Whatever token has the highest score, essentially every time',
            tone: 'right',
            response: (
              <p>
                Right. Dividing the scores by a very small temperature stretches the gap between
                the highest score and the rest to a huge size before exponentiating, so softmax
                pushes almost all of the probability onto the single highest-scoring token. In the
                limit, picking a token this way becomes the same as just picking the highest score
                directly.
              </p>
            ),
          },
          {
            label: 'A uniformly random token',
            tone: 'wrong',
            response: (
              <p>
                That is what happens at very <em>high</em> temperature, where the scores get
                squeezed together until they are nearly equal. Near 0, the opposite happens: the
                gaps between scores get stretched apart, and the highest-scoring token takes
                nearly all of the probability.
              </p>
            ),
          },
          {
            label: 'No output, dividing by 0 is undefined',
            tone: 'partly',
            response: (
              <p>
                Dividing by exactly 0 is undefined, which is correct, but the question is about a
                temperature very close to 0, not exactly 0. As temperature approaches 0, softmax
                approaches a specific, well-defined behaviour: put all of the probability on the
                single highest-scoring token.
              </p>
            ),
          },
        ]}
      />

      <Eyebrow>The choice happens outside the model</Eyebrow>
      <p>
        Softmax produces a full distribution over every token in the vocabulary, not a single
        winner. Picking one token from that distribution, <T k="sampling">sampling</T>, is a
        separate step done by the program running the model. Draw repeatedly below and watch the
        tally build up.
      </p>

      <Sampling />

      <Check
        question="The same prompt is sent to a model twice and the two replies start with different words. Which part changed between the two runs?"
        options={[
          {
            label: 'The weights inside the model',
            tone: 'wrong',
            response: (
              <p>
                The weights are fixed during inference, as section 1 covered; nothing about the
                model changed between the two runs. What can change is which token gets picked
                once the distribution is computed. The distribution itself, produced by softmax,
                was identical both times.
              </p>
            ),
          },
          {
            label: 'The probability distribution over the vocabulary',
            tone: 'wrong',
            response: (
              <p>
                Given the same input and the same weights, softmax produces exactly the same
                distribution every time; that part does not vary. What varies is the random draw
                made from that fixed distribution. Two draws from the same distribution can land
                on different tokens.
              </p>
            ),
          },
          {
            label: 'Which token got drawn from the distribution',
            tone: 'right',
            response: (
              <p>
                Right. The scores and the probabilities softmax computes from them are the same
                both times, because the weights and the input are the same. Sampling draws one
                token at random according to those probabilities, and a random draw is not
                required to land on the same token twice, even from the exact same distribution.
              </p>
            ),
          },
        ]}
      />

      <Block tone="takeaway">
        <p>
          What you have built across sections 2 to 6 has a name. Take the previous few tokens.
          Look up a vector for each one. Join them, pass them through two layers with a bending
          function between them, and produce a score for every token in the vocabulary. That is
          the neural language model published by Bengio and others in 2003, the same stop you saw
          on the timeline in section 0. Every model built since, including the transformer this
          course builds up to in part 3, still produces its output through exactly this last
          step: a vector, turned into scores, turned into probabilities, turned into a token by a
          random draw outside the model itself.
        </p>
      </Block>

      <Eyebrow>Take away</Eyebrow>
      <Block tone="takeaway">
        <p style={{ marginBottom: 0 }}>
          The model never outputs a word. It outputs a probability for every word it knows about,
          and something else, outside the model, makes the choice. Whether that choice always
          takes the highest probability or draws at random is a setting on the program running the
          model, not a property of the model itself.
        </p>
      </Block>
    </>
  )
}
