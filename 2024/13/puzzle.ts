// --- Day 13: Claw Contraption ---
// https://adventofcode.com/2024/day/13

import { getInputByGroupOfLines, execute } from "../utils";

const part1 = (): number => {
  return getNumberOfTokens();
};

const part2 = (): number => {
  return getNumberOfTokens(10000000000000);
};

const getNumberOfTokens = (positionsToAdd: number = 0): number => {
  return getInputByGroupOfLines()
    .map((machine) => {
      const [a, b, prize] = machine;
      const [ax, ay] = a.match(/\d+/g).map(Number);
      const [bx, by] = b.match(/\d+/g).map(Number);
      const [px, py] = prize
        .match(/\d+/g)
        .map((d) => Number(d) + positionsToAdd);

      // Use substitution to solve the system of linear equations:
      // px = ax * pressedA + bx * pressedB
      // py = ay * pressedA + by * pressedB

      // Calculate pressedA using substitution (derived from Cramer's rule)
      const pressedA = (px * by - py * bx) / (ax * by - ay * bx);

      // Substitute pressedA back into the first equation to calculate pressedB
      const pressedB = (px - ax * pressedA) / bx;

      if (Number.isInteger(pressedA) && Number.isInteger(pressedB)) {
        return pressedA * 3 + pressedB;
      }

      return 0;
    })
    .reduce((total, currentValue) => total + currentValue, 0);
};

execute([part1, part2]);

// Part 1: 26005, took 0ms
// Part 2: 105620095782547, took 0ms
