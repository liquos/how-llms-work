import '../styles/s15.css'
import { Block, Eyebrow } from '../components/ui'
import { Check } from '../components/Check'
import { T } from '../components/Term'
import { Heads15 } from './15-Heads'
import { Concat15 } from './15-Concat'

export function Section15() {
  return (
    <>
      <p className="lede">
        Section 14 built one <T k="attention">attention</T> step: one query matrix, one key
        matrix, one value matrix, applied to every token. This section asks what one set of those
        matrices can and cannot do, and what a real model does about it.
      </p>

      <Eyebrow>One projection is one relationship at a time</Eyebrow>
      <p>
        The query matrix is a single learned projection. For a given token, it produces one
        query vector, and that one vector is compared against every key. A single projection can
        be aimed at one kind of relationship between tokens: for example, which token is right
        before this one. It cannot simultaneously point at "which token is right before this one"
        and "which token is the subject of this verb", because those are different comparisons,
        and one query vector only supports one comparison.
      </p>
      <p>
        The fix used in the 2017 design is not to make that one query vector longer. It is to
        run the entire query, key, value, dot product, softmax, weighted sum calculation several
        times in parallel, each with its own separate matrices. Each repetition is called a{' '}
        <T k="head">head</T>.
      </p>

      <Heads15 />

      <Check
        question="Why not simply make one head wider, instead of using several separate heads?"
        options={[
          {
            label: 'A wider head would use too much memory',
            tone: 'wrong',
            response: (
              <p>
                A wider head would use more memory, but that is not why heads exist. Even with
                unlimited memory, one set of query, key and value matrices is still one
                projection: it produces one weighting of the other tokens per row, aimed at one
                kind of relationship. Making the vectors longer gives that one relationship more
                numbers to work with, not a second, independent relationship.
              </p>
            ),
          },
          {
            label: 'One projection can express one kind of relationship; several heads give several independent projections',
            tone: 'right',
            response: (
              <p>
                Yes. The previous-token pattern, the subject pattern and the bracket-matching
                pattern in the figure above are three different weightings of the same sentence.
                One query matrix cannot produce three different weightings from one token vector
                at once. Three separate sets of matrices can, because each set is free to learn
                its own projection.
              </p>
            ),
          },
          {
            label: 'A wider head would be slower to compute',
            tone: 'wrong',
            response: (
              <p>
                Speed is not the reason. Whether the matrices are wide or split into heads, the
                total amount of arithmetic is similar. The reason is what one projection can
                express: one weighting of the sentence per token, not several independent ones.
              </p>
            ),
          },
        ]}
      />

      <Eyebrow>Putting the heads back together</Eyebrow>
      <p>
        Each head produces its own output vector, narrower than the token's full width, since the
        width is split between the heads rather than repeated in full for each one. Those narrower
        vectors are placed end to end, back to the original width, and multiplied by one more
        learned matrix so the heads are mixed together rather than left in separate blocks.
      </p>

      <Concat15 />

      <Check
        question="A real model uses 12 heads on a token vector of width 768. How many separate sets of query, key and value matrices are there?"
        options={[
          {
            label: '1, shared across all heads',
            tone: 'wrong',
            response: (
              <p>
                Sharing one set would defeat the purpose: every head would compute the same
                weighting, since the same matrices produce the same query, key and value vectors
                every time. Each of the 12 heads has its own set, so there are 12.
              </p>
            ),
          },
          {
            label: '3, one for query, one for key, one for value',
            tone: 'wrong',
            response: (
              <p>
                That is the count of matrix kinds inside a single head, not the count of heads.
                Each of the 12 heads has its own query, key and value matrices, separate from the
                other 11 heads'. That makes 12 sets in total, 36 matrices.
              </p>
            ),
          },
          {
            label: '12',
            tone: 'right',
            response: (
              <p>
                Yes, one set per head, each learned independently. 768 divided across 12 heads
                gives each head a width of 64, matching the figure above where the total width was
                split evenly among however many heads were selected.
              </p>
            ),
          },
        ]}
      />

      <Eyebrow>Take away</Eyebrow>
      <Block tone="takeaway">
        <p>You can now explain why a transformer layer has several heads instead of one:</p>
        <ul style={{ margin: 0, paddingLeft: 20 }}>
          <li>
            One set of query, key and value matrices produces one weighting of the sentence per
            token, aimed at one kind of relationship.
          </li>
          <li>
            Several heads run that whole calculation several times in parallel, each with its own
            matrices, so several relationships can be captured at once.
          </li>
          <li>The head outputs are placed end to end and mixed back together by one more matrix.</li>
        </ul>
        <p style={{ marginTop: 14, marginBottom: 0 }}>
          The heads in the figure above were built by hand, so the pattern each one finds is
          obvious. Real heads are not told what to look for. They start from random matrices and
          end up specialising during training, because a head that finds a useful relationship
          reduces the loss more than one that does not. Nobody assigns a head its job in advance.
        </p>
      </Block>
    </>
  )
}
