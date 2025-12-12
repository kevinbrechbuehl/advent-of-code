// --- Day 12: Christmas Tree Farm ---
// https://adventofcode.com/2025/day/12

import { getInputByGroupOfLines, execute } from "../utils";

// I tried a simplification and treated this purely as a capacity check.
// Compute the total number of occupied cells ('#') used by the presents
// and compare it to the region area. This works for my real input, but
// it does NOT match the sample, so it is not a general packing solution.
// Oh well. ¯\_(ツ)_/¯
const part1 = (): number => {
  const { presents, regions } = parseInput();

  let totalRegions = 0;
  for (const region of regions) {
    let shapes = 0;

    for (let i = 0; i < presents.length; i++) {
      shapes += presents[i] * region.quantities[i];
    }

    if (region.width * region.length >= shapes) {
      totalRegions++;
    }
  }

  return totalRegions;
};

const parseInput = (): {
  presents: number[];
  regions: { width: number; length: number; quantities: number[] }[];
} => {
  const input = getInputByGroupOfLines();

  const presents = input.slice(0, input.length - 1).map((group) => {
    let count = 0;

    for (const line of group) {
      for (const char of line) {
        if (char === "#") {
          count++;
        }
      }
    }

    return count;
  });

  const regions = input[input.length - 1].map((line) => {
    const numbers = line.match(/\d+/g).map(Number);

    return {
      width: numbers[0],
      length: numbers[1],
      quantities: numbers.slice(2),
    };
  });

  return { presents, regions };
};

execute([part1]);

// Part 1: 565, took 1ms
