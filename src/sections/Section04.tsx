import '../styles/s04.css'
import { Block, Eyebrow } from '../components/ui'
import { Check } from '../components/Check'
import { T } from '../components/Term'
import { Neuron } from './04-Neuron'
import { Bending } from './04-Bending'

export function Section04() {
  return (
    <>
      <p className="lede">
        Section 3 ended with a vector for every token. This section is about what one layer of
        the network does to those vectors. Most of it confirms what you already know. One part
        is new: what the activation function does to the shape of the function the network
        computes.
      </p>

      <Eyebrow>One neuron, confirmed</Eyebrow>
      <p>
        A <T k="neuralnet">neuron</T> takes some inputs, multiplies each by a{' '}
        <T k="weight">weight</T>, adds them up, adds a <T k="bias">bias</T>, and passes the
        result through an <T k="activation">activation function</T>. Move the sliders below and
        watch each step compute.
      </p>

      <Neuron />

      <Check
        question="Two layers, both with no activation function in between. Can they always be replaced by a single layer?"
        options={[
          {
            label: 'Yes, one linear layer always does the same job',
            tone: 'right',
            response: (
              <p>
                Right, and this is the reasoning you already had: a linear layer is a matrix
                multiplication plus a bias. Feeding the output of one straight into another is
                two matrix multiplications in a row, and the product of two matrices is just
                another matrix. So two linear layers stacked with nothing bending the signal
                between them compute exactly what one linear layer could compute. No number of
                stacked linear layers gets around this.
              </p>
            ),
          },
          {
            label: 'No, two layers can compute more than one layer',
            tone: 'wrong',
            response: (
              <p>
                Two <em>linear</em> layers cannot. A linear layer is a matrix multiplication plus
                a bias, and applying one linear layer after another is still just a matrix
                multiplication plus a bias, with different numbers in it. The two layers only
                gain something the single layer could not do once a bending function sits between
                them.
              </p>
            ),
          },
          {
            label: 'Only if the bias is zero',
            tone: 'wrong',
            response: (
              <p>
                The bias does not change the answer here. Whether or not there is a bias, two
                linear layers in a row still collapse into one linear layer, because a linear
                function composed with a linear function is linear. What matters is whether an
                activation function sits between the two layers, not what the bias is set to.
              </p>
            ),
          },
        ]}
      />

      <Eyebrow>What the activation function actually does to the shape</Eyebrow>
      <p>
        You already know why the network needs a bending function: without one, it reduces to a
        single linear layer. What that bending looks like, drawn as a curve, is the new part of
        this section.
      </p>
      <p>
        The figure below plots the input-to-output curve of a small network built from ReLU
        units stacked side by side. Each unit can only do one thing to the curve: add one kink at
        one point. Turn the activation off and every kink disappears, no matter how many units
        are in the sum.
      </p>

      <Bending />

      <Check
        question="With 4 ReLU units summed together, at most how many kinks can the resulting curve have?"
        options={[
          {
            label: '1',
            tone: 'wrong',
            response: (
              <p>
                Each ReLU unit contributes one kink, at the point where its input crosses zero.
                With 4 units there can be up to 4 kinks, one per unit, not 1.
              </p>
            ),
          },
          {
            label: '4',
            tone: 'right',
            response: (
              <p>
                Right. Each ReLU unit bends the curve at exactly one point, so summing 4 of them
                can produce at most 4 kinks. That matches what you dragged the slider through
                above: raising the unit count from 1 to 4 added one visible dot, one kink, at a
                time.
              </p>
            ),
          },
          {
            label: 'As many as needed, ReLU units are unlimited',
            tone: 'wrong',
            response: (
              <p>
                A single ReLU unit is limited to one kink, so the number of kinks is capped by
                the number of units, not unlimited. 4 units means at most 4 kinks. Fitting a more
                complicated curve requires more units, which is why bigger networks can fit more
                complicated functions.
              </p>
            ),
          },
        ]}
      />

      <Eyebrow>Take away</Eyebrow>
      <Block tone="takeaway">
        <p>You can now explain two things you could not before:</p>
        <ul style={{ margin: 0, paddingLeft: 20 }}>
          <li>Why a stack of purely linear layers is pointless, in terms of matrix products.</li>
          <li>
            What the activation function contributes visually: one kink per unit, and nothing
            else. Everything the network can fit that is not a straight line comes from those
            kinks.
          </li>
        </ul>
        <p style={{ marginTop: 14, marginBottom: 0 }}>
          The thing to turn over away from the screen: a network with a few hundred billion
          weights is, from this angle, a curve with a few hundred billion kinks in it. Size did
          not change what a layer does. It changed how many kinks there are to work with.
        </p>
      </Block>
    </>
  )
}
