import '../styles/s10.css'
import { Block, Eyebrow } from '../components/ui'
import { Check } from '../components/Check'
import { T } from '../components/Term'
import { Cell } from './10-Cell'
import { Survival } from './10-Survival'

export function Section10() {
  return (
    <>
      <p className="lede">
        Section 9 ended with a problem: a plain recurrent network multiplies its state by roughly
        the same number at every step, so a value either shrinks toward zero or grows without
        bound. There is no setting that holds a value steady. This section builds the fix.
      </p>

      <Eyebrow>Stop multiplying, start adding</Eyebrow>
      <p>
        The plain recurrent network updates its state by multiplying it by a weight and squashing
        the result. Multiplying the same value by 0.9 every step is what produced the decay in
        section 9. An{' '}
        <T k="lstm">LSTM</T> updates its state a different way, with one extra step: it keeps an
        addition path alongside the multiplication, and controls both with a learned number
        between 0 and 1, called a <T k="gate">gate</T>.
      </p>
      <p>The update for one stored value is:</p>
      <Block label="the same thing as an equation">
        <p style={{ marginBottom: 0, fontFamily: 'var(--mono)' }}>
          new value = retain × old value + write × candidate
        </p>
      </Block>
      <p>
        Retain and write are both gates: learned numbers between 0 and 1, set by the network from
        its current input at every step. Candidate is a new value the network proposes at this
        step, also computed from the input. This one line is the whole idea. Everything else
        called an LSTM is this line, applied to several stored numbers at once, with the gates and
        the candidate computed by small learned layers.
      </p>

      <Cell />

      <Block>
        <p style={{ marginBottom: 0 }}>
          Retain at 1.00 and write at 0.00 is the setting above. At that setting, new value = 1.00
          × old value + 0.00 × candidate, which is just old value. The candidate is multiplied by
          zero, so it does not matter what it is. A value can sit in the <T k="cellstate">cell
          state</T> for any number of steps at no cost, as long as retain stays at 1 and write
          stays at 0.
        </p>
      </Block>

      <Check
        question="Retain is 1.00 and write is 0.00. A new candidate value arrives. Does the stored value change?"
        options={[
          {
            label: 'Yes, it moves partway toward the candidate',
            tone: 'wrong',
            response: (
              <p>
                It does not move at all. Moving partway would need write above 0.00. At write =
                0.00, the term write × candidate is 0.00 × candidate, which is 0.00 regardless of
                the candidate's value.
              </p>
            ),
          },
          {
            label: 'No, it stays exactly the same',
            tone: 'right',
            response: (
              <p>
                Correct. New value = 1.00 × old value + 0.00 × candidate = old value. The
                candidate is discarded this step no matter what number it is. This is the setting
                that lets a value survive unchanged for as many steps as retain stays at 1 and
                write stays at 0.
              </p>
            ),
          },
          {
            label: 'It depends on how large the candidate is',
            tone: 'wrong',
            response: (
              <p>
                It does not depend on the candidate at all here, because the candidate is
                multiplied by write, which is 0.00. A candidate of 10 or of -10 both contribute
                0.00 × candidate = 0.00 to the sum.
              </p>
            ),
          },
        ]}
      />

      <Eyebrow>Holding a value until something overwrites it</Eyebrow>
      <p>
        A trained network does not leave the gates fixed. It sets retain and write from the
        current input at every step, closing write most of the time and opening it when there is
        something worth storing or something that should replace what is stored. The figure below
        hand-sets a schedule of gate values to show the pattern: closed, then briefly open to
        store, closed again, then briefly open to overwrite.
      </p>

      <Survival />

      <Check
        question="What decides whether a gate is open or closed at a given step?"
        options={[
          {
            label: 'It is fixed once and never changes',
            tone: 'wrong',
            response: (
              <p>
                A gate is not fixed. It is computed fresh at every step from the current input, by
                a small learned layer. That is why it can be closed for ten steps and then open
                for one.
              </p>
            ),
          },
          {
            label: 'A small learned layer looks at the current input and sets the gate',
            tone: 'right',
            response: (
              <p>
                Correct. The gate values are not chosen by a programmer, they are the output of
                weights, exactly like any other part of the network, and those weights are set by
                training. What makes them behave like a switch is only that their output is
                squeezed into the range 0 to 1.
              </p>
            ),
          },
          {
            label: 'It is picked at random on each step',
            tone: 'wrong',
            response: (
              <p>
                The gate values are not random. They come from a learned layer reading the current
                input, and the same input produces the same gate value every time, since inference
                does not change any weights.
              </p>
            ),
          },
        ]}
      />

      <Eyebrow>Take away</Eyebrow>
      <Block tone="takeaway">
        <p>You can now explain two things you could not before:</p>
        <ul style={{ margin: 0, paddingLeft: 20 }}>
          <li>Why an LSTM does not suffer the same geometric decay as a plain recurrent network.</li>
          <li>What a gate is: a learned number between 0 and 1 that multiplies something else.</li>
        </ul>
        <p style={{ marginTop: 14, marginBottom: 0 }}>
          The thing to turn over away from the screen: the fix was not a new idea about language.
          It was an addition path with a learned multiplier, so that keeping a value costs
          nothing.
        </p>
      </Block>
    </>
  )
}
