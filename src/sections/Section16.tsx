import '../styles/s16.css'
import { Block, Eyebrow } from '../components/ui'
import { Check } from '../components/Check'
import { T } from '../components/Term'
import { Shuffle16 } from './16-Shuffle'
import { Positions16 } from './16-Positions'

export function Section16() {
  return (
    <>
      <p className="lede">
        The figure below runs a real, small <T k="attention">attention</T> calculation, the same
        kind built in sections 14 and 15, on a five-word sentence. Try shuffling the words before
        reading further.
      </p>

      <Shuffle16 />

      <Eyebrow>Why the outputs did not change</Eyebrow>
      <p>
        With position information off, a token's output is a weighted sum of the value vectors of
        the other tokens, and those weights come from dot products between vectors. Nothing in
        that calculation reads where in the sentence a token sits. It only reads which tokens are
        present and what their vectors are.
      </p>
      <p>
        A recurrent network could never do this. Section 8 built the loop: token 3 is only
        processed after token 2, and the order is baked into the calculation itself. Attention
        has no loop, so it has no built-in notion of order at all. Reordering the input does not
        change the set of tokens attention sees, so the output for a given token does not change
        either.
      </p>

      <Block label="What this means for a full sentence">
        <p style={{ marginBottom: 0 }}>
          "dog chased cat" and "cat chased dog" contain the same three tokens. Without position
          information, attention would compute the same set of outputs for both, because it has
          no way to tell which word came first. The two sentences mean opposite things, so this
          has to be fixed before attention is useful for language.
        </p>
      </Block>

      <Check
        question={
          'With no position information, does attention treat "dog bites man" differently from ' +
          '"man bites dog"?'
        }
        options={[
          {
            label: 'Yes, the words appear in a different order',
            tone: 'wrong',
            response: (
              <p>
                Order is exactly what attention cannot see without position information. Both
                sentences contain the same three token vectors: dog, bites, man. Attention reads
                which vectors are present and computes dot products between them, and neither of
                those depends on which position a vector arrived in. The demonstration above shows
                this directly: shuffling changed nothing until position was switched on.
              </p>
            ),
          },
          {
            label: 'No, attention sees the same three vectors either way and order carries no information on its own',
            tone: 'right',
            response: (
              <p>
                Correct. "dog", "bites" and "man" are the same three tokens in both sentences, only
                rearranged. Every output in the figure above stayed identical across every
                arrangement, with position off, because attention only reads which tokens are
                present, not the order they came in.
              </p>
            ),
          },
          {
            label: 'Only the output for "bites" would differ, since it is the verb',
            tone: 'partly',
            response: (
              <p>
                "bites" is not special here. With position off, every token's output depends only
                on the set of value vectors present, so all three outputs, dog, bites and man,
                stay the same across both sentences, not just the verb's.
              </p>
            ),
          },
        ]}
      />

      <Eyebrow>Putting position into the vector</Eyebrow>
      <p>
        The fix is to add a vector that encodes position directly into each token's vector,
        before attention runs. Position 0 gets one fixed vector added to it, position 1 gets a
        different one, and so on, the same way for every sentence. After that addition, two
        tokens with the same word but different positions start out as different vectors, so
        their queries, keys and values differ too.
      </p>
      <p>
        The 2017 paper builds these position vectors out of sine and cosine waves of different
        frequencies, one pair of waves per two components of the vector. Nearby positions end up
        pointing in similar directions, and distant positions end up pointing in less similar
        directions, which is exactly the property a useful notion of position needs.
      </p>

      <Positions16 />

      <Check
        question="Why add a position vector to the token vector, rather than just pass the position as one extra number, like 0, 1, 2, 3?"
        options={[
          {
            label: 'A single number does not have a magnitude that fits alongside the rest of the vector, and it only takes part in the calculation through one component instead of every dot product',
            tone: 'right',
            response: (
              <p>
                Right. A position vector is added directly onto the token vector, component by
                component, so it shifts every later query, key and value, and it takes part in
                every dot product computed from that vector, the same way the word content does. A
                single tacked-on number, like position 4000 in a long document, would also be a far
                larger number than the rest of the vector's components and would swamp them.
              </p>
            ),
          },
          {
            label: 'A single number would be easier to compute, so there is no real reason to avoid it',
            tone: 'wrong',
            response: (
              <p>
                A single number would be simpler to compute, but it is not usable in the same way.
                Everything downstream (queries, keys, values, dot products) operates on full
                vectors, component by component. A vector the same width as the token vector can be
                added directly into that machinery; a single extra number cannot without being
                given special handling nothing else in the model gets.
              </p>
            ),
          },
          {
            label: 'A single number would let position grow without bound, and the model needs a fixed vocabulary of positions',
            tone: 'partly',
            response: (
              <p>
                Unbounded growth is a real problem with a raw index, but it is not the main reason.
                Even a position number that stayed small would still be one number added or
                appended to a whole vector, and that number would only ever influence one part of
                the vector's downstream calculations. A full position vector influences all of it,
                the same way the word content does.
              </p>
            ),
          },
        ]}
      />

      <Eyebrow>Take away</Eyebrow>
      <Block tone="takeaway">
        <p>You can now explain a limitation of attention that section 14 left out on purpose:</p>
        <ul style={{ margin: 0, paddingLeft: 20 }}>
          <li>
            Processing every token at once, instead of one at a time in order, means the
            calculation has no built-in notion of order.
          </li>
          <li>
            A token's attention output depends on which other tokens are present, not on the order
            they arrive in, which the shuffle figure above showed directly.
          </li>
          <li>
            Order is put back by adding a position vector to each token's vector before anything
            else runs, so every later step is already aware of it.
          </li>
        </ul>
        <p style={{ marginTop: 14, marginBottom: 0 }}>
          The thing to turn over away from the screen: position is not a separate mechanism bolted
          onto attention. It is just more numbers added into the same vector, before the first
          matrix multiplication. Nothing downstream needed to be changed to make room for it.
        </p>
      </Block>
    </>
  )
}
