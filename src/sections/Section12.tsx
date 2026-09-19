import '../styles/s12.css'
import { Block, Eyebrow } from '../components/ui'
import { Check } from '../components/Check'
import { T } from '../components/Term'
import { Alignment } from './12-Alignment'
import { Blend } from './12-Blend'

export function Section12() {
  return (
    <>
      <p className="lede">
        Section 11 ended on the fixed-size bottleneck: the decoder only ever sees one vector, no
        matter how long the source sentence was. This section covers the fix that was actually
        shipped for it, in 2014 and 2015, before the 2017 paper existed.
      </p>

      <Eyebrow>Give the decoder every encoder state, not just the last one</Eyebrow>
      <p>
        The encoder already computes a state at every single word while it reads the source
        sentence, not just at the end. The old design threw all of those away except the last
        one. The fix, the first form of <T k="attention">attention</T>, keeps every one of them,
        and while producing each output word, the decoder takes a weighted sum of all of them,
        using different weights each time.
      </p>
      <p>
        The weight for a given source word comes from comparing the decoder's current state
        against that source word's stored vector. A larger dot product between the two, meaning
        more of one vector's length lies along the direction of the other, its projection, gives
        that source word a larger weight. The scores are then turned into weights that sum to 1,
        the same way section 6 turned raw scores into probabilities.
      </p>

      <Alignment />

      <Check
        question="What problem from section 11 does giving the decoder every encoder state remove?"
        options={[
          {
            label: 'The fixed-size bottleneck, since the decoder is no longer limited to one vector',
            tone: 'right',
            response: (
              <p>
                Correct. The decoder can now pull weight toward whichever source words matter for
                the word it is producing, instead of relying on everything having survived
                compression into one fixed-size vector.
              </p>
            ),
          },
          {
            label: 'Training speed, since fewer steps are needed',
            tone: 'wrong',
            response: (
              <p>
                This change does not touch training speed. The recurrent network still runs one
                step at a time on both sides. Training speed is the subject of section 13, and it
                is a separate problem from the bottleneck.
              </p>
            ),
          },
          {
            label: 'Vocabulary size, since more words can now be represented',
            tone: 'wrong',
            response: (
              <p>
                Vocabulary size is unrelated to this change. What changes is how much of the
                source sentence the decoder can draw on for each output word, not how many
                distinct tokens the model knows.
              </p>
            ),
          },
        ]}
      />

      <Eyebrow>The weighted sum is a linear interpolation</Eyebrow>
      <p>
        With two vectors and two weights that sum to 1, this weighted sum is exactly a{' '}
        linear interpolation: at weight (1, 0) the result is the first vector, at (0, 1) it is
        the second, and at (0.5, 0.5) it is the midpoint between them. That is the lerp you
        already use for blending positions or colours. With four source vectors and four weights
        that sum to 1, it is the same operation extended: a weighted average pulled toward
        whichever vectors have the larger weight.
      </p>

      <Blend />

      <Check
        question="The weight is 0.8 on source word A and 0.2 on source word B, and 0 on the rest. Where does the output vector land?"
        options={[
          {
            label: 'At the midpoint between A and B',
            tone: 'wrong',
            response: (
              <p>
                The midpoint is where equal weights, 0.5 and 0.5, would land. At 0.8 and 0.2 the
                output sits much closer to A: 20% of the way from A toward B, not halfway.
              </p>
            ),
          },
          {
            label: '20% of the way from A toward B, close to A',
            tone: 'right',
            response: (
              <p>
                Correct. output = 0.8 × A + 0.2 × B. That is a linear interpolation with 20% of
                the distance covered toward B, so the result sits close to A and only slightly
                pulled toward B.
              </p>
            ),
          },
          {
            label: 'On top of B, since the smaller weight still has some effect',
            tone: 'wrong',
            response: (
              <p>
                A weight of 0.2 pulls the output slightly toward B, not onto it. The larger
                weight, 0.8 on A, dominates the position, so the output lands close to A.
              </p>
            ),
          },
        ]}
      />

      <Eyebrow>Take away</Eyebrow>
      <Block tone="takeaway">
        <p>You can now explain two things you could not before:</p>
        <ul style={{ margin: 0, paddingLeft: 20 }}>
          <li>What the first form of attention did: a weighted sum, freshly computed for every
            output word, over every encoder state instead of just the last one.</li>
          <li>Why that weighted sum is the same linear interpolation you already know, extended
            from two vectors to as many as there are source words.</li>
        </ul>
        <p style={{ marginTop: 14, marginBottom: 0 }}>
          The thing to turn over away from the screen: attention was invented as a patch bolted
          onto the recurrent network, to fix the one fixed-size vector between encoder and
          decoder. The recurrent loop stayed. The paper this course is named after, in 2017, made
          a much larger claim: that the patch was the only part worth keeping, and the recurrent
          loop it was bolted onto could be removed entirely.
        </p>
      </Block>
    </>
  )
}
