// --- Day 4: Ceres Search ---
// https://adventofcode.com/2024/day/4

import { getInputByLine, execute } from "../utils";

type Direction = { row: -1 | 0 | 1; col: -1 | 0 | 1 };

const part1 = (): number => {
  const input = parseInput();

  const directions: Direction[] = [
    { row: -1, col: -1 },
    { row: -1, col: 0 },
    { row: -1, col: 1 },
    { row: 0, col: -1 },
    { row: 0, col: 0 },
    { row: 0, col: 1 },
    { row: 1, col: -1 },
    { row: 1, col: 0 },
    { row: 1, col: 1 },
  ];

  let count = 0;

  for (let row = 0; row < input.length; row++) {
    for (let col = 0; col < input[row].length; col++) {
      if (input[row][col] === "X") {
        for (let direction of directions) {
          if (searchWord(input, "MAS", row, col, direction)) {
            count++;
          }
        }
      }
    }
  }

  return count;
};

const part2 = (): number => {
  const input = parseInput();

  let count = 0;

  for (let row = 0; row < input.length; row++) {
    for (let col = 0; col < input[row].length; col++) {
      if (input[row][col] === "A") {
        const topLeft = tryGetChar(input, row - 1, col - 1);
        const topRight = tryGetChar(input, row - 1, col + 1);
        const bottomLeft = tryGetChar(input, row + 1, col - 1);
        const bottomRight = tryGetChar(input, row + 1, col + 1);

        if (
          ((topLeft === "M" && bottomRight === "S") ||
            (topLeft === "S" && bottomRight === "M")) &&
          ((bottomLeft === "M" && topRight === "S") ||
            (bottomLeft === "S" && topRight === "M"))
        ) {
          count++;
        }
      }
    }
  }

  return count;
};

const parseInput = (): string[][] => {
  return getInputByLine().map((line) => line.split(""));
};

const searchWord = (
  input: string[][],
  word: string,
  row: number,
  col: number,
  direction: Direction
): boolean => {
  for (let i = 0; i < word.length; i++) {
    const nextRow = row + (i + 1) * direction.row;
    const nextCol = col + (i + 1) * direction.col;

    if (tryGetChar(input, nextRow, nextCol) !== word[i]) {
      return false;
    }
  }

  return true;
};

const tryGetChar = (
  input: string[][],
  row: number,
  col: number
): string | null => {
  if (row < 0 || row >= input.length || col < 0 || col >= input[row].length) {
    return null;
  }

  return input[row][col];
};

execute([part1, part2]);

// Part 1: 2639, took 3ms
// Part 2: 2005, took 1ms
