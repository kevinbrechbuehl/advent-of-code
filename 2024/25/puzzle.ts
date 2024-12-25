// --- Day 25: Code Chronicle ---
// https://adventofcode.com/2024/day/25

import { getInputByGroupOfLines, execute } from "../utils";

const part1 = (): number => {
  const { locks, keys, height } = parseInput();

  let uniquePairs = 0;
  for (let i = 0; i < locks.length; i++) {
    for (let j = 0; j < keys.length; j++) {
      let isUnique = true;
      for (let k = 0; k < locks[i].length; k++) {
        if (locks[i][k] + keys[j][k] > height) {
          isUnique = false;
          break;
        }
      }

      if (isUnique) {
        uniquePairs += 1;
      }
    }
  }

  return uniquePairs;
};

const parseInput = (): {
  locks: number[][];
  keys: number[][];
  height: number;
} => {
  const schematics = getInputByGroupOfLines();

  const locks: number[][] = [];
  const keys: number[][] = [];
  const height = schematics[0].length - 2;

  for (const schematic of schematics) {
    const isLock = schematic[0][0] === "#";
    const start = isLock ? 1 : 0;
    const end = isLock ? schematic.length : schematic.length - 1;

    const pins = Array(schematic[0].length).fill(0);
    for (let row = start; row < end; row++) {
      for (let col = 0; col < schematic[row].length; col++) {
        if (schematic[row][col] === "#") {
          pins[col] += 1;
        }
      }
    }

    isLock ? locks.push(pins) : keys.push(pins);
  }

  return { locks, keys, height };
};

execute([part1]);

// Part 1: 3317, took 2ms
