// --- Day 10: Factory ---
// https://adventofcode.com/2025/day/10

import { getInputByLine, execute } from "../utils";

const part1 = (): number => {
  return parseInput()
    .map(({ lights, buttons }) => getMinPressesForLights(lights, buttons))
    .reduce((sum, current) => sum + current, 0);
};

const part2 = (): number => {
  return parseInput()
    .map(({ buttons, joltages }) => getMinPressesForJoltage(buttons, joltages))
    .reduce((sum, current) => sum + current, 0);
};

const parseInput = (): {
  lights: string;
  buttons: number[][];
  joltages: number[];
}[] => {
  return getInputByLine().map((line) => {
    const parts = line.split(" ");

    const lights = parts[0].slice(1, -1);

    const buttons = parts
      .slice(1, -1)
      .map((part) => part.slice(1, -1).split(",").map(Number));

    const joltages = parts[parts.length - 1]
      .slice(1, -1)
      .split(",")
      .map(Number);

    return { lights, buttons, joltages };
  });
};

const getMinPressesForLights = (targetLights: string, buttons: number[][]) => {
  const visited = new Map<string, number>();
  const initialLights = ".".repeat(targetLights.length);

  const toggleLights = (lights: string, button: number[]): string => {
    const chars = lights.split("");
    for (const i of button) {
      chars[i] = chars[i] === "#" ? "." : "#";
    }

    return chars.join("");
  };

  const queue: string[] = [];
  queue.push(initialLights);

  while (queue.length > 0) {
    const currentLights = queue.shift();
    const currentPresses = visited.get(currentLights) ?? 0;

    for (const button of buttons) {
      const toggled = toggleLights(currentLights, button);

      if (toggled === targetLights) {
        return currentPresses + 1;
      }

      if (visited.has(toggled)) {
        continue;
      }

      visited.set(toggled, currentPresses + 1);
      queue.push(toggled);
    }
  }
};

// This one was too hard for me, so I completely solved it using AI (code & comments).
//
// It is solved using Linear Algebra because the search space is too large for BFS.
// We model the machine as a system of linear equations (Ax = b):
//   • A (Matrix): The wiring connections (which button increments which counter).
//   • x (Vector): The unknown number of times to press each button.
//   • b (Vector): The target joltage values we need to reach.
//
// Algorithm:
// 1. Uses Gaussian Elimination to reduce the matrix to Row Echelon Form.
// 2. Performs a bounded search on free variables to ensure solutions are
//    non-negative integers (since we can't press a button 0.5 or -1 times).
// 3. Minimizes sum(x) to find the optimal solution.
const getMinPressesForJoltage = (
  buttons: number[][],
  joltages: number[]
): number => {
  const numRows = joltages.length;
  const numCols = buttons.length;

  // 0. Pre-calculate strict upper bounds for each button press.
  // A button cannot be pressed more times than the target value of any counter it increments.
  const bounds = new Array(numCols).fill(Infinity);

  for (let c = 0; c < numCols; c++) {
    let isActive = false;

    for (let r = 0; r < numRows; r++) {
      if (buttons[c].includes(r)) {
        isActive = true;

        // Since coefficient is always 1, max presses = target / 1
        const maxForThisRow = Math.floor(joltages[r]);
        if (maxForThisRow < bounds[c]) {
          bounds[c] = maxForThisRow;
        }
      }
    }

    // If button connects to nothing, treat it as having bound 0 (useless)
    if (!isActive) {
      bounds[c] = 0;
    }
  }

  // 1. Build Augmented Matrix [A | b]
  const matrix: number[][] = [];
  for (let r = 0; r < numRows; r++) {
    const row = new Array(numCols + 1).fill(0);
    // Set coefficients (A)
    for (let c = 0; c < numCols; c++) {
      if (buttons[c]?.includes(r)) {
        row[c] = 1;
      }
    }

    // Set target (b)
    row[numCols] = joltages[r];
    matrix.push(row);
  }

  // 2. Gaussian Elimination to Reduced Row Echelon Form (RREF)
  let pivotRow = 0;
  const colToPivotRow = new Int32Array(numCols).fill(-1);

  for (let c = 0; c < numCols && pivotRow < numRows; c++) {
    // Find pivot
    let sel = pivotRow;
    for (let r = pivotRow + 1; r < numRows; r++) {
      if (Math.abs(matrix[r][c]) > Math.abs(matrix[sel][c])) {
        sel = r;
      }
    }

    // Skip if column is all zeros (free variable)
    if (Math.abs(matrix[sel][c]) < 1e-9) {
      continue;
    }

    // Swap rows
    if (sel !== pivotRow) {
      [matrix[pivotRow], matrix[sel]] = [matrix[sel], matrix[pivotRow]];
    }

    // Normalize pivot row
    const div = matrix[pivotRow][c];
    for (let j = c; j <= numCols; j++) {
      matrix[pivotRow][j] /= div;
    }

    // Eliminate column in other rows
    for (let r = 0; r < numRows; r++) {
      if (r !== pivotRow) {
        const factor = matrix[r][c];
        if (Math.abs(factor) > 1e-9) {
          for (let j = c; j <= numCols; j++) {
            matrix[r][j] -= factor * matrix[pivotRow][j];
          }
        }
      }
    }

    colToPivotRow[c] = pivotRow;
    pivotRow++;
  }

  // 3. Check for Inconsistency (0 = non-zero)
  for (let r = pivotRow; r < numRows; r++) {
    if (Math.abs(matrix[r][numCols]) > 1e-4) {
      return 0;
    }
  }

  // 4. Solve for integer variables
  // Identify free variables
  const freeVars: number[] = [];
  for (let c = 0; c < numCols; c++) {
    if (colToPivotRow[c] === -1) {
      freeVars.push(c);
    }
  }

  let minPresses = Infinity;

  // Search through free variable space to find integer solutions
  const search = (idx: number, currentSol: number[], currentSum: number) => {
    // Pruning
    if (currentSum >= minPresses) {
      return;
    }

    // All free variables assigned? Calculate pivot variables
    if (idx === freeVars.length) {
      let valid = true;
      let total = currentSum;

      // Solve backwards for pivot variables
      for (let c = numCols - 1; c >= 0; c--) {
        if (colToPivotRow[c] !== -1) {
          const r = colToPivotRow[c];
          let val = matrix[r][numCols];

          // x_pivot = Target - Sum(Coeff * x_known)
          for (let j = c + 1; j < numCols; j++) {
            val -= matrix[r][j] * currentSol[j];
          }

          // Integer check (using epsilon for float precision)
          if (val < -1e-4 || Math.abs(val - Math.round(val)) > 1e-4) {
            valid = false;
            break;
          }

          const rounded = Math.round(val);

          // Bounds check
          if (rounded > bounds[c]) {
            valid = false;
            break;
          }

          currentSol[c] = rounded;
          total += rounded;

          if (total >= minPresses) {
            valid = false;
            break;
          }
        }
      }

      if (valid) {
        minPresses = total;
      }

      return;
    }

    const fv = freeVars[idx];
    const limit = bounds[fv]; // Use calculated bound

    for (let v = 0; v <= limit; v++) {
      currentSol[fv] = v;
      search(idx + 1, currentSol, currentSum + v);
    }
  };

  search(0, new Array(numCols).fill(0), 0);

  return minPresses === Infinity ? 0 : minPresses;
};

execute([part1, part2]);

// Part 1: 452, took 20ms
// Part 2: 17424, took 24ms
