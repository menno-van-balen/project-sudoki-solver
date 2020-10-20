const textArea = document.getElementById("text-input");
const inputCells = document.querySelectorAll(".sudoku-input");
// console.log(inputCells);

// import { puzzlesAndSolutions } from './puzzle-strings.js';

document.addEventListener("DOMContentLoaded", () => {
  // Load a simple puzzle into the text area
  textArea.value =
    "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
  textAreaChanged();
});
const validValue = /^[0-9]|\./;

const textAreaChanged = () => {
  let textAreaValues = textArea.value.split("");
  // console.log(textAreaValues);
  textAreaValues.forEach((val, i) => {
    inputCells[i].value = val;
    // if (val.match(validValue)) {
    // } else {
    //   console.log("invalid value for input[" + i + "]");
    //   inputCells[i].value = ".";
    // }
  });
  console.log("textAreaChanged called");
};

const inputCellChanged = () => {
  // console.log("gridArea changed!");
  let valueString = "";
  inputCells.forEach((cell) => {
    valueString += cell.value;
  });
  console.log("inputCellChanged called");
  textArea.value = valueString;
};

textArea.oninput = textAreaChanged;

inputCells.forEach((cell) => {
  // console.log(cell);
  cell.oninput = inputCellChanged;
});

/* 
  Export your functions for testing in Node.
  Note: The `try` block is to prevent errors on
  the client side
*/
try {
  module.exports = {};
} catch (e) {}
