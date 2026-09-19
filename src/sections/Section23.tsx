import '../styles/s23.css'
import { Block, Eyebrow } from '../components/ui'
import { Check } from '../components/Check'
import { T } from '../components/Term'
import { toSection } from '../router'
import { Audio } from './23-Audio'
import { Generate } from './23-Generate'

export function Section23() {
  return (
    <>
      <p className="lede">
        Sections 20 to 22 covered pictures: cut into patches, trained into a shared space with
        text, wired into the language model's input sequence. This section applies the same
        conversion to sound, says a sentence about video, and then covers the one place where
        the direction reverses: producing a picture instead of reading one.
      </p>

      <Eyebrow>Sound becomes a picture, then a picture becomes patches</Eyebrow>
      <p>
        A sound is a list of numbers over time: how far the air pressure moved, sampled many
        thousands of times a second. That list is first converted into a{' '}
        <T k="spectrogram">spectrogram</T>: a grid with time across, frequency up the side, and
        brightness for how much of each frequency is present at each moment. A spectrogram is a
        grid of numbers, which is the same kind of object a picture is, so it is cut into patches
        exactly as section 20 cut the picture.
      </p>

      <Audio />

      <Block>
        <p style={{ marginBottom: 0 }}>
          Video is the same idea applied once more. A video is a sequence of pictures, one per
          frame. Each frame is cut into patches the way section 20 describes, and the patches
          from all the frames are placed into the sequence together. Nothing new is invented for
          video; it reuses the picture conversion, once per frame.
        </p>
      </Block>

      <Check
        question="What does a patch cut from a spectrogram have in common with a patch cut from a photograph?"
        options={[
          {
            label: 'Both are a fixed-size block of numbers, flattened and projected into a vector',
            tone: 'right',
            response: (
              <p>
                Yes. A spectrogram is a grid of numbers, the same kind of object a picture is. A
                patch cut from either one is flattened into a row and projected down to the
                model's vector width, becoming one token, by the exact same steps.
              </p>
            ),
          },
          {
            label: 'Both represent the same physical quantity',
            tone: 'wrong',
            response: (
              <p>
                A spectrogram cell is a frequency amplitude and an image cell is a pixel color;
                these are different quantities. What they share is not what they measure, it is
                that both are grids of numbers that get cut, flattened, and projected the same
                way.
              </p>
            ),
          },
          {
            label: 'Neither one is actually cut into pieces',
            tone: 'wrong',
            response: (
              <p>
                Both are. The figure above cuts the spectrogram into {'4 by 4'} squares the same
                way section 20 cut the picture into squares, and each square becomes one token.
              </p>
            ),
          },
        ]}
      />

      <Eyebrow>Generating a picture instead of reading one</Eyebrow>
      <p>
        Everything so far has been about a model reading an image, audio, or video as input. Some
        models also produce an image as output. There are two different ways to do that, and they
        are not the same architecture.
      </p>

      <Generate />

      <Block tone="quiet">
        <p style={{ marginBottom: 0 }}>
          Predicting image tokens one at a time is the generation loop from section 1, unchanged:
          score every possible next token, pick one, add it, run again. Removing noise step by
          step, called <T k="diffusion">diffusion</T>, is a different architecture, trained
          differently, and it is not covered in the rest of this course. The two approaches are
          often mentioned in the same breath because they both produce images, but nothing about
          how diffusion works is an extension of the token-by-token loop.
        </p>
      </Block>

      <Check
        question="Does generating an image with diffusion use the same loop as generating text?"
        options={[
          {
            label: 'Yes, it predicts one image token at a time, the same as text',
            tone: 'wrong',
            response: (
              <p>
                That describes the other method, predicting image tokens one at a time, which
                does reuse the loop from section 1. Diffusion does not predict one token at a
                time. It starts from a full grid of noise and edits the whole grid at every step.
              </p>
            ),
          },
          {
            label: 'No, diffusion starts from noise and removes it step by step across the whole image at once',
            tone: 'right',
            response: (
              <p>
                Correct. Diffusion is a separate architecture. Instead of producing one token,
                adding it, and running again, it holds a full image and repeatedly asks a model
                what to subtract from all of it at once.
              </p>
            ),
          },
          {
            label: 'No, because diffusion does not use a trained model at all',
            tone: 'partly',
            response: (
              <p>
                Diffusion is not the token loop, so this gets the main point right. But it does
                use a trained model: a network is trained to predict what to remove at each
                denoising step. The difference from text generation is the loop it runs in, not
                whether training is involved.
              </p>
            ),
          },
        ]}
      />

      <Eyebrow>Take away</Eyebrow>
      <Block tone="takeaway">
        <p>
          This is the last section. You can now explain the whole path from the four-box map in
          section 1 to a model that reads pictures, sound, and video, and sometimes generates
          pictures back:
        </p>
        <ul style={{ margin: 0, paddingLeft: 20 }}>
          <li>Text is cut into tokens and looked up as vectors.</li>
          <li>Those vectors pass through a stack of identical blocks built from attention and a per-token network.</li>
          <li>The last vector is turned into a distribution over the vocabulary, and something outside the model samples from it.</li>
          <li>A picture, a sound, or a video frame is cut into fixed patches, flattened, and projected into a vector of the same width, so it enters that same sequence as a token.</li>
          <li>A shared space, built with contrastive training, is what lets those vectors and word vectors mean the same thing to the model.</li>
          <li>Producing an image can reuse the same token-by-token loop, or use a different, separately trained architecture, diffusion, that removes noise from the whole image at once.</li>
        </ul>
        <p style={{ marginTop: 14, marginBottom: 0 }}>
          Every stop on the{' '}
          <button className="term" onClick={() => toSection(0)} type="button">
            timeline from section 0
          </button>{' '}
          now connects to a section that built it. This is the end of the course.
        </p>
      </Block>
    </>
  )
}
