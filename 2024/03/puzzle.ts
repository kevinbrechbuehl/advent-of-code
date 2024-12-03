// --- Day 3: Mull It Over ---
// https://adventofcode.com/2024/day/3

import { execute, getInput, isSampleInput } from "../utils";

const part1 = (): number => {
  return calculate(parseInput(1));
};

const part2 = (): number => {
  return parseInput(2)
    .split("do()")
    .map((memory) => calculate(memory.split("don't()")[0]))
    .reduce((total, currentValue) => total + currentValue, 0);
};

const parseInput = (part: 1 | 2): string => {
  const fileName = isSampleInput() ? `sample${part}.txt` : "input.txt";
  return getInput(fileName);
};

const calculate = (memory: string): number => {
  return memory
    .match(/mul\(\d+,\d+\)/g)
    .map((operation) => {
      const [first, second] = operation.match(/\d+/g).map(Number);
      return first * second;
    })
    .reduce((total, currentValue) => total + currentValue, 0);
};

execute([part1, part2]);

// Part 1: 174960292, took 1ms
// Part 2: 56275602, took 0ms
