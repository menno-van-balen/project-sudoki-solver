// import { puzzlesAndSolutions } from './puzzle-strings.js';
const textArea = document.getElementById("text-input");
const inputCells = document.querySelectorAll(".sudoku-input");
const errorDiv = document.getElementById("error-msg");
const solveButton = document.getElementById("solve-button");
const validValue = /^[0-9.]*$/;

/* Callback functions */
const validateInput = (string) => {
  errorDiv.innerText = "";
  if (!validValue.test(string)) {
    errorDiv.innerText = "Error: invalid character";
    return false;
  }
};

const gridToString = (grid) => {
  let solutionString = "";
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      solutionString += grid[i][j];
    }
  }
  return solutionString;
};

/* EventHandler functions */
const textAreaHandler = () => {
  if (validateInput(textArea.value) === false) return;

  let textAreaValues = textArea.value.split("");
  textAreaValues.forEach((val, i) => {
    inputCells[i].value = val;
  });
};

const inputCellHandler = () => {
  let valueString = "";
  inputCells.forEach((cell) => {
    valueString += cell.value;
  });

  if (validateInput(valueString) === false) return;

  textArea.value = valueString;
};

const solveButtonHandler = () => {
  errorDiv.innerText = "";

  let textAreaValues = textArea.value.split("");
  let currentGrid = generateGrid(textAreaValues);
  let solution = solveSudoku(currentGrid);

  if (solution === false) {
    errorDiv.innerText = "No solution for this grid!";
  } else {
    textArea.value = gridToString(solution);
    textAreaHandler();
  }
};

/* Sudoku solving logic */
//values is an array or string with 81 valid values (the textArea), returns a gid
function generateGrid(values) {
  // grid with array for each row
  let grid = [[], [], [], [], [], [], [], [], []];
  let gridRow = -1;
  for (let i = 0; i < values.length; i++) {
    if (i % 9 === 0) {
      gridRow += 1;
    }
    grid[gridRow].push(values[i]);
  }
  return grid;
}

// check if a value is possible
// returns true if possible else false
const checkPossible = (grid, row, col, value) => {
  // check row
  for (let i = 0; i < 9; i++) {
    if (grid[row][i] == value) {
      return false;
    }
  }

  // check column
  for (let j = 0; j < 9; j++) {
    if (grid[j][col] == value) {
      return false;
    }
  }

  // check boxes:
  // box[x, y] are the uppper left coörditanes of the box, x and y can only be 0, 3, or 6
  let xBox = Math.floor(row / 3) * 3;
  let yBox = Math.floor(col / 3) * 3;

  // x is the index looping through the box-column
  // yy is the index looping through the box-row
  for (let x = xBox; x < xBox + 3; x++) {
    for (let y = yBox; y < yBox + 3; y++) {
      if (grid[x][y] == value) {
        return false;
      }
    }
  }

  return true;
};

// recursive function...
// note: this function returns only the first possible grid and not all possibilities
function solveSudoku(grid, row = 0, col = 0) {
  // console.log(`Solving: row ${row + 1}, column ${col + 1}`);

  // jump to next row if column (y) is 9
  // note: function solve assignes the value of rows internaly
  if (col === 9) {
    col = 0;
    row++;
  }

  // base case:
  // if row is 9 loop through grid complete, just return it
  if (row === 9) {
    return grid;
  }

  // if in possition already is a number: start over on next possition
  if (grid[row][col] != ".") {
    return solveSudoku(grid, row, col + 1);
  }

  // the solving starts here...!
  // start with value = 1, and check position with checkPossible()
  for (let value = 1; value <= 9; value++) {
    value = value.toString();
    // console.log(`testing with value: ${value}`);

    // function checkPossible will start with first free possition,
    // the first possible value will be assigned to this first possible possition on the grid
    if (checkPossible(grid, row, col, value)) {
      grid[row][col] = value;
      // if assigned call solveSudoku again with next collumn position
      // else reset the position and continue the for loop
      if (solveSudoku(grid, row, col + 1) !== false) {
        // console.log("!!!");
        return grid;
        // return solveSudoku(grid, row, col + 1);
      } else {
        grid[row][col] = ".";
      }
    }
  }

  // if no solution found:
  // console.log("no solution for this grid");
  return false;
}

/* Eventlisteners */
document.addEventListener("DOMContentLoaded", () => {
  // Load a simple puzzle into the text area
  textArea.value =
    "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
  // "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
  textAreaHandler();
});

textArea.oninput = textAreaHandler;

inputCells.forEach((cell) => {
  cell.oninput = inputCellHandler;
});

solveButton.onclick = solveButtonHandler;

/* 
  Export your functions for testing in Node.
  Note: The `try` block is to prevent errors on
  the client side
*/
try {
  module.exports = {};
} catch (e) {}
