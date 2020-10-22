// import { puzzlesAndSolutions } from './puzzle-strings.js';

const stringInput = document.getElementById("text-input");
const grid = document.querySelectorAll(".sudoku-input");
const errorDiv = document.getElementById("error-msg");
const solveButton = document.getElementById("solve-button");

/* Callback functions */
// validateSudokuString returns true or false
const validateString = (string) => {
  const validValues = /^[1-9.]*$/;

  if (!validValues.test(string)) {
    errorDiv.innerText = "Error: invalid character";
    return false;
  }
  return true;
};

const stringToArray = (string) => {
  return string.split("");
};

const gridToString = (grid) => {
  let string = "";
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      string += grid[i][j];
    }
  }
  return string;
};

const validateLength = (string) => {
  const length = string.length;
  if (length < 81 || length > 81) {
    errorDiv.innerText = "Error: Expected puzzle to be 81 characters long.";
    return false;
  }
  return true;
};

/* EventHandler functions */
const stringInputHandler = () => {
  errorDiv.innerText = "";

  const string = stringInput.value;

  if (!validateLength(string)) return;

  if (!validateString(string)) return;

  stringToArray(string).forEach((val, i) => {
    grid[i].value = val;
  });
};

const gridCellHandler = () => {
  errorDiv.innerText = "";

  let string = "";
  grid.forEach((cell) => {
    string += cell.value;
  });

  if (!validateLength(string)) return;

  if (!validateString(string)) return;

  stringInput.value = string;
};

const solveButtonHandler = () => {
  errorDiv.innerText = "";

  const currentGrid = generateGrid(stringInput.value);
  const solution = solveSudoku(currentGrid);

  if (solution === false) {
    errorDiv.innerText = "No solution for this grid!";
  } else {
    stringInput.value = solution;
    stringInputHandler();
  }
};

/* Sudoku solving logic */
//values is an array or string with 81 valid values (the textArea), returns a gid
function generateGrid(values) {
  // grid with array for each row
  let grid = [[], [], [], [], [], [], [], [], []];
  let row = -1;
  for (let i = 0; i < values.length; i++) {
    if (i % 9 === 0) {
      row += 1;
    }
    grid[row].push(values[i]);
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
  const xBox = Math.floor(col / 3) * 3;
  const yBox = Math.floor(row / 3) * 3;
  const widthBox = xBox + 3;
  const heigthBox = yBox + 3;

  // x is the index looping through the box-column
  // y is the index looping through the box-row
  for (let rowBox = yBox; rowBox < heigthBox; rowBox++) {
    for (let colBox = xBox; colBox < widthBox; colBox++) {
      if (grid[rowBox][colBox] == value) {
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
    return gridToString(grid);
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
        return gridToString(grid);
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
  stringInput.value =
    "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
  // "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
  stringInputHandler();
});

stringInput.oninput = stringInputHandler;

grid.forEach((cell) => {
  cell.oninput = gridCellHandler;
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
