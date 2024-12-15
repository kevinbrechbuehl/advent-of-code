// --- Day 15: Warehouse Woes ---
// https://adventofcode.com/2024/day/15

import { getInputByGroupOfLines, execute } from "../utils";

const DIRECTIONS = {
  ">": [0, 1],
  v: [1, 0],
  "<": [0, -1],
  "^": [-1, 0],
};

const part1 = (): number => {
  return solve(1);
};

const part2 = (): number => {
  return solve(2);
};

const solve = (part: 1 | 2): number => {
  const { map, movements, start } = parseInput(part);

  let position = start;
  for (const movement of movements) {
    position = tryMove(map, position, DIRECTIONS[movement]);
  }

  return calculateSumOfGpsCoordinates(map);
};

const parseInput = (
  part: 1 | 2
): {
  map: string[][];
  movements: string[];
  start: [number, number];
} => {
  const groups = getInputByGroupOfLines();

  const map = groups[0].map((line) => {
    if (part === 2) {
      line = line.replace(/#/g, "##");
      line = line.replace(/O/g, "[]");
      line = line.replace(/\./g, "..");
      line = line.replace(/@/g, "@.");
    }

    return line.split("");
  });

  const movements = groups[1].join("").split("");

  let start: [number, number];
  for (let row = 0; row < map.length; row++) {
    for (let col = 0; col < map[0].length; col++) {
      if (map[row][col] === "@") {
        start = [row, col];
      }
    }
  }

  return { map, movements, start };
};

const tryMove = (
  map: string[][],
  position: [number, number],
  direction: [number, number]
): [number, number] => {
  let [row, col] = position;
  const [directionRow, directionCol] = direction;

  if (canMove(map, [row + directionRow, col + directionCol], direction)) {
    moveBox(map, [row + directionRow, col + directionCol], direction);
    moveRobot(map, [row + directionRow, col + directionCol], direction);

    row += directionRow;
    col += directionCol;
  }

  return [row, col];
};

const canMove = (
  map: string[][],
  position: [number, number],
  direction: [number, number]
) => {
  let [row, col] = position;
  const [directionRow, directionCol] = direction;
  const isHorizontalMove = directionRow === 0;

  if (isHorizontalMove) {
    while ("O[]".includes(map[row][col])) {
      col += directionCol;
    }

    return map[row][col] === ".";
  } else {
    // For part 2, we expanded the "." with "..", so checking only for one "." is enough
    if (map[row][col] === ".") {
      return true;
    }
    // Same for the wall, even though one wall is enough to prevent the move
    else if (map[row][col] === "#") {
      return false;
    }
    // Only for part 1
    else if (map[row][col] === "O") {
      return canMove(map, [row + directionRow, col], direction);
    }
    // Only for part 2: Check if we can move the first part of the box (the "[")
    else if (map[row][col] === "]") {
      return canMove(map, [row, col - 1], direction);
    }
    // Only for part 2
    else if (map[row][col] === "[") {
      return (
        canMove(map, [row + directionRow, col], direction) &&
        (map[row + directionRow][col] === "[" ||
          canMove(map, [row + directionRow, col + 1], direction))
      );
    }
  }
};

const moveBox = (
  map: string[][],
  position: [number, number],
  direction: [number, number]
) => {
  let [row, col] = position;
  const [directionRow, directionCol] = direction;
  const isHorizontalMove = directionRow === 0;

  if (isHorizontalMove) {
    const currentCol = col;
    while ("O[]".includes(map[row][col])) {
      col += directionCol;
    }

    for (; col != currentCol; col -= directionCol) {
      map[row][col] = map[row][col - directionCol];
    }
  } else {
    // Only for part 1
    if (map[row][col] === "O") {
      moveBox(map, [row + directionRow, col], direction);

      map[row + directionRow][col] = "O";
      map[row][col] = ".";
    }
    // Only for part 2: Skip and move the first part of the box instead
    else if (map[row][col] === "]") {
      moveBox(map, [row, col - 1], direction);
    }
    // Only for part 2: Move both parts of the box
    else if (map[row][col] === "[") {
      moveBox(map, [row + directionRow, col], direction);
      moveBox(map, [row + directionRow, col + 1], direction);

      map[row + directionRow][col] = "[";
      map[row + directionRow][col + 1] = "]";
      map[row][col] = map[row][col + 1] = ".";
    }
  }
};

const moveRobot = (
  map: string[][],
  position: [number, number],
  direction: [number, number]
) => {
  const [row, col] = position;
  const [directionRow, directionCol] = direction;

  map[row][col] = "@";
  map[row - directionRow][col - directionCol] = ".";
};

const calculateSumOfGpsCoordinates = (map: string[][]): number => {
  let sum = 0;

  for (let row = 0; row < map.length; row++) {
    for (let col = 0; col < map[0].length; col++) {
      if ("O[".includes(map[row][col])) {
        sum += 100 * row + col;
      }
    }
  }

  return sum;
};

execute([part1, part2]);

// Part 1: 1437174, took 8ms
// Part 2: 1437468, took 5ms
