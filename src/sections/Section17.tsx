import '../styles/s17.css'
import { Block, Eyebrow } from '../components/ui'
import { Check } from '../components/Check'
import { T } from '../components/Term'
import { BlockFigure } from './17-Block'
import { ResidualFigure } from './17-Residual'
import { NormFigure } from './17-Norm'

export function Section17() {
  return (
    <>
      <p className="lede">
        Everything in this section is a part you have already built. Nothing new is introduced
        except the order they go in and two small steps that hold the arrangement together. At the
        end of it, the whole thing becomes one named component, and section 18 stacks it.
      </p>

      <Eyebrow>The parts, and where each came from</Eyebrow>
      <Block>
        <ul style={{ margin: 0, paddingLeft: 20 }}>
          <li>
            <T k="selfattention">Self-attention</T>, from section 14. The only step where tokens
            see each other.
          </li>
          <li>
            A small network with <T k="relu">ReLU</T>, from section 4. Run separately on every
            token.
          </li>
          <li>Adding the input back, which is new here.</li>
          <li>Normalising, which is also new here.</li>
        </ul>
      </Block>

      <p>
        The order is: attention, add, normalise, network, add, normalise. A vector goes in at the
        top and a vector of the same width comes out at the bottom. That is the entire block.
      </p>

      <BlockFigure />

      <Check
        question="The per-token network inside the block sees how many tokens at once?"
        options={[
          {
            label: 'All of them',
            tone: 'wrong',
            response: (
              <p>
                Attention is the only step where tokens meet. The network runs on each token on
                its own, with the same weights, and it cannot tell how many other tokens exist.
                Walk the slider to the network step and switch tokens: the vectors are unrelated
                because each one was processed alone.
              </p>
            ),
          },
          {
            label: 'One',
            tone: 'right',
            response: (
              <p>
                Correct, and that division is the whole design. Attention moves information
                between tokens. The network then processes each token separately. Every transformer
                block alternates those two things, and nothing else in the block mixes tokens
                together.
              </p>
            ),
          },
          {
            label: 'The current token and the one before it',
            tone: 'partly',
            response: (
              <p>
                You are right that there is a restriction, and right that it involves earlier
                tokens, but that restriction belongs to attention, not to the network. Attention
                can be limited to earlier tokens, as in section 14. The network sees exactly one
                token and has no access to any other.
              </p>
            ),
          },
        ]}
      />

      <Eyebrow>Adding the input back</Eyebrow>
      <p>
        After attention, its output is not used on its own. It is added to the vector that went
        in. The same happens after the network.
      </p>
      <p>
        The effect is that a block cannot wipe out what it was given. It can only adjust it. That
        matters because these blocks are stacked about a hundred deep.
      </p>

      <ResidualFigure />

      <Check
        question="What does adding the input back change about what a block does?"
        options={[
          {
            label: 'It makes the block edit the vector rather than replace it',
            tone: 'right',
            response: (
              <p>
                Yes. The default behaviour of a block becomes leaving the vector alone, and any
                change it makes is a departure from that. Stacking a hundred replacements loses
                the original completely, as the figure above shows. Stacking a hundred edits does
                not.
              </p>
            ),
          },
          {
            label: 'It doubles the size of the vector',
            tone: 'wrong',
            response: (
              <p>
                Addition is component by component, so the width does not change. Eight numbers
                plus eight numbers is eight numbers. The width stays the same through the whole
                stack, which is what lets the same block be repeated.
              </p>
            ),
          },
          {
            label: 'It makes training faster',
            tone: 'partly',
            response: (
              <p>
                It does help training, and that was part of why it was introduced. But the reason
                is the one above: the block adjusts rather than replaces, so a signal can travel
                through many blocks without being destroyed, in both directions.
              </p>
            ),
          },
        ]}
      />

      <Eyebrow>Normalising</Eyebrow>
      <p>
        The second small step rescales the eight numbers so that their spread is the same after
        every stage. Without it, a hundred stacked blocks give a hundred chances for the numbers
        to drift steadily larger or smaller.
      </p>

      <NormFigure />

      <Eyebrow>That is the block</Eyebrow>
      <Block tone="accent">
        <p style={{ marginBottom: 0 }}>
          From here on, all of that is one component with a name. When section 18 draws ninety-six
          of them stacked, each one contains everything on this page. You can open this section
          again from any diagram that shows a block.
        </p>
      </Block>

      <Block label="what is left out">
        <p style={{ marginBottom: 0 }}>
          Two details are simplified here. Real blocks use several attention heads at once, which
          section 15 covered, and the per-token network usually widens to four times the vector
          width before coming back down. Neither changes the shape of the block.
        </p>
      </Block>

      <Eyebrow>Take away</Eyebrow>
      <Block tone="takeaway">
        <p>You can now explain:</p>
        <ul style={{ margin: 0, paddingLeft: 20 }}>
          <li>The six steps of a transformer block, in order.</li>
          <li>Which step moves information between tokens, and which does not.</li>
          <li>Why the input is added back after each of the two main steps.</li>
          <li>Why the vector width is the same going in and coming out.</li>
        </ul>
        <p style={{ marginTop: 14, marginBottom: 0 }}>
          The thing to turn over away from the screen: the block alternates between letting tokens
          talk to each other and letting each token think on its own. Stacking that pair about a
          hundred times is, as far as anyone can currently tell, most of what a language model is.
        </p>
      </Block>
    </>
  )
}
