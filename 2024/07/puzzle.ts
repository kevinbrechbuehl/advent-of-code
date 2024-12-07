// --- Day 7: Bridge Repair ---
// https://adventofcode.com/2024/day/7

import { getInputByLine, execute } from "../utils";

const part1 = (): number => {
  return parseInput()
    .map(({ testValue, operators }) => {
      return isValid(testValue, operators) ? testValue : 0;
    })
    .reduce((total, currentValue) => total + currentValue, 0);
};

const part2 = (): number => {
  return parseInput()
    .map(({ testValue, operators }) => {
      return isValid(testValue, operators, true) ? testValue : 0;
    })
    .reduce((total, currentValue) => total + currentValue, 0);
};

const parseInput = (): { testValue: number; operators: number[] }[] => {
  return getInputByLine().map((line) => {
    const digits = line.match(/\d+/g).map(Number);
    return {
      testValue: digits[0],
      operators: digits.slice(1),
    };
  });
};

const isValid = (
  testValue: number,
  operators: number[],
  includeConcatenation: boolean = false
): boolean => {
  const stack: { current: number; index: number }[] = [];
  stack.push({ current: operators[0], index: 1 });

  while (stack.length) {
    const { current, index } = stack.pop();

    if (index === operators.length && current === testValue) {
      return true;
    }

    if (current <= testValue) {
      const next = operators[index];
      stack.push({ current: current + next, index: index + 1 });
      stack.push({ current: current * next, index: index + 1 });

      if (includeConcatenation) {
        stack.push({ current: Number(`${current}${next}`), index: index + 1 });
      }
    }
  }

  return false;
};

execute([part1, part2]);

// Part 1: 1399219271639, took 7ms
// Part 2: 275791737999003, took 617ms
