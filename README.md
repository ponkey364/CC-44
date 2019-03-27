# Code Challenge 44 - Sudoku Solver

_Want to see more Code Challenge solutions? Click [here](https://bitbucket.org/ponkey364codechallenges/)_

## [Docs](https://ponkey364.github.io/CC-44/index.html)

## Info

This program can solve simple sudoku, like the 'easy' one in your daily newspaper of choice (see the one in `puzzles.json`)

It's not very good at difficult sudoku, if it might require backtracking and/or lots of thought, then this can't solve it. There are better ones on the internet.

## Building and Running

### Requirements

- NodeJS
- Yarn (_NPM will work_)
- Some puzzles to solve

### Building

1. Clone this repository
2. `cd` to your cloned version and run `yarn` (or `npm install`)
3. Run `yarn build` to build the typescript and the JSDoc documentation
4. To run, use `node dist/main.js` or `yarn start` (which also builds)
