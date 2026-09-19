import '../styles/s20.css'
import { Block, Eyebrow } from '../components/ui'
import { Check } from '../components/Check'
import { T } from '../components/Term'
import { Patches } from './20-Patches'
import { Flatten } from './20-Flatten'

export function Section20() {
  return (
    <>
      <p className="lede">
        Everything so far has been text. This section takes a picture and turns it into the same
        kind of thing: a sequence of vectors that the machine reads exactly like it reads tokens.
        Nothing about the four boxes from section 1 changes. Only what goes in changes.
      </p>

      <Eyebrow>Cut the picture into squares</Eyebrow>
      <p>
        A token started as a piece of text. For a picture, a token starts as a small square of
        pixels. The picture below is drawn in code, not loaded from a file, so it can genuinely
        be cut apart and its pixel values read off.
      </p>
      <p>
        The picture is 224 by 224 pixels. Drag the slider to change how big each square is, and
        watch the token count change with it.
      </p>

      <Patches />

      <Block>
        <p style={{ marginBottom: 0 }}>
          At 16 by 16 pixels, 224 &divide; 16 = 14 squares fit across the picture, and 14 &times;
          14 = 196 squares in total. Each square becomes one <T k="patch">patch</T>. Make the
          squares smaller and there are more of them; make them bigger and there are fewer. The
          picture itself never changes size, only how finely it is cut.
        </p>
      </Block>

      <Eyebrow>One square becomes one row of numbers</Eyebrow>
      <p>
        A square of pixels is not yet a token. It first has to become a vector, the same kind of
        object a word became in section 3. This happens in two steps: lay the pixels out in one
        long row, then shrink that row down to the width every other token in the model already
        uses.
      </p>
      <p>Pick a square below and watch both steps happen to it.</p>

      <Flatten />

      <Check
        question="A 224 pixel image is cut into 16 by 16 pixel patches. How many tokens does the image become?"
        options={[
          {
            label: '14',
            tone: 'wrong',
            response: (
              <p>
                14 is how many squares fit across one row of the picture, 224 &divide; 16. The
                picture is two-dimensional, so the same number of squares fit down each column
                too. The total is 14 &times; 14 = 196.
              </p>
            ),
          },
          {
            label: '196',
            tone: 'right',
            response: (
              <p>
                224 &divide; 16 = 14 squares across, 14 &times; 14 = 196 squares total, and each
                square is one token. This is the exact number the figure above showed at that
                setting.
              </p>
            ),
          },
          {
            label: '224',
            tone: 'wrong',
            response: (
              <p>
                224 is the width of the picture in pixels, not the number of tokens. A token here
                is a 16 by 16 square, not a single pixel, so the pixel count and the token count
                are different numbers.
              </p>
            ),
          },
        ]}
      />

      <Check
        question="The patch size is halved, from 16 pixels to 8 pixels. What happens to the token count?"
        options={[
          {
            label: 'It doubles',
            tone: 'wrong',
            response: (
              <p>
                It would double if only one side of the picture were cut more finely. Halving the
                patch size doubles the number of squares across <em>and</em> doubles the number of
                squares down, so the total goes up by a factor of four: from 196 to 784.
              </p>
            ),
          },
          {
            label: 'It quadruples',
            tone: 'right',
            response: (
              <p>
                Yes. Halving the patch size doubles the squares across and doubles the squares
                down, and those two doublings multiply: 196 tokens becomes 784. This is the same
                shape of cost the reader saw in section 7, where widening a window was paid for
                somewhere else. Here, finer patches are paid for in sequence length.
              </p>
            ),
          },
          {
            label: 'It stays the same',
            tone: 'wrong',
            response: (
              <p>
                The picture has a fixed size, 224 by 224 pixels, but the number of squares it is
                cut into depends on how big each square is. Smaller squares means more of them:
                196 tokens at 16 pixels becomes 784 tokens at 8 pixels.
              </p>
            ),
          },
        ]}
      />

      <Eyebrow>Take away</Eyebrow>
      <Block tone="takeaway">
        <p>You can now explain two things you could not before:</p>
        <ul style={{ margin: 0, paddingLeft: 20 }}>
          <li>Why a picture has a token count at all, and where that number comes from.</li>
          <li>Why a finer grid of patches costs more, in the same way a longer sentence does.</li>
        </ul>
        <p style={{ marginTop: 14, marginBottom: 0 }}>
          The thing to turn over away from the screen: a picture becomes a sequence of vectors,
          and after that step, the machine cannot tell the difference between a square of pixels
          and a word. Sections 21 and 22 are about how a picture and a sentence end up meaning
          something to the same machine, not just being readable by it.
        </p>
      </Block>
    </>
  )
}
