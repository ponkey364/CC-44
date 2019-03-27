/*Copyright(C) 2019  Ponkey364

This program is free software: you can redistribute it and / or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.See the
GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
along with this program.If not, see < https://www.gnu.org/licenses/>.
*/

/**
 * Note that this program cannot solve massively complex puzzles. It'll probably solve the 'easy' one in your daily
 * newspaper of choice, but it won't be doing anything more difficult than that.
 * @requires chalk/chalk
 * @module main
 */

import puzzle from "./puzzles.json";
import chalk from "chalk";

const ogPuzzle: Array<Array<number>> = puzzle.puzzles[0].grid;
let dddGrid: Array<Array<Array<boolean | null>>> = new Array();
let answerGrid: Array<Array<number>> = ogPuzzle;

/**
 *
 * @param {Array<number>} numbers
 */
function generateInitalGrids(numbers: number[]) {
  for (let z of numbers) {
    dddGrid[z - 1] = new Array();
    // answerGrid[z - 1] = new Array();
    for (let y of numbers) {
      // answerGrid[z - 1][y - 1] = 0;
      dddGrid[z - 1][y - 1] = new Array();
      for (let x of numbers) {
        dddGrid[z - 1][y - 1][x - 1] = null;
      }
    }
  }
}

/**
 * Generates our initial map of where we cannot place numbers.
 * If we encounter a number in our OG then we place a false, as we cannot go there
 * @param {Array<Array<any>>} og
 */
function generateInitialMap(og: Array<Array<any>>, numbers: number[]) {
  // Where z is our layer
  for (let layer in numbers) {
    for (let j in og) {
      li: for (let i in og[j]) {
        let x = Number(i);
        if (og[j][x] != 0) {
          dddGrid[layer][j][x] = false;
        } else {
          continue li;
        }
      }
    }
  }

  return;
}

// Check what rows we cannot place the number which is in (layer+1)
function processRowPlacements(og: Array<Array<any>>, layer: number) {
  var i = 0;
  while (i < dddGrid[layer].length) {
    // console.log(i);
    if (answerGrid[i].includes(layer + 1)) {
      for (var x in dddGrid[layer][i]) {
        // console.log(dddGrid[layer][i][x]);
        dddGrid[layer][i][x] = false;
      }
    } else {
      for (var x in dddGrid[layer][i]) {
        if (dddGrid[layer][i][x] == null) {
          dddGrid[layer][i][x] = true;
        }
      }
    }
    i++;
  }
}
/**
 *
 * @param {Array<Array<any>>} og
 * @param {number} layer
 */
function processSudSquares(og: Array<Array<any>>, layer: number) {
  // What we actually need to do here is split the layer's board into a nice set, which represents a square.

  let offSets = [0, 3, 6];

  var i = 0;
  // Each square consumes a 3x3 grid, so from a 0-index, split the big 9x9 into nicer 3x3s
  // We can then iterate over the square and check if any of the numbers are our layer, if
  // they are then we can fill the square with false and then continue in our xo loop
  for (let yoffset of offSets) {
    xo: for (let xoffset of offSets) {
      for (var x = 0; x < 3; x++) {
        for (var y = 0; y < 3; y++) {
          // console.log(og[x + xoffset][y + yoffset]);
          if (og[x + xoffset][y + yoffset] == layer + 1) {
            for (var i = 0; i < 3; i++) {
              for (var j = 0; j < 3; j++) {
                dddGrid[layer][i + xoffset][j + yoffset] = false;
              }
            }
            continue xo;
          }
        }
      }
      i++;
    }
  }
}

function processColumnPlacements(og: Array<Array<any>>, layer: number) {
  var i = 0;
  while (i < dddGrid[layer].length) {
    x: for (var x = 0; x < 9; x++) {
      y: for (var y = 0; y < 9; y++) {
        if (answerGrid[y][x] == layer + 1) {
          for (var k = 0; k < 9; k++) {
            dddGrid[layer][k][x] = false;
          }
          continue x;
        }
      }
    }
    i++;
  }
}

function calculateLayerPlacement(og: Array<Array<any>>, layer: number) {
  processRowPlacements(og, layer);
  processColumnPlacements(og, layer);
  processSudSquares(og, layer);
}

function prettyOutput(
  grid: Array<Array<boolean | null | number>>,
  layer: number
) {
  // Make this look kinda like a Sudoku board, but tell us where we can and cannot place different things.

  // for (let layer in grid) {
  console.log(chalk.red(`\n##### Layer ${layer} (${Number(layer) + 1}) #####`));
  for (let y in grid[layer]) {
    let s = ``;

    if (Number(y) == 3 || Number(y) == 6) {
      s += `------- ------- -------\n`;
    }

    for (let x in grid[y]) {
      if (Number(x) == 3 || Number(x) == 6) {
        s += `| `;
      }
      s += `|${grid[y][x] ? 1 : 0}`;
    }
    s += `|`;
    console.log(s);
  }
  // }
}

function prettyBoard(
  grid: Array<Array<boolean | null | number>>,
  layer: number
) {
  // An actual nice and pretty representation of the sudoku board, which actually shows the numbers.
  console.log(chalk.red(`\n##### Layer ${layer} (${Number(layer) + 1}) #####`));
  for (let y in grid) {
    let s = ``;

    if (Number(y) == 3 || Number(y) == 6) {
      s += `------- ------- -------\n`;
    }

    for (let x in grid[y]) {
      if (Number(x) == 3 || Number(x) == 6) {
        s += `| `;
      }
      s += `|${grid[y][x]}`;
    }
    s += `|`;
    console.log(s);
  }
}

/**
 *  we get a square, defined by its yx in {square} so what we gotta do is find that square.
    Square 0,0 should be the top-left; 2,2 should be bottom-right; 1,1 should be centre; 2,1 should be the bottom-middle
    So what we can do to figure out the bounds is to multiply each term of our co-ordinate by 3.
    0,0 stays as 0,0; 1,1 becomes 3,3; 2,2 becomes 66; 1,2 becomes 3,6

    we need to iterate over the spaces in the square and check them to see if there is only one place that we could
    put a value, if there is one place, then whoop this is going to be fun. Set the value in answer to the layer+1 then
    we can possibly consider settings change then running our same place checks on *all* layers *again*. I never said that
    this was going to be efficient, but it'll work.

 *  @param {number} layer
 *  @param {Array<number>} square in form y,x (Yeah, yeah, I get it. Shhh)
 */
function placeNumbersInSquare(layer: number, square: Array<number>) {
  let offSets = [0, 3, 6];

  var i = 0;
  var changePos = [0, 0];

  let selectedSquare = [3 * square[0], 3 * square[1]];
  /*  we now need to iterate over the spaces in the square and check them to see if there is only one place that we could
      put a value, if there is one place, then whoop this is going to be fun. Set the value in answer to the layer+1 then
      we can possibly consider setting change then running our same place checks on *all* layers *again*. I never said that
      this was going to be efficient, but it'll work. (Unless there are some weird tactics that need to be used)
  */
  for (var x = 0; x < 3; x++) {
    for (var y = 0; y < 3; y++) {
      if (
        dddGrid[layer][y + selectedSquare[0]][x + selectedSquare[1]] === true
      ) {
        changePos = [y + selectedSquare[0], x + selectedSquare[1]];
        // console.log(changePos, selectedSquare, y, x);
        i++;
      }
    }
  }

  // now we can check if we can make a change.
  if (i == 1) {
    // well. this is looking good, we can set this to the correct number in answers
    answerGrid[changePos[0]][changePos[1]] = layer + 1;
    console.log(
      chalk.blue(`Changed (${changePos[0]},${changePos[1]}) to be ${layer + 1}`)
    );
    // YEET, we made a change, I think it's for the better tbh. So we need to alert the rest of the program to this change.
    return true;
  } else {
    // Great fun going now, we can return false from here and continue in the loop.
    return false;
  }
}

function doMoves(layer: number) {
  yl: for (var y = 0; y < 3; y++) {
    xl: for (var x = 0; x < 3; x++) {
      var c = placeNumbersInSquare(layer, [y, x]);
      if (c) {
        // If there was a change made in the previous function, then we know we should go and loop back over *everthing* to
        // recalculate the map. We can worry about everything else later.
        generateInitialMap(answerGrid, [1, 2, 3, 4, 5, 6, 7, 8, 9]);
        // We should also regenerate the layer placement, because there is a *small* chance that the change we just made has
        // allowed us to make another move on the same layer.
        calculateLayerPlacement(answerGrid, layer);
        // Pff, now we continue from where we were.
      } else {
      }
    }
  }

  return false;
}

/**
 * Iterates 9x9 times and checks each number for equality. If they are equal, incr {q}. When done looping, if {q}==81, then
 * we have solved the puzzle.
 * @param {Array<Array<number>>} sln The puzzle's solution
 * @param {Array<Array<number>>} ans The solution we found
 * @summary Checks to see if the solver found the solution
 */
function checkIfSln(
  sln: Array<Array<number>> | string,
  ans: Array<Array<number>>
) {
  var q = 0;
  for (var y = 0; y < 9; y++) {
    for (var x =0; x<9;x++){
      if (answerGrid[y][x] === puzzle.puzzles[0].sln[y][x]){
        q++
      }
    }
  }
  if (q == 81) {
    console.log(chalk.bold.green.italic("Solved"));
  } else {
    console.log(chalk.bold.red.italic("Oh no! We couldn't solve your puzzle"));
  }
}

generateInitalGrids([1, 2, 3, 4, 5, 6, 7, 8, 9]);
generateInitialMap(answerGrid, [1, 2, 3, 4, 5, 6, 7, 8, 9]);
let layer = 0;
do {
  calculateLayerPlacement(answerGrid, layer);
  layer++;
} while (layer < 9);

for (var i = 0; i < dddGrid.length; i++) {
  doMoves(i);
  // prettyOutput(dddGrid[i], i);
}
for (var q = 0; q < 10; q++) {
  console.log(q);
  var still0 = false;
  // Right, we've iterated once, we should check if there are any zeroes left in the grid.
  for (let m in answerGrid) {
    if (answerGrid[m].includes(0)) {
      // LETS GO AND DO THIS AGAIN WHAT FUN!
      still0 = true;
      break;
    }
  }

  if (still0) {
    for (var i = 0; i < dddGrid.length; i++) {
      doMoves(i);
      // prettyOutput(dddGrid[i], i);
    }
  } else {
    break;
  }
}

// for (var i = 0; i < dddGrid.length; i++) {
//   prettyOutput(dddGrid[i], i);
// }

// Let's see the answer
prettyBoard(answerGrid, -1);

// Now
checkIfSln(puzzle.puzzles[0].sln, answerGrid);

/* VSC was doing something real odd where it would wait for the debugger
to disconnect for infinity, so breakpoint when we hit the end of the file
*/
debugger;
