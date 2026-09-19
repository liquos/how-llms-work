import '../styles/s07.css'
import { Block, Eyebrow } from '../components/ui'
import { Check } from '../components/Check'
import { T } from '../components/Term'
import { Window } from './07-Window'
import { Cost } from './07-Cost'

export function Section07() {
  return (
    <>
      <p className="lede">
        Sections 2 to 6 built the model published by Bengio and others in 2003: look up a
        vector for each of the previous N tokens, join them, pass them through two layers, get
        a score for every token in the vocabulary. This section asks what that model cannot do,
        because every section from here on is someone's answer to a problem raised by the one
        before.
      </p>

      <Eyebrow>The window is fixed</Eyebrow>
      <p>
        The model does not read "the whole sentence so far". It reads exactly the previous N
        tokens, where N was chosen before training and never changes. Anything before that
        window does not exist as far as the model is concerned, not faded, not summarised, not
        there at all.
      </p>
      <p>
        Drag the sliders below. The sentence needs "keys" to pick "are" over "is", and "keys" is
        12 positions before the verb.
      </p>

      <Window />

      <Block label="what just happened">
        <p style={{ marginBottom: 0 }}>
          At small window sizes the model predicting "are" never sees "keys" at all. It is not
          that the model reads it and forgets it, or reads it faintly. The token is not part of
          the input for that prediction. Nothing the model does can recover information that was
          never given to it.
        </p>
      </Block>

      <Check
        question='The window is 10 tokens wide, and the word the model needs is 30 positions back. What does the model see when it makes its prediction?'
        options={[
          {
            label: 'A faded or partial version of that word',
            tone: 'wrong',
            response: (
              <p>
                There is no faded version. The window is a hard cutoff: the last 10 tokens go in,
                everything before that is not part of the input. A word 30 positions back is 20
                positions past the edge of a 10-token window, so it contributes nothing at all.
              </p>
            ),
          },
          {
            label: 'Nothing about that word',
            tone: 'right',
            response: (
              <p>
                Correct. The model only ever receives the last 10 tokens. A word 30 positions
                back was never part of the input for this prediction, so there is no mechanism by
                which it could affect the output.
              </p>
            ),
          },
          {
            label: 'The whole sentence, but weighted less for older words',
            tone: 'wrong',
            response: (
              <p>
                That describes a different design, not this one. This model has no notion of
                weighting older words less. It has a hard edge at N tokens: inside the window, a
                word is read in full; outside it, it is not read at all.
              </p>
            ),
          },
        ]}
      />

      <Eyebrow>Widening the window is not free</Eyebrow>
      <p>
        The obvious fix is to make N bigger. Every extra token in the window adds its full
        vector to the input that gets fully connected to the hidden layer, so the first layer's
        parameter count grows in direct proportion to N.
      </p>

      <Cost />

      <Check
        question="The window size doubles, from 10 tokens to 20. What happens to the number of parameters in the first layer?"
        options={[
          {
            label: 'It roughly doubles',
            tone: 'right',
            response: (
              <p>
                Right. The input width is N times the vector size, and the weight count is the
                input width times the number of hidden units, so weight count scales directly
                with N. Doubling N roughly doubles this layer, as the figure above shows for any
                setting.
              </p>
            ),
          },
          {
            label: 'It stays about the same',
            tone: 'wrong',
            response: (
              <p>
                It does not. Every additional token contributes a full extra vector to the input,
                and that vector is fully connected to every hidden unit. The parameter count
                tracks N directly: doubling N roughly doubles it.
              </p>
            ),
          },
          {
            label: 'It roughly quadruples',
            tone: 'wrong',
            response: (
              <p>
                Quadrupling would happen if both the window and the vector size doubled together.
                Here only the window doubles, and the parameter count scales with N alone, so it
                roughly doubles, not quadruples.
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
            Why the 2003 model has a hard horizon: it reads exactly N previous tokens, and
            anything before that is simply not part of its input.
          </li>
          <li>Why that horizon cannot just be widened: the cost grows directly with it.</li>
        </ul>
        <p style={{ marginTop: 14, marginBottom: 0 }}>
          The thing to turn over away from the screen: what would it take for a model to reach
          back an arbitrary distance without paying for every extra position by name. The next
          section is one answer to that, built with a <T k="rnn">loop</T> instead of a wider
          window.
        </p>
      </Block>
    </>
  )
}
