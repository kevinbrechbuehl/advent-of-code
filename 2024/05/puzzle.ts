// --- Day 5: Print Queue ---
// https://adventofcode.com/2024/day/5

import { getInputByGroupOfLines, execute } from "../utils";

const part1 = (): number => {
  const { rules, updates } = parseInput();

  return updates
    .map((pages) => {
      const sorted = pages.toSorted((a, b) => (rules.get(a)?.has(b) ? -1 : 1));
      const inOrder = pages.every((page, index) => page === sorted[index]);
      return inOrder ? pages[Math.floor(pages.length / 2)] : 0;
    })
    .reduce((total, currentValue) => total + currentValue, 0);
};

const part2 = (): number => {
  const { rules, updates } = parseInput();

  return updates
    .map((pages) => {
      const sorted = pages.toSorted((a, b) => (rules.get(a)?.has(b) ? -1 : 1));
      const inOrder = pages.every((page, index) => page === sorted[index]);
      return inOrder ? 0 : sorted[Math.floor(sorted.length / 2)];
    })
    .reduce((total, currentValue) => total + currentValue, 0);
};

const parseInput = (): {
  rules: Map<number, Set<number>>;
  updates: number[][];
} => {
  const input = getInputByGroupOfLines();

  const rules: Map<number, Set<number>> = new Map();
  input[0].map((line) => {
    const [l, r] = line.split("|").map(Number);
    rules.set(l, (rules.get(l) ?? new Set()).add(r));
  });

  const updates = input[1].map((line) => line.split(",").map(Number));

  return { rules, updates };
};

execute([part1, part2]);

// Part 1: 7307, took 2ms
// Part 2: 4713, took 1ms
