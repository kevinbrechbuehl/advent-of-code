// --- Day 13: Point of Incidence ---
// https://adventofcode.com/2023/day/13

import { execute, getInputByGroupOfLines } from '../utils';

const part1 = (): number => {
  return parseInput()
    .map((group) => {
      const horizontal = getLineOfReflection(group.rows);
      const vertical = getLineOfReflection(group.cols);
      return 100 * horizontal + vertical;
    })
    .reduce((total, currentValue) => total + currentValue, 0);
};

const part2 = (): number => {
  return parseInput()
    .map((group) => {
      const horizontal = getLineOfReflectionWithSmudge(group.rows);
      const vertical = getLineOfReflectionWithSmudge(group.cols);
      return 100 * horizontal + vertical;
    })
    .reduce((total, currentValue) => total + currentValue, 0);
};

const parseInput = (): { rows: string[]; cols: string[] }[] => {
  return getInputByGroupOfLines().map((lines) => {
    return {
      rows: lines,
      cols: lines[0]
        .split('')
        .map((_, i) => lines.map((line) => line[i]).join('')),
    };
  });
};

const getLineOfReflection = (lines: string[]): number => {
  for (let i = 0; i < lines.length - 1; i++) {
    if (lines[i] === lines[i + 1]) {
      if (isPerfectReflection(lines, i, 0)) {
        return i + 1;
      }
    }
  }

  return 0;
};

const getLineOfReflectionWithSmudge = (lines: string[]): number => {
  for (let i = 0; i < lines.length - 1; i++) {
    const current = lines[i];
    const next = lines[i + 1];
    let smudges = 0;

    // Count number of required smudges between lines to have the same line
    for (let j = 0; j < lines[0].length; j++) {
      if (current[j] !== next[j]) {
        smudges++;
      }
    }

    // Search for perfect reflection if there is at least one smudge:
    // - If we already have one, there must be no smudge in the reflection
    // - If we didn't have one, there must be one (and exactly one) in the reflection
    if (smudges <= 1) {
      if (isPerfectReflection(lines, i, smudges === 0 ? 1 : 0)) {
        return i + 1;
      }
    }
  }

  return 0;
};

const isPerfectReflection = (
  lines: string[],
  index: number,
  requiredSmudge: number
): boolean => {
  let counter = 1;
  let smudges = 0;

  while (index - counter >= 0 && counter + index + 1 < lines.length) {
    const left = lines[index - counter];
    const right = lines[index + counter + 1];

    for (let i = 0; i < lines[0].length; i++) {
      if (left[i] !== right[i]) {
        smudges++;
      }
    }

    counter++;
  }

  return smudges === requiredSmudge;
};

execute([part1, part2]);

// Part 1: 33975, took 1ms
// Part 2: 29083, took 2ms
