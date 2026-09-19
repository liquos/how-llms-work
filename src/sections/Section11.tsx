import '../styles/s11.css'
import { Block, Eyebrow } from '../components/ui'
import { Check } from '../components/Check'
import { T } from '../components/Term'
import { Bottleneck } from './11-Bottleneck'
import { Quality } from './11-Quality'

export function Section11() {
  return (
    <>
      <p className="lede">
        Sections 8 to 10 built a recurrent network with gates that can hold a value across many
        steps. This section looks at a task that pushed that design as far as it could go before
        it broke: machine translation. The gap it exposes is what section 12 fixes.
      </p>

      <Eyebrow>Two recurrent networks, joined by one vector</Eyebrow>
      <p>
        A translation system from this period is two recurrent networks stacked end to end. The{' '}
        <T k="encoder">encoder</T> reads the input sentence one word at a time, in the source
        language, updating its state at every word exactly as in section 8. When it reaches the
        last word, its final state is handed to the <T k="decoder">decoder</T>, a second recurrent
        network that produces the output sentence one word at a time, in the target language. The
        whole arrangement is called <T k="seq2seq">sequence to sequence</T>.
      </p>
      <p>
        The part to notice: the decoder never sees the input sentence. It only ever sees that one
        final vector from the encoder. Everything about the source sentence that matters for the
        translation has to be packed into it.
      </p>

      <Bottleneck />

      <Block>
        <p style={{ marginBottom: 0 }}>
          The vector size is a design choice made before training starts, for example 512
          numbers, and it does not change afterward. A 2-word sentence and a 50-word sentence are
          both compressed into the same 512 numbers. There is no mechanism that grows the vector
          for a longer sentence.
        </p>
      </Block>

      <Check
        question="A 5-word sentence and a 50-word sentence are both translated by the same trained network. What size is each one's vector?"
        options={[
          {
            label: 'The 50-word sentence gets a larger vector',
            tone: 'wrong',
            response: (
              <p>
                The vector size is fixed when the network is built and trained, not adjusted per
                sentence. Both sentences produce a vector of the same size, for example 512
                numbers either way.
              </p>
            ),
          },
          {
            label: 'Both get a vector of the same size',
            tone: 'right',
            response: (
              <p>
                Correct. The encoder always ends with exactly one vector of the size it was built
                with, regardless of how many words it read to get there. This is the fixed-size
                bottleneck.
              </p>
            ),
          },
          {
            label: 'The 5-word sentence gets a larger vector, since fewer words need summarising',
            tone: 'wrong',
            response: (
              <p>
                Vector size does not depend on sentence length in either direction. Both the
                5-word and the 50-word sentence produce a vector of the same fixed size.
              </p>
            ),
          },
        ]}
      />

      <Eyebrow>What happens as the sentence gets longer</Eyebrow>
      <p>
        The vector cannot grow, so a longer sentence means more information competing for the
        same fixed number of slots. Translation quality measured against sentence length shows
        the result directly.
      </p>

      <Quality />

      <Check
        question="Where does the information from the early part of a long sentence go, once quality starts falling?"
        options={[
          {
            label: 'It is stored elsewhere and the decoder can request it later',
            tone: 'wrong',
            response: (
              <p>
                There is nowhere else for it to be stored. The decoder in this design only ever
                receives the one final vector from the encoder. Nothing about the earlier words is
                kept separately.
              </p>
            ),
          },
          {
            label: 'It is compressed along with everything else, and some of it does not fit',
            tone: 'right',
            response: (
              <p>
                Correct. The encoder keeps folding every new word into the same fixed-size vector.
                As the sentence gets longer, more has to be represented by the same number of
                numbers, and detail from earlier words gets crowded out by what comes later.
              </p>
            ),
          },
          {
            label: 'It is duplicated into the decoder’s own state before being lost',
            tone: 'wrong',
            response: (
              <p>
                The decoder’s state starts from the encoder’s final vector and nothing else. There
                is no duplication step. Whatever did not survive into that one vector is simply
                not available to the decoder.
              </p>
            ),
          },
        ]}
      />

      <Eyebrow>Take away</Eyebrow>
      <Block tone="takeaway">
        <p>You can now explain two things you could not before:</p>
        <ul style={{ margin: 0, paddingLeft: 20 }}>
          <li>Why an encoder-decoder translation system has one vector joining the two halves.</li>
          <li>Why its quality falls off on longer sentences, even though the recurrent networks on
            either side have gates that do not forget.</li>
        </ul>
        <p style={{ marginTop: 14, marginBottom: 0 }}>
          The thing to turn over away from the screen: the design worked, and it had one obvious
          structural fault, a single fixed-size vector standing between everything the encoder
          read and everything the decoder has to produce. The next section is about the patch that
          was added to fix exactly that.
        </p>
      </Block>
    </>
  )
}
