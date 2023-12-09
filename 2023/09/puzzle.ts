// --- Day 9: Mirage Maintenance ---
// https://adventofcode.com/2023/day/9

import { execute, getInputByLine } from '../utils';

const part1 = (): number => {
  return getInputByLine()
    .map((line) => line.split(' ').map(Number))
    .map((history) => {
      let nextSequence = [...history];
      let nextValue = 0;

      while (nextSequence.some((value) => value !== 0)) {
        const sequence = [...nextSequence];
        nextSequence = [];

        for (let i = 0; i < sequence.length; i++) {
          if (i === sequence.length - 1) {
            nextValue += sequence[i];
          } else {
            nextSequence.push(sequence[i + 1] - sequence[i]);
          }
        }
      }

      return nextValue;
    })
    .reduce((total, currentValue) => total + currentValue, 0);
};

const part2 = (): number => {
  return getInputByLine()
    .map((line) => line.split(' ').map(Number))
    .map((history) => {
      let nextSequence = [...history];
      let firstValues: number[] = [];

      while (nextSequence.some((value) => value !== 0)) {
        const sequence = [...nextSequence];
        nextSequence = [];

        for (let i = 0; i < sequence.length; i++) {
          if (i === 0) {
            firstValues.push(sequence[i]);
          }

          if (i < sequence.length - 1) {
            nextSequence.push(sequence[i + 1] - sequence[i]);
          }
        }
      }

      let previousValue = 0;
      for (let i = firstValues.length - 1; i >= 0; i--) {
        previousValue = firstValues[i] - previousValue;
      }

      return previousValue;
    })
    .reduce((total, currentValue) => total + currentValue, 0);
};

execute([part1, part2]);

// Part 1: 1916822650, took 2ms
// Part 2: 966, took 3ms
