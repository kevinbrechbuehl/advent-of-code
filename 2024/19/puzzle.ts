// --- Day 19: Linen Layout ---
// https://adventofcode.com/2024/day/19

import { getInputByGroupOfLines, execute } from "../utils";

const part1 = (): number => {
  const { towels, designs } = parseInput();

  return designs.reduce(
    (total, design) => total + countPossibilities(design, towels, true),
    0
  );
};

const part2 = (): number => {
  const { towels, designs } = parseInput();

  return designs.reduce(
    (total, design) => total + countPossibilities(design, towels, false),
    0
  );
};

const parseInput = (): { towels: string[]; designs: string[] } => {
  const [towels, designs] = getInputByGroupOfLines();
  return { towels: towels[0].split(", "), designs };
};

const countPossibilities = (
  design: string,
  towels: string[],
  breakOnFirstHit: boolean,
  cache = new Map<string, number>()
): number => {
  if (!design) {
    return 1;
  }

  if (cache.has(design)) {
    return cache.get(design);
  }

  let total = 0;
  for (const pattern of towels) {
    if (design.startsWith(pattern)) {
      total += countPossibilities(
        design.slice(pattern.length),
        towels,
        breakOnFirstHit,
        cache
      );

      if (breakOnFirstHit && total > 0) {
        cache.set(design, total);
        return total;
      }
    }
  }

  cache.set(design, total);
  return total;
};

execute([part1, part2]);

// Part 1: 317, took 34ms
// Part 2: 883443544805484, took 49ms
