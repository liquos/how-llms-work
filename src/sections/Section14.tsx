import '../styles/s14.css'
import { Block, Eyebrow } from '../components/ui'
import { Check } from '../components/Check'
import { T } from '../components/Term'
import { QKVFigure } from './14-QKV'
import { DotScoresFigure } from './14-DotScores'
import { AttendFigure } from './14-Attend'
import { MatrixFigure } from './14-Matrix'

export function Section14() {
  return (
    <>
      <p className="lede">
        This is the operation the 2017 paper kept and everything else was built around. It has
        four steps. You already know all four of them from earlier sections, which is the reason
        this section can be done in one sitting.
      </p>

      <Block label="the four steps, before any detail">
        <ol style={{ margin: 0, paddingLeft: 20 }}>
          <li>Each token turns its vector into three new vectors: a query, a key and a value.</li>
          <li>One token&rsquo;s query is compared against every token&rsquo;s key, with a dot product.</li>
          <li>Those scores are turned into weights that add up to 100 percent.</li>
          <li>The output is the weighted blend of every token&rsquo;s value vector.</li>
        </ol>
      </Block>

      <p>
        Step 2 is a dot product, step 3 is the softmax from section 6, and step 4 is the weighted
        blend from section 12. Step 1 is three matrix multiplications. There is no new mathematics
        in any of it.
      </p>

      <Block label="the example used throughout">
        <p style={{ marginBottom: 0 }}>
          Four tokens: <span className="mono">the cat chased it</span>. The vectors here are two
          numbers wide so that every step can be drawn. Real ones are a few hundred to a few
          thousand numbers wide, and the operations are identical.
        </p>
      </Block>

      <Eyebrow>Step 1: three vectors from one</Eyebrow>
      <p>
        A token arrives holding one vector, the <T k="embedding">embedding</T> from section 3.
        Three matrices are applied to it, producing three new vectors. They are called the query,
        the key and the value.
      </p>
      <p>
        The names describe what they are used for, not what they contain. The query is what this
        token is looking for. The key is what this token offers to anything looking. The value is
        what gets handed over if it is chosen. All three are transforms of the same starting
        vector.
      </p>

      <QKVFigure />

      <Eyebrow>Step 2: compare every query with every key</Eyebrow>
      <p>
        Each token needs a number saying how relevant every other token is to it. That number is
        the dot product of its query with the other token&rsquo;s key.
      </p>
      <p>
        You already know what a dot product measures: how much of one vector lies along another.
        That is exactly what is being used here. A key pointing the same way as the query gives a
        large positive number, a key at right angles gives zero, and a key pointing the other way
        gives a negative number.
      </p>
      <p>
        The result is divided by the square root of the vector width. Without that division, wide
        vectors produce large dot products, which makes the next step behave badly.
      </p>

      <DotScoresFigure />

      <Check
        question="A token's query and another token's key point in almost the same direction. What does that mean has happened?"
        options={[
          {
            label: 'The two tokens are the same word',
            tone: 'wrong',
            response: (
              <p>
                Not necessarily. Query and key come from two different matrices, so a token&rsquo;s
                own query and its own key usually do not line up at all. What alignment means is
                that what the first token is looking for matches what the second token offers.
                Those are two different transforms of two different embeddings.
              </p>
            ),
          },
          {
            label: 'What the first token is looking for matches what the second offers',
            tone: 'right',
            response: (
              <p>
                Yes. And note what that does not say: nothing about the two tokens being similar.
                The query matrix and the key matrix are different, so the operation can learn to
                match a pronoun to a noun, or a verb to its subject, rather than matching things
                to copies of themselves.
              </p>
            ),
          },
          {
            label: 'The two vectors have the same length',
            tone: 'partly',
            response: (
              <p>
                Length does affect the score, so you are right that it is part of the number. But
                the direction is the part that carries the meaning here. Two vectors of the same
                length pointing at right angles score zero.
              </p>
            ),
          },
        ]}
      />

      <Eyebrow>Steps 3 and 4: weights, then the blend</Eyebrow>
      <p>
        The scores are raw numbers, positive and negative. Softmax turns them into weights that
        are all positive and add up to 100 percent. The output for this token is then each value
        vector multiplied by its weight, all added together.
      </p>
      <p>
        With two vectors and two weights that add to one, this is a linear interpolation. With
        four, it is the same operation with four terms: the output lands somewhere inside the
        shape formed by the four value vectors, pulled towards whichever ones have the most
        weight.
      </p>

      <AttendFigure />

      <Check
        question="All four weights come out equal, at 25 percent each. Where does the output vector end up?"
        options={[
          {
            label: 'At zero, because the weights cancel out',
            tone: 'wrong',
            response: (
              <p>
                The weights are all positive and add to one, so nothing cancels. Equal weights
                give the plain average of the four value vectors, which is somewhere in the middle
                of them. You can produce this by setting the score scaling to 0 in the figure
                above.
              </p>
            ),
          },
          {
            label: 'At the average of the four value vectors',
            tone: 'right',
            response: (
              <p>
                Correct, and it is worth noticing what that means: the token has collected a bit
                of everything and nothing in particular. Attention that spreads evenly is
                attention that has not decided anything. The score scaling slider at 0 produces
                exactly this.
              </p>
            ),
          },
          {
            label: 'On whichever value vector is longest',
            tone: 'partly',
            response: (
              <p>
                A longer value vector does pull the average further, so it has more influence on
                where the output lands. But the output is still the average of all four, not a
                choice of one. Set the scaling to 0 in the figure to see it.
              </p>
            ),
          },
        ]}
      />

      <Eyebrow>Every token does this at once</Eyebrow>
      <p>
        Everything above described one token asking. Every token does the same thing, and no
        token&rsquo;s result is needed by any other token&rsquo;s result. Laid out as a grid, one
        row per asking token, the whole thing is one matrix of weights.
      </p>

      <MatrixFigure />

      <Block label="the same thing as an equation">
        <p className="mono eqn">Attention(Q, K, V) = softmax( Q K&#7488; / &radic;d ) V</p>
        <p style={{ marginBottom: 0 }}>
          Q, K and V hold every token&rsquo;s query, key and value as rows. Q K&#7488; is every
          query against every key in one multiplication, giving the grid above. Dividing by
          &radic;d is the scaling from step 2, softmax is applied to each row, and multiplying by
          V is the weighted blend. This is the whole operation, and it is the equation the paper
          is known for.
        </p>
      </Block>

      <Eyebrow>What this fixed</Eyebrow>
      <Block>
        <p>
          In section 12 attention was an addition to a recurrent network, used only between the
          decoder and the encoder. Here it is used between a sequence and itself, which is why it
          is called self-attention, and the recurrent loop is gone entirely.
        </p>
        <p style={{ marginBottom: 0 }}>
          The distance between two tokens no longer matters. Token 1 and token 400 are one dot
          product apart, exactly like token 1 and token 2. The decay from section 9 cannot happen
          here, because there is nothing being passed along a chain.
        </p>
      </Block>

      <Eyebrow>Take away</Eyebrow>
      <Block tone="takeaway">
        <p>You can now explain:</p>
        <ul style={{ margin: 0, paddingLeft: 20 }}>
          <li>What a query, a key and a value are, and where each comes from.</li>
          <li>Why the comparison is a dot product and what a high score means.</li>
          <li>Why the output is a blend rather than a choice.</li>
          <li>Why every row of the grid can be worked out at the same time.</li>
        </ul>
        <p style={{ marginTop: 14, marginBottom: 0 }}>
          The thing to turn over away from the screen: there is no step in this operation where a
          token decides anything. Three matrices, some dot products, and a weighted average. The
          behaviour that looks like relevance is entirely a consequence of what those three
          matrices were trained to be.
        </p>
      </Block>
    </>
  )
}
