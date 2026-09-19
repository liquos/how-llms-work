import '../styles/s05.css'
import { Block, Eyebrow } from '../components/ui'
import { Check } from '../components/Check'
import { T } from '../components/Term'
import { OneWeight } from './05-OneWeight'
import { Descent } from './05-Descent'
import { TwoWeights } from './05-TwoWeights'

export function Section05() {
  return (
    <>
      <p className="lede">
        Every section so far has used a network with fixed numbers in it. This section is about
        where those numbers actually come from. It is the most important section in this part of
        the course, because everything after it, the weights inside every layer you have seen,
        is a product of the process explained here.
      </p>

      <Eyebrow>Four steps, in order</Eyebrow>
      <p>Training one weight, or a hundred billion of them, is the same four steps repeated.</p>

      <Block>
        <ul style={{ margin: 0, paddingLeft: 20 }}>
          <li>The model produces a number: its prediction.</li>
          <li>The correct answer is already known, because it came from real text.</li>
          <li>
            The difference between the prediction and the correct answer is the{' '}
            <T k="loss">loss</T>.
          </li>
          <li>
            For every weight in the model, there is a direction that would make the loss smaller.
            That direction is the weight&rsquo;s <T k="gradient">gradient</T>.
          </li>
        </ul>
      </Block>

      <p>
        Computing all of those directions separately, one weight at a time, would be far too slow
        for a model with billions of weights. There is an efficient method that computes every
        weight&rsquo;s direction in a single pass over the network. That method is what makes
        training a large model possible at all. This course does not go into how the method
        works, only that it exists and that it is exact.
      </p>

      <Eyebrow>Find the bottom by hand</Eyebrow>
      <p>
        Start with the simplest possible case: one weight, one number to predict. The figure
        below draws the loss for every value of that weight. Move the slider and watch the loss
        number change with it.
      </p>

      <OneWeight />

      <Eyebrow>Now let it step downhill on its own</Eyebrow>
      <p>
        Training does not search by hand. At each step, it computes the gradient at the
        weight&rsquo;s current position, then moves the weight a small distance against that
        gradient. How large that distance is is the <T k="stepsize">step size</T>.
      </p>

      <Descent />

      <Check
        question="The step size is set far too large. What happens to the weight over repeated steps?"
        options={[
          {
            label: 'It reaches the bottom faster',
            tone: 'wrong',
            response: (
              <p>
                A larger step size does reach the area near the bottom faster, up to a point. Past
                that point each step overshoots the bottom by more than the last step did, so the
                weight moves further away each time rather than settling. Try dragging the step
                size slider above past about 1.0 and watch the readout say "off the chart".
              </p>
            ),
          },
          {
            label: 'It moves further from the minimum with each step',
            tone: 'right',
            response: (
              <p>
                Right. Each step is computed from the slope at the current position, and if the
                step is larger than the curve can tolerate, it carries the weight past the bottom
                and out the other side, further out than where it started. The next step is
                computed from that worse position and overshoots again, by more. The weight
                diverges instead of converging.
              </p>
            ),
          },
          {
            label: 'Nothing changes, the direction is still correct',
            tone: 'partly',
            response: (
              <p>
                The direction computed at each point is correct, that part is right. What goes
                wrong is the distance moved in that direction. A step large enough carries the
                weight past the bottom of the curve, to a point where the loss is higher than
                before the step, not lower.
              </p>
            ),
          },
        ]}
      />

      <Eyebrow>The same thing, in more dimensions</Eyebrow>
      <p>
        A real model does this for every weight at once, not one at a time. With two weights the
        loss becomes a surface instead of a curve, and the direction that reduces it becomes an
        arrow on a flat map instead of a single number. Nothing else about the process changes.
      </p>

      <TwoWeights />

      <Check
        question="Training runs until the loss is exactly 0 on the text it was trained on. Is the model good?"
        options={[
          {
            label: 'Yes, zero loss means the model learned the task perfectly',
            tone: 'wrong',
            response: (
              <p>
                Zero loss only says the model reproduces that exact training text perfectly. A
                model with enough weights can do that by memorising the training text rather than
                learning anything general about language, the same way a lookup table can
                reproduce its own entries exactly without being useful on new input.
              </p>
            ),
          },
          {
            label: 'Not necessarily, it may have memorised the training text instead of generalising',
            tone: 'right',
            response: (
              <p>
                Right. Training only measures loss on the text it is shown. A model can drive that
                number to 0 by memorising the exact text rather than learning the patterns that
                would let it handle text it has not seen. Whether the model generalises has to be
                checked on separate text it was never trained on.
              </p>
            ),
          },
          {
            label: 'No, zero loss is always a sign something is broken',
            tone: 'partly',
            response: (
              <p>
                Zero loss is not itself a sign of a bug, it is a sign the model fits the training
                text exactly, which is expected as training progresses. The problem is what that
                fit is made of: it can come from memorising the specific text rather than learning
                anything that transfers to new text. That has to be checked separately, not
                assumed from the training loss alone.
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
            What a weight&rsquo;s gradient is: the direction that reduces the loss, computed at
            its current value.
          </li>
          <li>
            Why the step size has to be tuned, not maximised: too small wastes steps, too large
            makes the weight diverge instead of settle.
          </li>
        </ul>
        <p style={{ marginTop: 14, marginBottom: 0 }}>
          The thing to turn over away from the screen: nobody designed the weights in a trained
          model, and nobody can read what any individual one means. They are the settled position
          of a very large number of small downhill steps, repeated over and over on real text.
        </p>
      </Block>
    </>
  )
}
