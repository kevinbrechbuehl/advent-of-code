// --- Day 4: Printing Department ---
// https://adventofcode.com/2025/day/4

import { getInputByLine, execute } from "../utils";

const DIRECTIONS = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1],
];

const part1 = (): number => {
  const paperRolls = parseInput();
  const accessiblePaperRolls = getAccessiblePaperRolls(paperRolls);
  return accessiblePaperRolls.size;
};

const part2 = (): number => {
  const paperRolls = parseInput();

  let totalRemoved = 0;

  while (paperRolls.size > 0) {
    const accessiblePaperRolls = getAccessiblePaperRolls(paperRolls);
    if (accessiblePaperRolls.size === 0) {
      break;
    }

    totalRemoved += accessiblePaperRolls.size;

    for (const paperRoll of accessiblePaperRolls) {
      paperRolls.delete(paperRoll);
    }
  }

  return totalRemoved;
};

const parseInput = (): Set<string> => {
  const paperRolls = new Set<string>();
  const grid = getInputByLine().map((line) => line.split(""));

  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[row].length; col++) {
      if (grid[row][col] === "@") {
        paperRolls.add(`${row},${col}`);
      }
    }
  }

  return paperRolls;
};

const getAccessiblePaperRolls = (paperRolls: Set<string>): Set<string> => {
  const accessiblePaperRolls = new Set<string>();

  for (const paperRoll of paperRolls) {
    const [row, col] = paperRoll.split(",").map(Number);
    let numberOfAdjacent = 0;

    for (let [directionRow, directionCol] of DIRECTIONS) {
      const nextRow = row + directionRow;
      const nextCol = col + directionCol;

      if (paperRolls.has(`${nextRow},${nextCol}`)) {
        numberOfAdjacent++;
      }

      if (numberOfAdjacent > 3) {
        break;
      }
    }

    if (numberOfAdjacent <= 3) {
      accessiblePaperRolls.add(paperRoll);
    }
  }

  return accessiblePaperRolls;
};

execute([part1, part2]);

// Part 1: 1409, took 13ms
// Part 2: 8366, took 120ms
