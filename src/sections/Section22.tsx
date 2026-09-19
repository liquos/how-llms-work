import '../styles/s22.css'
import { Block, Eyebrow } from '../components/ui'
import { Check } from '../components/Check'
import { T } from '../components/Term'
import { Wiring } from './22-Wiring'
import { CrossAttend } from './22-CrossAttend'

export function Section22() {
  return (
    <>
      <p className="lede">
        Section 20 turned a picture into a sequence of vectors. Section 21 explained how those
        vectors are trained to mean the same thing as matching words. This section is about the
        plumbing: how those vectors physically get into the language model you built in part 3.
      </p>

      <Eyebrow>Put them in the same sequence</Eyebrow>
      <p>
        The most common arrangement changes nothing about the stack of blocks. It changes what is
        handed to it. The image's patch vectors, from a <T k="visionencoder">vision encoder</T>,
        are placed at the front of the sequence, and the text tokens follow. The whole thing is
        one sequence of vectors, all the same width, going into one stack of blocks.
      </p>

      <Wiring />

      <Block>
        <p style={{ marginBottom: 0 }}>
          Attention, from section 14, is a dot product between a query and a key, followed by a
          weighted sum of values. None of that arithmetic asks where a vector came from. A block
          built to attend over text tokens attends over image tokens exactly the same way,
          because by the time they reach it, they are the same kind of object: a vector of the
          model's width, sitting at a position in the sequence.
        </p>
      </Block>

      <Eyebrow>The alternative: a separate attention step</Eyebrow>
      <p>
        There is a second arrangement, used when there are a lot of image tokens and putting them
        all in one sequence gets expensive. Instead of joining the sequence, the image vectors
        are kept separate, and the text tokens attend to them through an added attention step,
        called <T k="crossattention">cross-attention</T>, at each block. The text sequence stays
        short; only it grows with the length of the reply, not with the size of the picture.
      </p>

      <CrossAttend />

      <Check
        question="In the one-sequence arrangement, where do the image vectors go?"
        options={[
          {
            label: 'Into a separate model that runs before the language model',
            tone: 'wrong',
            response: (
              <p>
                The vision encoder does run first, to produce the vectors, but its output is not
                handed to a separate model. It is placed directly into the same sequence the
                language model reads.
              </p>
            ),
          },
          {
            label: "At the front of the language model's own input sequence",
            tone: 'right',
            response: (
              <p>
                Yes. The image's patch vectors sit at the start of the sequence, the text tokens
                follow, and the stack of blocks reads the whole thing as one sequence.
              </p>
            ),
          },
          {
            label: 'Nowhere; the language model only sees a text description of the image',
            tone: 'wrong',
            response: (
              <p>
                That would throw away everything sections 20 and 21 built. The point of turning
                the image into vectors is that the model reads the vectors directly, not a
                written description of them.
              </p>
            ),
          },
        ]}
      />

      <Check
        question="Does the language model need new machinery to read the image vectors, in the one-sequence arrangement?"
        options={[
          {
            label: 'Yes, attention has to be rewritten for image tokens',
            tone: 'wrong',
            response: (
              <p>
                Attention is unchanged. It performs the same dot products and the same weighted
                sum regardless of what a vector started as. Nothing about it is aware of images.
              </p>
            ),
          },
          {
            label: 'No, the image vectors are already the same shape as text tokens',
            tone: 'right',
            response: (
              <p>
                Correct. By the time a patch vector reaches the stack of blocks, it is the same
                width and the same kind of object as a token that started as a word. The language
                model was not modified; the vision encoder and the projection were built to
                produce something it already knew how to read.
              </p>
            ),
          },
          {
            label: 'No, because the image tokens are ignored by the language model',
            tone: 'wrong',
            response: (
              <p>
                They are not ignored. They take part in every attention step exactly like any
                other token. The reason no new machinery is needed is that they arrive already
                looking like tokens, not that the model skips over them.
              </p>
            ),
          },
        ]}
      />

      <Eyebrow>Take away</Eyebrow>
      <Block tone="takeaway">
        <p>You can now explain two things you could not before:</p>
        <ul style={{ margin: 0, paddingLeft: 20 }}>
          <li>How image vectors physically reach the language model: placed in its input sequence.</li>
          <li>Why the language model itself needs no changes to read them.</li>
        </ul>
        <p style={{ marginTop: 14, marginBottom: 0 }}>
          The thing to turn over away from the screen: the language model was not modified.
          Something else, the vision encoder and the small projection after it, was trained to
          speak its input format. Section 23 applies the same idea to sound.
        </p>
      </Block>
    </>
  )
}
