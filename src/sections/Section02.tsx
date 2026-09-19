import '../styles/s02.css'
import { Block, Eyebrow } from '../components/ui'
import { Check } from '../components/Check'
import { T } from '../components/Term'
import { VocabTradeoff } from './02-VocabTradeoff'
import { MergeBuilder, applyMerges, STEPS, MARK } from './02-MergeBuilder'
import { Unhappiness } from './02-Unhappiness'

const PIECES = applyMerges('unhappiness', STEPS.length)
const PIECE_LIST = PIECES.map((p) => `"${p.replace(MARK, MARK + ' ')}"`).join(', ')

export function Section02() {
  return (
    <>
      <p className="lede">
        Box 1 from the map in the last section splits your text into pieces before the model
        touches it. This section shows what those pieces are, how the list of possible pieces is
        built, and what the model actually receives once the splitting is done.
      </p>

      <Eyebrow>Text becomes a list of integers</Eyebrow>
      <p>
        The model has a fixed list of pieces it knows, called its <T k="vocabulary">vocabulary</T>
        . Every piece on the list has a position number. When your text arrives, it is cut into
        pieces from that list, and each piece is replaced by its position number. That list of
        numbers, called <T k="tokenid">token IDs</T>, is the only thing that reaches the model.
      </p>
      <p>
        For example, if position 464 on some model's list holds the piece "cat", then the word
        "cat" is replaced by the number 464 before anything else happens. The model never sees
        the letters c, a, t again.
      </p>

      <Eyebrow>Why not one piece per word</Eyebrow>
      <p>
        The simplest vocabulary is a list of whole words. Pick a size, fill it with the most
        common words in English, and give every other word no position on the list at all. The
        slider below changes the size of that list, from 100 words to 100,000 words.
      </p>
      <p>Drag it and watch the sentence below.</p>

      <VocabTradeoff />

      <Block>
        <p style={{ marginBottom: 0 }}>
          Neither end works. At 100 words, ordinary words like "carefully" have no position on
          the list. At 100,000 words, a word like "hydroponic" still has none, because there is
          always a rarer word past whatever cutoff is chosen. A list of whole words is a dead
          end no matter how large it is made.
        </p>
      </Block>

      <Eyebrow>A list built from pieces smaller than words</Eyebrow>
      <p>
        Instead of a list of whole words, build the list out of pieces smaller than a word,
        starting from single letters. Here is the method, worked by hand on two words first:
      </p>
      <p>
        Take "the" and "that". Both contain the letters t and h next to each other. Count how
        many times the pair (t, h) sits next to each other anywhere in a body of text: say it
        happens 9 times. Count every other adjacent pair the same way: (h, e) happens 4 times,
        (t, a) happens 2 times, and so on. The pair (t, h) occurs the most, so it is merged into
        one new piece, "th". Every "t" next to an "h" in the text becomes that one piece instead
        of two letters.
      </p>
      <p>
        That is one merge. Do it again on the result, and again, counting fresh each time. This
        is called <T k="bpe">BPE</T>. The figure below runs this on a corpus of 8 short
        sentences, and re-counts from scratch after every single merge. Nothing below is
        typed in by hand; it is computed live from the sentences.
      </p>

      <MergeBuilder />

      <Block>
        <p style={{ marginBottom: 0 }}>
          "th", "the" and "ing" appear early because they are common letter sequences, not
          because anything in the code knows they are meaningful. The count is blind to spelling
          rules or grammar. It only ever asks: which pair of pieces sits next to each other most
          often right now.
        </p>
      </Block>

      <Eyebrow>A piece built from other words, on a word it never saw</Eyebrow>
      <p>
        "unhappiness" is not one of the 8 training sentences. Here is what the finished list of
        pieces does with it anyway, using every merge learned above.
      </p>

      <Unhappiness />

      <p>
        The first piece starts with a small raised dot. That dot stands for the space that came
        before the word in the original text. It is not dropped: it is folded into the token that
        follows it, so one token carries both the space and the letters.
      </p>

      <Check
        question={`How many tokens is "unhappiness", given the vocabulary shown above?`}
        options={[
          {
            label: '1',
            tone: 'wrong',
            response: (
              <p>
                One token would mean "unhappiness" sits in the list as a single whole-word piece.
                It does not: the training sentences never contained this exact word, so it has no
                single position of its own. It is built from {PIECES.length} smaller pieces
                instead: {PIECE_LIST}.
              </p>
            ),
          },
          {
            label: '3',
            tone: 'right',
            response: (
              <p>
                Yes. The tokenizer above splits "unhappiness" into {PIECES.length} pieces:{' '}
                {PIECE_LIST}. None of those three exact pieces is "unhappiness" itself; each one
                was learned from some other word in the training sentences.
              </p>
            ),
          },
          {
            label: '11',
            tone: 'wrong',
            response: (
              <p>
                Eleven is one token per letter, which is what "unhappiness" would look like
                before any merges ran at all. By the time all the merges above have run, letters
                that occur next to each other often have already been folded into
                {' '}
                {PIECES.length} larger pieces: {PIECE_LIST}.
              </p>
            ),
          },
        ]}
      />

      <Check
        question="Why does the leading space become part of the following token, instead of being dropped?"
        options={[
          {
            label: 'It marks where a new word starts',
            tone: 'right',
            response: (
              <p>
                Right. If the space were simply dropped, "the cat" and "thecat" would tokenize
                into the same pieces, and the information that a new word started there would be
                gone. Folding the space into the next token keeps that information, without
                spending an entire separate token on the space character.
              </p>
            ),
          },
          {
            label: 'It saves tokens',
            tone: 'partly',
            response: (
              <p>
                True as a side effect: folding the space into the next piece means the text needs
                one fewer token than giving every space its own token. But that is not the main
                reason. The main reason is that dropping the space would lose the information
                that a new word started there.
              </p>
            ),
          },
          {
            label: 'It is an accident of how the counting happens to run',
            tone: 'wrong',
            response: (
              <p>
                No. Attaching the space to the piece that follows it is a deliberate choice made
                before counting even starts: every word is read as the space plus its letters,
                so the space is never in a position to be dropped or counted on its own.
              </p>
            ),
          },
        ]}
      />

      <Eyebrow>Take away</Eyebrow>
      <Block tone="takeaway">
        <p>You can now explain two things you could not before:</p>
        <ul style={{ margin: 0, paddingLeft: 20 }}>
          <li>Why the model's vocabulary is a fixed list of pieces, not a list of words.</li>
          <li>
            Why a long or unusual word can turn into several tokens, built from pieces the
            training text made common, not from any rule about spelling.
          </li>
        </ul>
        <p style={{ marginTop: 14, marginBottom: 0 }}>
          The thing to turn over away from the screen: the model never touches a letter. Anything
          it appears to know about spelling, it inferred from which pieces of text kept showing up
          next to each other.
        </p>
      </Block>
    </>
  )
}
