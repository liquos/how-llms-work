import '../styles/s19.css'
import { Block, Eyebrow } from '../components/ui'
import { Check } from '../components/Check'
import { T } from '../components/Term'
import { ScalingLaw } from './19-ScalingLaw'
import { Emergence } from './19-Emergence'
import { Timeline } from './19-Timeline'

export function Section19() {
  return (
    <>
      <p className="lede">
        Section 13 stated the claim this course is built around: the 2017 paper's main effect was
        not a smarter machine, it was a machine that could be trained in parallel, so training
        could be scaled up. This section is about what happened once people did that.
      </p>

      <Eyebrow>A predictable return on more compute</Eyebrow>
      <p>
        Take a fixed design, the block from section 17 stacked as in section 18, and change three
        things: how many parameters it has, how many tokens it is trained on, and therefore how
        much <T k="flop">computation</T> the training run costs. Plot the loss the model reaches
        against that computation, using a scale where each step is a power of ten rather than a
        fixed amount. Across several orders of magnitude, the result is close to a straight line.
      </p>
      <p>
        This regularity is called a <T k="scalinglaw">scaling law</T>. Drag either slider below.
        The line itself does not move; only the dot's position on it does, because the line is one
        formula evaluated at whatever compute the two sliders produce.
      </p>

      <ScalingLaw />

      <Block label="why a straight line on this kind of plot matters">
        <p style={{ marginBottom: 0 }}>
          Before this was known, spending ten times the money on a training run was a guess. If
          loss falls in a straight line on log axes, the improvement from ten times the compute can
          be read off the line before the run happens. That turned scaling into an engineering
          decision with a predictable return, rather than a research gamble with an unknown one.
        </p>
      </Block>

      <Check
        question="What did the 2017 paper mainly change: the quality of the model's output, or what kind of model could be built at all?"
        options={[
          {
            label: 'The quality of the output, directly',
            tone: 'wrong',
            response: (
              <p>
                The paper's own translation results were better than what came before, but only by
                the kind of margin a good new idea usually produces. Section 0 covered this: on its
                own, that result would have been a footnote. The change that mattered was structural.
              </p>
            ),
          },
          {
            label: 'What kind of model could be built, by removing a limit on training',
            tone: 'right',
            response: (
              <p>
                Right. Section 13 covered why: a recurrent network processes a sentence one token
                at a time and cannot be split across chips, so making it bigger meant training it
                for longer, not training it faster. Removing that loop meant training could be
                spread across thousands of chips at once. Every model in the timeline after 2017 is
                a consequence of that limit being gone, not of a new idea about language.
              </p>
            ),
          },
          {
            label: 'Both equally, in a single step',
            tone: 'partly',
            response: (
              <p>
                Quality did improve, so this is not wrong, but the two effects were not the same
                size. The quality gain was modest and immediate. The removal of the training
                bottleneck was the larger effect, and it did not pay off immediately: it paid off
                over the following six years, as the scaling law above was tested at greater and
                greater compute.
              </p>
            ),
          },
        ]}
      />

      <Eyebrow>Abilities that were not designed in</Eyebrow>
      <p>
        A model trained only to predict the next token is never directly shown examples of, say,
        three-digit addition or translating between two specific languages. On some tasks like
        these, small models score near random guessing and stay there as they grow, then rise
        sharply once they pass a certain size. This is called an <T k="emergentability">emergent
        ability</T>: nobody designed the addition, it showed up as a side effect of scale.
      </p>
      <p>
        Whether every reported case of this is a genuine change in what the model can do is
        disputed. Part of the argument is about how the task is scored, and the figure below shows
        the mathematical shape of that argument directly.
      </p>

      <Emergence />

      <Block tone="quiet">
        <p style={{ marginBottom: 0 }}>
          This does not settle the question either way. It shows one mechanism that can produce a
          sharp-looking curve out of a smooth underlying one, when the scoring is strict. Some
          researchers hold that other reported jumps survive even under scoring that does not have
          this all-or-nothing property, and would still need a different explanation. This is an
          active, unresolved argument, not a solved problem with a known answer.
        </p>
      </Block>

      <Eyebrow>The same history, now with a way back in</Eyebrow>
      <p>
        Section 0 opened with this timeline as a preview. Every stop before 2017 is a different
        design. Every stop after 2017 uses the same design from section 13 through 18, changed only
        in size and training data. Each stop below links to the section that covers it.
      </p>

      <Timeline />

      <Check
        question="From 2018 to 2023, what changed the most about these models: the design, the size, or the training data?"
        options={[
          {
            label: 'The design',
            tone: 'wrong',
            response: (
              <p>
                The design is the part that barely changed. A 2023 model is built from the same
                block, assembled the same way, as GPT-2 in 2018. The block from sections 14 to 17
                did not need to be reinvented.
              </p>
            ),
          },
          {
            label: 'The size, mainly',
            tone: 'partly',
            response: (
              <p>
                Size is a large part of it, and section 18's figure showed how directly more blocks
                turn into more parameters. But size on its own is only half of what changed. The
                amount of training data grew by a similar, separate factor over the same years, and
                the scaling law above needs both to move together to reach a lower loss.
              </p>
            ),
          },
          {
            label: 'The size and the training data together',
            tone: 'right',
            response: (
              <p>
                Right. Both grew by a factor of roughly a thousand or more between GPT-2 and the
                largest models trained by 2023, while the block itself stayed the same shape. That
                is exactly what the scaling law above predicts is worth doing: more parameters and
                more tokens together, not a cleverer arrangement of parts.
              </p>
            ),
          },
        ]}
      />

      <Eyebrow>Take away</Eyebrow>
      <Block tone="takeaway">
        <p>You can now explain the argument this whole course has been building toward:</p>
        <ul style={{ margin: 0, paddingLeft: 20 }}>
          <li>
            The 2017 paper did not introduce a cleverer machine. It removed a specific constraint:
            a recurrent network had to process a sentence one token at a time, so it could not be
            split across chips.
          </li>
          <li>
            Once that constraint was gone, training at far larger scale became an engineering
            choice with a predictable return, which the scaling law makes visible directly.
          </li>
          <li>
            Everything after 2017 in the timeline, larger models, more training data, abilities
            nobody designed in, is a consequence of people spending the compute that removing the
            constraint made possible. None of it required a new idea about language.
          </li>
        </ul>
        <p style={{ marginTop: 14, marginBottom: 0 }}>
          The thing to turn over away from the screen: the paper's title says attention is all you
          need. What it actually removed was a loop.
        </p>
      </Block>
    </>
  )
}
