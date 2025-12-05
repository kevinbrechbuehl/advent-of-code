// --- Day 5: Cafeteria ---
// https://adventofcode.com/2025/day/5

import { getInputByGroupOfLines, execute } from "../utils";

const part1 = (): number => {
  const { freshRanges, ingredients } = parseInput();

  let freshIngredients = 0;

  for (const id of ingredients) {
    for (const [min, max] of freshRanges) {
      if (id >= min && id <= max) {
        freshIngredients++;
        break;
      }
    }
  }

  return freshIngredients;
};

const part2 = (): number => {
  const { freshRanges } = parseInput();

  let i = 0;
  while (i < freshRanges.length - 1) {
    const [_, currentMax] = freshRanges[i];
    const [nextMin, nextMax] = freshRanges[i + 1];

    if (nextMin <= currentMax + 1) {
      freshRanges[i][1] = Math.max(currentMax, nextMax);
      freshRanges.splice(i + 1, 1);
    } else {
      i++;
    }
  }

  return freshRanges.reduce((sum, [min, max]) => sum + (max - min + 1), 0);
};

const parseInput = (): {
  freshRanges: [number, number][];
  ingredients: number[];
} => {
  const input = getInputByGroupOfLines();

  const freshRanges = input[0]
    .map((line) => line.split("-").map(Number) as [number, number])
    .sort((a, b) => a[0] - b[0]);

  const ingredients = input[1].map(Number);

  return { freshRanges, ingredients };
};

execute([part1, part2]);

// Part 1: 638, took 4ms
// Part 2: 352946349407338, took 0ms
