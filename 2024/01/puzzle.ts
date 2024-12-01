// --- Day 1: Historian Hysteria ---
// https://adventofcode.com/2024/day/1

import { getInputByLine, execute } from "../utils";

const part1 = (): number => {
  const { left, right } = parseInput();

  return left
    .map((leftValue, index) => Math.abs(leftValue - right[index]))
    .reduce((total, currentValue) => total + currentValue, 0);
};

const part2 = (): number => {
  const { left, right } = parseInput();

  return left
    .map((leftValue) => {
      const rightCount = right.filter(
        (rightValue) => rightValue === leftValue
      ).length;

      return leftValue * rightCount;
    })
    .reduce((total, currentValue) => total + currentValue, 0);
};

const parseInput = (): { left: number[]; right: number[] } => {
  const left: number[] = [];
  const right: number[] = [];

  getInputByLine().map((line) => {
    const [l, r] = line.split(/\s+/).map(Number);
    left.push(l);
    right.push(r);
  });

  left.sort((a, b) => a - b);
  right.sort((a, b) => a - b);

  return { left, right };
};

execute([part1, part2]);

// Part 1: 1646452, took 1ms
// Part 2: 23609874, took 5ms
