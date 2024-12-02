// --- Day 2: Red-Nosed Reports ---
// https://adventofcode.com/2024/day/2

import { getInputByLine, execute } from "../utils";

const part1 = (): number => {
  return parseInput().filter(isSafe).length;
};

const part2 = (): number => {
  return parseInput().filter(isSafeWithBadLevelTolerance).length;
};

const parseInput = (): number[][] => {
  return getInputByLine().map((line) => line.split(" ").map(Number));
};

const isSafe = (levels: number[]): boolean => {
  const isIncreasing = levels[1] > levels[0];

  for (let i = 0; i < levels.length - 1; i++) {
    const difference = isIncreasing
      ? levels[i + 1] - levels[i]
      : levels[i] - levels[i + 1];

    if (difference < 1 || difference > 3) {
      return false;
    }
  }

  return true;
};

const isSafeWithBadLevelTolerance = (levels: number[]): boolean => {
  // Safe without removing any level
  if (isSafe(levels)) {
    return true;
  }

  for (let i = 0; i < levels.length; i++) {
    const faultTolerantLevels = [...levels];
    faultTolerantLevels.splice(i, 1);
    if (isSafe(faultTolerantLevels)) {
      return true;
    }
  }

  return false;
};

execute([part1, part2]);

// Part 1: 306, took 1ms
// Part 2: 366, took 1ms
