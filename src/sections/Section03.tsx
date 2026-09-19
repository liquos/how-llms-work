import '../styles/s03.css'
import { Block, Eyebrow } from '../components/ui'
import { Check } from '../components/Check'
import { T } from '../components/Term'
import { LookupTable } from './03-LookupTable'
import { VectorSpace } from './03-VectorSpace'
import { Mixer } from './03-Mixer'

export function Section03() {
  return (
    <>
      <p className="lede">
        Section 2 ended with a list of integers, one per token. This section covers the very
        next step: what happens to one of those integers before the model does any real work on
        it, and what the resulting numbers do and do not mean.
      </p>

      <Eyebrow>A token ID becomes a row of numbers</Eyebrow>
      <p>
        Every position in the vocabulary has a matching row of numbers, called its{' '}
        <T k="embedding">embedding</T>. All of those rows together are the{' '}
        <T k="embeddingtable">embedding table</T>. Turning a token into its embedding is a
        lookup: read off row number 464, say, and that row is what the model works with from
        here on.
      </p>
      <p>Drag the slider below and watch which row lights up.</p>

      <LookupTable />

      <Block>
        <p style={{ marginBottom: 0 }}>
          Nothing was calculated in that figure. The row for "king" does not come from the
          letters k, i, n, g in any way; it is simply the row that was sitting at that position.
          During training, every number in every row is adjusted many times. During inference, a
          token ID only ever reads a row — it never changes one.
        </p>
      </Block>

      <Eyebrow>Where a row sits means nothing by itself</Eyebrow>
      <p>
        Take two rows as points: <span className="mono">(2, 1)</span> and{' '}
        <span className="mono">(5, 1)</span>. Subtract one from the other and you get{' '}
        <span className="mono">(3, 0)</span>: a direction, three steps right and none up. That
        subtraction is the whole idea. A single row's position carries no meaning on its own. The
        difference between two rows is a direction, and directions are where meaning turns up.
      </p>
      <p>
        Below is a 2D space with 16 words placed in it by hand, so a real effect can be shown
        without hundreds of numbers. Pick two words to define a direction, then copy that same
        direction starting from a third word.
      </p>

      <VectorSpace />

      <Block>
        <p style={{ marginBottom: 0 }}>
          The direction from "man" to "woman" and the direction from "king" to "queen" point the
          same way, because these 16 points were placed by hand to show it. A trained model was
          never told to do this; directions like it turn up in real embedding tables on their
          own, as a side effect of training on ordinary text. In a real table, with hundreds of
          dimensions instead of 2, the match is close rather than exact.
        </p>
      </Block>

      <Eyebrow>A direction moves several numbers at once</Eyebrow>
      <p>
        The lookup table earlier had 4 numbers per row, not 2. Take the direction from "man" to
        "woman" in that 4-number version, and slide from one to the other.
      </p>

      <Mixer />

      <Check
        question={'Somewhere inside the model, does it store the word "king"?'}
        options={[
          {
            label: 'The letters k, i, n, g',
            tone: 'wrong',
            response: (
              <p>
                No. The letters are used once, outside the model, to decide which row of the
                embedding table belongs to which token ID. After that, the model itself only ever
                reads a row of numbers. It never touches the letters again.
              </p>
            ),
          },
          {
            label: 'A vector',
            tone: 'right',
            response: (
              <p>
                Right. The model's own parameters hold one row of numbers per token ID, set
                during training. That row is what "king" is, as far as the model is concerned.
                There is no letter k, i, n or g stored anywhere inside it.
              </p>
            ),
          },
          {
            label: 'Both',
            tone: 'partly',
            response: (
              <p>
                Partly. The letters exist somewhere in the system — the tokenizer's vocabulary
                list uses them to assign "king" its token ID in the first place. But inside the
                model's own parameters, only the vector is stored. The letters have already done
                their job by the time the model runs.
              </p>
            ),
          },
        ]}
      />

      <Check
        question="Moving along one direction changed all four numbers in the row, by different amounts each. What does that say about the four positions in the row?"
        options={[
          {
            label: 'No single position carries a meaning on its own',
            tone: 'right',
            response: (
              <p>
                Right. If "gender" lived in one position by itself, only one number would move
                when you slid along that direction. Instead all four moved together, in fixed
                proportions to each other. The meaning is carried by the combination, not by any
                one position.
              </p>
            ),
          },
          {
            label: 'Each position represents one part of the meaning',
            tone: 'wrong',
            response: (
              <p>
                The opposite is closer to true. If each position held one separate piece of
                meaning, moving along a single meaningful direction would change one number and
                leave the rest untouched. Instead every number moved, which means meaning is
                spread across the positions rather than assigned to them one at a time.
              </p>
            ),
          },
          {
            label: 'The row needs more than four positions',
            tone: 'wrong',
            response: (
              <p>
                Real rows do have far more than four positions — hundreds to a few thousand. But
                that is not what this particular observation shows. Adding more positions would
                not change the fact that one direction moves several of them at once; it would
                still be true with 4 positions or with 4,000.
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
            A token's vector is read from a table, not computed from its spelling. Training sets
            the table once; inference only reads it.
          </li>
          <li>
            A single position in that vector means nothing by itself. A direction between two
            vectors can mean something, and nobody chose which directions those would be.
          </li>
        </ul>
        <p style={{ marginTop: 14, marginBottom: 0 }}>
          The thing to turn over away from the screen: the space above has hundreds of real
          dimensions, and only a handful of the directions in it have ever been checked by
          anyone for what they do. Most of that space has never been looked at.
        </p>
      </Block>
    </>
  )
}
