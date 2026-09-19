import { Block, Eyebrow } from '../components/ui'
import { Check } from '../components/Check'
import { T } from '../components/Term'
import { PipelineMap } from '../components/PipelineMap'
import { GenerationLoop } from './GenerationLoop'
import { TrainingDial } from './TrainingDial'
import { FactoryDiagram } from './FactoryDiagram'

export function Section01() {
  return (
    <>
      <p className="lede">
        This section gives you the map that the rest of the course fills in, and separates two
        things that are easy to confuse: the process that builds the model, and the process that
        runs it.
      </p>

      <Eyebrow>The whole machine, in four boxes</Eyebrow>
      <p>
        This is an <T k="llm">LLM</T> from the outside in. Four stages. Everything else in this
        course is a detail inside one of these boxes.
      </p>

      <PipelineMap />

      <Block>
        <p style={{ marginBottom: 0 }}>
          Box 3 is the one worth knowing about. It is where <T k="attention">attention</T> lives,
          and it is the part the 2017 paper changed. It stays unexplained until part 3, because
          it is built out of pieces you have not made yet. Boxes 1, 2 and 4 are covered in the
          next few sections.
        </p>
      </Block>

      <Eyebrow>The machine produces one token, not an answer</Eyebrow>
      <p>
        This is the first thing that usually surprises people. A model does not write a reply. It
        scores every possible next <T k="token">token</T>, one is picked, it is added to the end
        of the text, and then the entire machine runs again from the beginning on the longer
        text.
      </p>
      <p>Drag the slider to run it.</p>

      <GenerationLoop />

      <Block label="Two consequences">
        <p>
          Every token costs one full pass through all four boxes. A long reply is not harder for
          the model than a short one, it is just more passes. This is why replies appear at a
          steady pace rather than all at once.
        </p>
        <p style={{ marginBottom: 0 }}>
          The model also re-reads the entire conversation on every single pass. It has no memory
          between passes. The only thing carried forward is the text itself.
        </p>
      </Block>

      <Check
        question="A reply about 200 words long is roughly 260 tokens. How many times does the machine run to produce it?"
        options={[
          {
            label: 'Once',
            tone: 'wrong',
            response: (
              <p>
                Once per token, so about 260 times. A single pass produces exactly one token. The
                slider above ran the machine six times to produce six tokens.
              </p>
            ),
          },
          {
            label: 'About 260 times',
            tone: 'right',
            response: (
              <p>
                Yes, one pass per token. And each of those passes reads the whole conversation so
                far, which gets longer every time, so the later tokens cost slightly more work
                than the earlier ones.
              </p>
            ),
          },
          {
            label: 'Once per sentence',
            tone: 'wrong',
            response: (
              <p>
                The machine has no notion of a sentence boundary in this loop. It runs once per
                token, so about 260 times. A full stop is simply one of the tokens it can pick.
              </p>
            ),
          },
        ]}
      />

      <Eyebrow>Where the numbers come from</Eyebrow>
      <p>
        Box 3 contains something like 100 billion numbers: the same <T k="weight">weights</T> and
        biases you already know from a small network. The map above never says where they come
        from, because none of those four boxes sets them.
      </p>
      <p>There are two separate processes, and they happen at completely different times.</p>

      <Block label="Training">
        <p style={{ marginBottom: 0 }}>
          Runs once, for weeks or months, on thousands of chips, before anyone uses the model.
          Its output is the 100 billion numbers. See <T k="training">training</T>.
        </p>
      </Block>

      <Block label="Inference">
        <p style={{ marginBottom: 0 }}>
          Runs in a fraction of a second, every time you press enter. The 100 billion numbers are
          fixed and read-only. This is the map at the top of this section. See{' '}
          <T k="inference">inference</T>.
        </p>
      </Block>

      <Block tone="quiet">
        <p style={{ marginBottom: 0 }}>
          A way to hold the difference: training is building a factory, and inference is running
          it. While the factory is running, the machines and the belts do not move. Only the
          material on the belts moves. Training is the only time anything about the factory
          itself changes, and it is finished before you ever see it.
        </p>
      </Block>

      <p>Switch between the two below.</p>

      <FactoryDiagram />

      <p>
        Drag through training below. The eight numbers are parameters being set. The line
        underneath is what the model produces when asked to continue the same sentence.
      </p>

      <TrainingDial />

      <Eyebrow>Training is three stages, not one</Eyebrow>
      <p>They run in order, and they are very different sizes.</p>

      <Block label="1. Pretraining, about 99% of the work">
        <p style={{ marginBottom: 0 }}>
          Take real text. Hide the next word. Ask the model to predict it. Compare against the
          word that was actually there, and adjust. Repeat for trillions of words. Nobody writes
          any answers, because the text already contains them. See{' '}
          <T k="pretraining">pretraining</T>.
        </p>
      </Block>

      <Block label="2. Supervised fine-tuning, small">
        <p style={{ marginBottom: 0 }}>
          After pretraining the model continues text rather than answering questions. It is then
          shown written examples of a helpful assistant answering, so that it responds in that
          form. See <T k="sft">SFT</T>.
        </p>
      </Block>

      <Block label="3. Reinforcement learning from human feedback, smallest">
        <p style={{ marginBottom: 0 }}>
          People are shown two answers and pick the better one. The model is adjusted towards the
          kind of answer that gets picked. See <T k="rlhf">RLHF</T>.
        </p>
      </Block>

      <Block label="Why the free grader in stage 1 matters">
        <p style={{ marginBottom: 0 }}>
          Older systems learned from data that people had labelled by hand, which is slow and
          expensive, so the datasets stayed small and the models stayed small with them. Hiding
          the next word in ordinary text removes that limit: every document ever written is
          already a training example, with the answer included. Data stopped being the
          constraint, and compute became the constraint instead.
        </p>
      </Block>

      <Check
        question="You correct the model during a conversation, and it apologises and fixes its answer. Has it learned anything?"
        options={[
          {
            label: 'Yes, it adjusted itself',
            tone: 'wrong',
            response: (
              <p>
                No parameter changed. Adjusting parameters is training, and training finished
                before you arrived. What actually happened is that your correction is now part of
                the text, and every following pass re-reads that text. It behaves differently
                because its input changed, not because it changed.
              </p>
            ),
          },
          {
            label: 'No, but the correction is now part of the text it re-reads',
            tone: 'right',
            response: (
              <p>
                Exactly right, and the second half is the part people miss. Nothing inside the
                model moved. The correction sits in the conversation, and since every pass reads
                the whole conversation from the start, it affects everything that follows. Close
                the conversation and it is gone.
              </p>
            ),
          },
          {
            label: 'Only for this conversation, then it forgets',
            tone: 'partly',
            response: (
              <p>
                The conclusion is right, and the reason is worth making precise. It is not that
                the model learns temporarily and then forgets. Nothing is stored at all. The
                correction is simply text, and the model re-reads the text on every pass. When
                the text goes, the effect goes with it.
              </p>
            ),
          },
        ]}
      />

      <Eyebrow>Take away</Eyebrow>
      <Block tone="takeaway">
        <p>You can now explain three things you could not before:</p>
        <ul style={{ margin: 0, paddingLeft: 20 }}>
          <li>Why a reply arrives one piece at a time.</li>
          <li>Why the model re-reads the whole conversation constantly.</li>
          <li>Why it cannot learn from you.</li>
        </ul>
        <p style={{ marginTop: 14, marginBottom: 0 }}>
          The thing to turn over away from the screen: the model is a fixed object. All of the
          apparent thinking happens in a machine where nothing moves.
        </p>
      </Block>
    </>
  )
}
