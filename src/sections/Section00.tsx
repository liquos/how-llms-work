import { Block, Eyebrow } from '../components/ui'
import { Check } from '../components/Check'
import { T } from '../components/Term'
import { Timeline } from './Timeline'

export function Section00() {
  return (
    <>
      <p className="lede">
        This is the only section with no machinery in it. It sets out what the course answers,
        and roughly when the events happened, so that later sections have somewhere to sit.
        Ten minutes, then you are done.
      </p>

      <Block label="The question this course answers">
        <p style={{ marginBottom: 0 }}>
          In 2017 a paper called <em>Attention Is All You Need</em> described a new arrangement
          of parts for handling text. Within about five years every serious language system had
          switched to it. The question is what that arrangement actually is, what it replaced,
          and why replacing the old approach made such a large difference.
        </p>
      </Block>

      <Block label="What you will be able to explain at the end">
        <ul style={{ margin: 0, paddingLeft: 20 }}>
          <li>What happens between you pressing enter and a reply appearing.</li>
          <li>Where the numbers inside a model come from, and when they stop changing.</li>
          <li>What a <T k="rnn">recurrent network</T> was, and what it could not do.</li>
          <li>What <T k="attention">attention</T> computes, step by step, with real numbers.</li>
          <li>Why the 2017 change made models bigger rather than only better.</li>
          <li>How an image ends up inside a machine built for words.</li>
        </ul>
      </Block>

      <Eyebrow>Sixty years, on one slider</Eyebrow>
      <p>
        Before any of the machinery, it helps to see the shape of the history. Drag the slider.
        Each stop is a different way of getting a machine to produce text, and one example of
        what it could manage.
      </p>

      <Timeline />

      <p>Two things are worth noticing in that list.</p>

      <Block label="1. The machine kept changing, then stopped changing">
        <p style={{ marginBottom: 0 }}>
          Every stop up to 2017 is a different design. After 2017 the design stays the same. The
          difference between GPT-2 and a current model is mostly size and training data, not
          structure. That is unusual, and it is part of why the paper mattered.
        </p>
      </Block>

      <Block label="2. The 2017 change was about speed before it was about quality">
        <p style={{ marginBottom: 0 }}>
          The <T k="transformer">transformer</T> was somewhat better at translation than what
          came before. That alone would have been a normal result. What made it important is
          that it processes every word at the same time, so training can be split across
          thousands of <T k="gpu">graphics chips</T> at once. The older design had to work
          through a sentence one word at a time and could not be split up. Once training could
          be scaled, people scaled it, and the models became capable in ways nobody had
          predicted.
        </p>
      </Block>

      <Check
        question="Based on the timeline, what was the main practical effect of the 2017 change?"
        options={[
          {
            label: 'Translation quality improved dramatically',
            tone: 'partly',
            response: (
              <p>
                Quality did improve, and that is what the paper measured. But the improvement was
                modest, in the range you would expect from a good new idea. If that had been the
                only effect, the paper would be a footnote. The larger effect was that training
                could now be spread across thousands of chips at once.
              </p>
            ),
          },
          {
            label: 'Training could be spread across thousands of chips at once',
            tone: 'right',
            response: (
              <p>
                That is the one. Removing the one-word-at-a-time loop meant the work could be
                split up. Everything after 2017 in that list is a consequence of being able to
                train much larger models on much more text.
              </p>
            ),
          },
          {
            label: 'Machines started representing meaning for the first time',
            tone: 'wrong',
            response: (
              <p>
                Meaning was already being represented before 2017. The 2013 entry in the timeline
                is exactly that: word vectors in which directions correspond to meaning, four
                years earlier. The 2017 change was about how those vectors get combined, and how
                fast the training can run.
              </p>
            ),
          },
        ]}
      />

      <Eyebrow>What you already know</Eyebrow>
      <p>
        The course assumes three things. If any of them are unfamiliar, section 4 covers all of
        them from the start, so it is fine either way.
      </p>

      <Block>
        <ul style={{ margin: 0, paddingLeft: 20 }}>
          <li>
            A <T k="vector">vector</T> is an ordered list of numbers, and you can add and scale
            them.
          </li>
          <li>
            A <T k="neuralnet">neural network</T> multiplies inputs by weights, adds them up,
            adds a bias, and applies a simple bending function.
          </li>
          <li>Without that bending function, stacked layers collapse into a single layer.</li>
        </ul>
      </Block>

      <Eyebrow>How the app works</Eyebrow>

      <Block>
        <p>
          There is no score, no progress bar and nothing locked. Sections are in a useful order,
          but you can open any of them at any time.
        </p>
        <p>
          Any word in this colour is a term that gets explained somewhere. Tap one to see what it
          means, and to jump to the section where it is covered properly. Try it on{' '}
          <T k="token">token</T>.
        </p>
        <p style={{ marginBottom: 0 }}>
          Each section is meant to be finished in one sitting. If you are halfway through one and
          have to stop, it is better to restart the section later than to resume it, because they
          are short and they build up in order.
        </p>
      </Block>

      <Eyebrow>Take away</Eyebrow>
      <Block tone="takeaway">
        <p style={{ marginBottom: 0 }}>
          One thing to carry into the next section: the 2017 paper did not make a smarter
          machine. It made a machine that could be trained on far more text, and the intelligence
          turned up as a side effect of the size. That result surprised the people who did it.
        </p>
      </Block>
    </>
  )
}
