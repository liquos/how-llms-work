# How language models work

An interactive course on language models and transformers, from tokens through to
multimodal models. Twenty-four sections, each meant to be finished in one sitting.

Read it at https://liquos.github.io/how-llms-work/

## What it is

Every figure computes what it shows when the page renders. The byte-pair tokeniser in
section 2 really counts and merges pairs, the gradient descent in section 5 really runs,
the attention in section 14 really multiplies the matrices, and section 17 really runs a
small transformer block. Nothing is a recording of output produced elsewhere.

The vectors are two to eight numbers wide so that every step can be drawn. Real ones are a
few hundred to a few thousand numbers wide, and the operations are the same.

## Running it

```
npm install
npm run dev
```

The build produces static files with no server needed at runtime, and installs as a
progressive web app that works with no internet connection.

```
npm run build
```

## Layout

```
src/sections/SectionNN.tsx    one file per section
src/sections/NN-*.tsx         the interactive figures for that section
src/styles/sNN.css            styles owned by that section
src/course/glossary.sNN.ts    terms that section introduces
src/course/sections.ts        the table of contents
```
