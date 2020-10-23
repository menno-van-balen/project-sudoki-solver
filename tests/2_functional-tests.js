/*
 *
 *
 *       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
 *       -----[Keep the tests in the same order!]-----
 *       (if additional are added, keep them at the very end!)
 */

const chai = require("chai");
const assert = chai.assert;

const jsdom = require("jsdom");
const { JSDOM } = jsdom;
let Solver;

suite("Functional Tests", () => {
  suiteSetup(() => {
    // DOM already mocked -- load sudoku solver then run tests
    Solver = require("../public/sudoku-solver.js");
  });

  suite("Text area and sudoku grid update automatically", () => {
    // Entering a valid number in the text area populates
    // the correct cell in the sudoku grid with that number
    test("Valid number in text area populates correct cell in grid", (done) => {
      const stringInput = document.getElementById("text-input");
      const gridArea = document.querySelectorAll(".sudoku-input");
      const input =
        "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
      stringInput.value = input;

      let string = stringInput.value;
      string = string.split("");
      string.forEach((val, i) => {
        gridArea[i].innerText = val;
      });
      assert.equal(gridArea[2].innerText, "9");
      done();
    });

    // Entering a valid number in the grid automatically updates
    // the puzzle string in the text area
    test("Valid number in grid updates the puzzle string in the text area", (done) => {
      const stringInput = document.getElementById("text-input");
      const gridArea = document.querySelectorAll(".sudoku-input");

      gridArea[0].innerText = "7";
      let string = "";
      gridArea.forEach((cell, i) => {
        string += cell.innerText;
      });
      stringInput.innerText = string;
      assert.equal(stringInput.innerText[0], "7");
      done();
    });
  });

  suite("Clear and solve buttons", () => {
    // Pressing the "Clear" button clears the sudoku
    // grid and the text area
    test("Function clearInput()", (done) => {
      const gridArea = document.querySelectorAll(".sudoku-input");

      let string = "";
      for (let i = 1; i <= 81; i++) {
        string += ".";
      }
      string = string.split("");
      string.forEach((val, i) => {
        gridArea[i].innerText = val;
      });
      assert.equal(gridArea[0].innerText, ".");
      assert.equal(gridArea[2].innerText, ".");
      done();
    });

    // Pressing the "Solve" button solves the puzzle and
    // fills in the grid with the solution
    test("Function showSolution(solve(input))", (done) => {
      const stringInput = document.getElementById("text-input");
      const expectedResult =
        "769235418851496372432178956174569283395842761628713549283657194516924837947381625";
      const grid = Solver.generateGrid(stringInput.innerText);
      const solution = Solver.solveSudoku(grid);
      assert.equal(solution, expectedResult);
      done();
    });
  });
});
