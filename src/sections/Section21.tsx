import '../styles/s21.css'
import { Block, Eyebrow } from '../components/ui'
import { Check } from '../components/Check'
import { T } from '../components/Term'
import { Contrastive } from './21-Contrastive'
import { SharedSpace } from './21-SharedSpace'

export function Section21() {
  return (
    <>
      <p className="lede">
        Section 20 turned a picture into a sequence of vectors. That is enough for a picture to
        be readable. It is not yet enough for a picture and a sentence to mean the same thing to
        the machine. This section is about how a picture's vectors and a caption's vectors are
        made to land near each other.
      </p>

      <Eyebrow>Two separate encoders, trained together</Eyebrow>
      <p>
        There are two networks: one turns a picture into a vector, the other turns a sentence of
        text into a vector. Before training, they have no reason to agree. The picture of a
        circle and the caption "a circle" could come out as two unrelated vectors, pointing in
        unrelated directions.
      </p>
      <p>
        Training fixes this with one rule: for a matching picture and caption, pull their vectors
        together. For every non-matching pair, push them apart. This is called{' '}
        <T k="contrastive">contrastive training</T>, and it is what <T k="clip">CLIP</T>, the
        model that made this approach well known, is trained to do.
      </p>

      <Contrastive />

      <Block>
        <p style={{ marginBottom: 0 }}>
          Nothing here teaches the model what a circle looks like the way a person would explain
          it. The only signal is which picture came with which caption in the training data.
          Every correct pairing pulls two vectors together; every incorrect pairing pushes two
          vectors apart. Repeated over millions of pairs, this is enough for the two encoders to
          agree on a shared arrangement.
        </p>
      </Block>

      <Eyebrow>The result is one shared space</Eyebrow>
      <p>
        After training, both encoders write into the same coordinate space. A word and a picture
        that mean the same thing land close together in it, the same way related words landed
        near each other in section 3. Drag the point below and watch which kind of thing is
        nearest to it.
      </p>

      <SharedSpace />

      <Block tone="quiet">
        <p style={{ marginBottom: 0 }}>
          This figure uses five hand-placed pairs so the idea is visible. A real shared space has
          hundreds of dimensions, and the distance between a real matching pair is small but
          rarely zero. The picture above should be read as approximate, the same caution that
          applied to the word directions in section 3.
        </p>
      </Block>

      <Check
        question="During contrastive training, what does a non-matching image-caption pair get pushed toward?"
        options={[
          {
            label: 'Toward each other',
            tone: 'wrong',
            response: (
              <p>
                That is what happens to a matching pair. A non-matching pair, for example the
                picture of a square with the caption "a heart", is pushed apart: their vectors are
                moved further from each other, not closer.
              </p>
            ),
          },
          {
            label: 'Apart from each other',
            tone: 'right',
            response: (
              <p>
                Correct. Every matching pair is pulled together and every non-matching pair is
                pushed apart, at the same time, on every training step. The diagonal in the
                figure rises while everything off the diagonal falls, for exactly this reason.
              </p>
            ),
          },
          {
            label: 'Toward the origin',
            tone: 'wrong',
            response: (
              <p>
                Training does not aim vectors at a fixed point. It only changes the vectors'
                positions relative to each other: matching pairs closer together, non-matching
                pairs further apart.
              </p>
            ),
          },
        ]}
      />

      <Check
        question="A shared space contains exactly one image vector and one caption vector. What makes them close together?"
        options={[
          {
            label: 'They were seen as a matching pair during training',
            tone: 'right',
            response: (
              <p>
                Yes. Closeness is not measured or asserted afterward, it is the direct result of
                every training step that pulled that specific pair's vectors toward each other.
              </p>
            ),
          },
          {
            label: 'The image and the caption use the same words',
            tone: 'wrong',
            response: (
              <p>
                An image has no words in it. Closeness comes from training on matching pairs, not
                from any text comparison between the picture and the caption.
              </p>
            ),
          },
          {
            label: 'They were placed at the same coordinates by hand',
            tone: 'wrong',
            response: (
              <p>
                Nobody sets these coordinates directly, the same way nobody set the word
                directions in section 3. Training moves the vectors; the resulting positions are
                a side effect, not a design.
              </p>
            ),
          },
        ]}
      />

      <Eyebrow>Take away</Eyebrow>
      <Block tone="takeaway">
        <p>You can now explain two things you could not before:</p>
        <ul style={{ margin: 0, paddingLeft: 20 }}>
          <li>Why a picture and a sentence can be compared at all: they are trained to share one space.</li>
          <li>What contrastive training actually optimises: matching pairs closer, everything else further apart.</li>
        </ul>
        <p style={{ marginTop: 14, marginBottom: 0 }}>
          The thing to turn over away from the screen: a shared space is what lets one machine
          take both kinds of input. Section 22 is about how that shared space gets attached to the
          language model you already built.
        </p>
      </Block>
    </>
  )
}
