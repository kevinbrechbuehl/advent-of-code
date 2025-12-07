// --- Day 7: Laboratories ---
// https://adventofcode.com/2025/day/7

import { getInputByLine, execute } from "../utils";

const part1 = (): number => {
  const input = getInputByLine();

  let beams = new Set<number>();
  beams.add(input[0].indexOf("S"));

  let numberOfSplits = 0;

  for (let row = 1; row < input.length; row++) {
    const nextBeams = new Set<number>();

    for (const col of beams) {
      if (input[row][col] === "^") {
        numberOfSplits++;

        nextBeams.add(col - 1);
        nextBeams.add(col + 1);
      } else {
        nextBeams.add(col);
      }
    }

    beams = nextBeams;
  }

  return numberOfSplits;
};

const part2 = (): number => {
  const input = getInputByLine();

  let beams = new Map<number, number>();
  beams.set(input[0].indexOf("S"), 1);

  for (let row = 1; row < input.length; row++) {
    const nextBeams = new Map<number, number>();

    for (const [col, count] of beams) {
      if (input[row][col] === "^") {
        nextBeams.set(col - 1, (nextBeams.get(col - 1) || 0) + count);
        nextBeams.set(col + 1, (nextBeams.get(col + 1) || 0) + count);
      } else {
        nextBeams.set(col, (nextBeams.get(col) || 0) + count);
      }
    }

    beams = nextBeams;
  }

  return [...beams.values()].reduce((sum, count) => sum + count, 0);
};

execute([part1, part2]);

// Part 1: 1543, took 0ms
// Part 2: 3223365367809, took 1ms
