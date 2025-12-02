// --- Day 2: Gift Shop ---
// https://adventofcode.com/2025/day/2

import { getInput, execute } from "../utils";

const part1 = (): number => {
  return getInvalidIdsSum(parseInput(), isRepeatingTwice);
};

const part2 = (): number => {
  return getInvalidIdsSum(parseInput(), isRepeatingAtLeastTwice);
};

const parseInput = (): { start: number; end: number }[] => {
  return getInput()
    .split(",")
    .map((range) => {
      const [start, end] = range.split("-");
      return { start: parseInt(start, 10), end: parseInt(end, 10) };
    });
};

const getInvalidIdsSum = (
  ranges: { start: number; end: number }[],
  isInvalidIdFunc: (id: number) => boolean
): number => {
  let sum = 0;
  ranges.forEach(({ start, end }) => {
    for (let id = start; id <= end; id++) {
      if (isInvalidIdFunc(id)) {
        sum += id;
      }
    }
  });

  return sum;
};

const isRepeatingTwice = (id: number): boolean => {
  const idString = id.toString();
  const middle = Math.floor(idString.length / 2);
  return idString.slice(0, middle) === idString.slice(middle);
};

const isRepeatingAtLeastTwice = (id: number): boolean => {
  const idString = id.toString();
  const idLength = idString.length;

  // Only go until the middle of the string, as it can not repeat beyond that
  const middle = Math.floor(idLength / 2);
  for (let i = 1; i <= middle; i++) {
    const sequence = idString.slice(0, i);
    const repeating = sequence.repeat(idLength / i);
    if (repeating === idString) {
      return true;
    }
  }

  return false;
};

execute([part1, part2]);

// Part 1: 41294979841, took 53ms
// Part 2: 66500947346, took 218ms
