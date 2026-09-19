import '../styles/s09.css'
import { Block, Eyebrow } from '../components/ui'
import { Check } from '../components/Check'
import { T } from '../components/Term'
import { Decay } from './09-Decay'
import { Agreement } from './09-Agreement'

export function Section09() {
  return (
    <>
      <p className="lede">
        Section 8 ended on a distinction: a recurrent network's state can in principle carry
        information from any earlier token, but that is not the same as it doing so in practice.
        This section is about why, in practice, it usually does not, for tokens more than a
        short distance back.
      </p>

      <Eyebrow>The same multiplication, every step</Eyebrow>
      <p>
        Look at the arithmetic inside the loop from section 8: at every step, the previous state
        gets multiplied by a weight before it is combined with the new token. Whatever a piece of
        information contributes to the state, that contribution gets multiplied again at the
        next step, and again at the one after that. Multiplying the same number by itself, once
        per step, is repeated multiplication, and repeated multiplication has a well known
        property.
      </p>

      <Decay />

      <Block label="why there is no safe middle setting">
        <p style={{ marginBottom: 0 }}>
          A multiplier of 0.9 looks close to 1, and for a handful of steps it barely matters:
          0.9 once is 0.9, 0.9 twice is 0.81. But the model runs this multiplication once per
          token, and a paragraph is easily 40 or 50 tokens. 0.9<sup>40</sup> is about 0.015,
          so under 2% of the original contribution is left. A multiplier of 1.1 is just as close
          to 1 on the other side, and 1.1<sup>40</sup> is about 45: the value has grown 45 times
          larger than it started. Shrinking toward zero this way, once per step, is called a{' '}
          <T k="vanishinggradient">vanishing gradient</T>.
        </p>
      </Block>

      <Check
        question="A component decays by a factor of 0.9 every step, over 50 steps. Roughly what fraction of the original value is left?"
        options={[
          {
            label: 'About half',
            tone: 'wrong',
            response: (
              <p>
                Half would be about right for 7 steps, since 0.9<sup>7</sup> is about 0.48. Over
                50 steps the multiplication happens far more times: 0.9<sup>50</sup> is about
                0.0052, which is roughly half a percent, not half.
              </p>
            ),
          },
          {
            label: 'About 5%',
            tone: 'wrong',
            response: (
              <p>
                Close, but off by about a factor of 10. 0.9<sup>50</sup> is about 0.0052. 5%
                would be roughly right for 0.9<sup>28</sup>. Every extra step multiplies by 0.9
                again, so the value keeps shrinking well past that point.
              </p>
            ),
          },
          {
            label: 'About 0.5%',
            tone: 'right',
            response: (
              <p>
                Correct. 0.9<sup>50</sup> is about 0.0052, roughly half a percent of the
                original value. At that point the contribution is close enough to zero that it
                has essentially no effect on anything downstream.
              </p>
            ),
          },
        ]}
      />

      <Eyebrow>Watching it happen in a sentence</Eyebrow>
      <p>
        The plural subject "keys" needs to reach the verb for the model to pick "are" over "is".
        The more words sit between them, the more decay steps that signal goes through before it
        is needed.
      </p>

      <Agreement />

      <Check
        question='Given the knife edge in the decay figure, why not just set the multiplier to exactly 1.00 and be done with it?'
        options={[
          {
            label: 'Because training does not land on exact values and hold them there',
            tone: 'right',
            response: (
              <p>
                Right. The multiplier is a parameter set by the gradient steps from section 5,
                nudged a little in each direction over billions of updates. It has no reason to
                settle on exactly 1.00 and stay there rather than 0.999 or 1.001, and either of
                those decays or explodes once enough steps are run. Even if training somehow hit
                1.00 exactly, the next update would very likely move it off again.
              </p>
            ),
          },
          {
            label: 'Because a multiplier of 1 is mathematically undefined',
            tone: 'wrong',
            response: (
              <p>
                A multiplier of 1 is perfectly well defined; 1 times anything is that same
                thing, forever. The problem is not that 1.00 is invalid, it is that a learning
                process has no way to land on that exact value and keep it there rather than
                drifting to one side.
              </p>
            ),
          },
          {
            label: 'Because a real sentence never needs anything kept for more than a few steps',
            tone: 'wrong',
            response: (
              <p>
                The keys-and-cabinet example above is a case where it is needed for well over a
                few steps, and sentences of that shape are common. The real obstacle is not that
                long-distance memory is unnecessary, it is that a single fixed multiplier cannot
                hold a value steady across many steps without either shrinking it away or letting
                it blow up.
              </p>
            ),
          },
        ]}
      />

      <Eyebrow>Take away</Eyebrow>
      <Block tone="takeaway">
        <p>You can now explain what you could not before:</p>
        <ul style={{ margin: 0, paddingLeft: 20 }}>
          <li>
            A plain recurrent network's memory fades geometrically, because every step
            multiplies what came before by the same weight again.
          </li>
          <li>
            There is no safe fixed value for that weight: below 1 it decays toward zero, above 1
            it grows without bound, and exactly 1 is not a setting a learning process can reliably
            reach and hold.
          </li>
        </ul>
        <p style={{ marginTop: 14, marginBottom: 0 }}>
          The thing to turn over away from the screen: the problem is not the idea of a carried
          state, section 8 showed that a state can in principle reach any distance. The problem
          is doing the carrying with one fixed multiplication applied at every step. The next
          section is about a network that keeps the state, but replaces that one multiplication
          with something a lot less fragile.
        </p>
      </Block>
    </>
  )
}
