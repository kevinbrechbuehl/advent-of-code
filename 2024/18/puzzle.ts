// --- Day 18: RAM Run ---
// https://adventofcode.com/2024/day/18

import { getInputByLine, isSampleInput, execute } from "../utils";

const SIZE = isSampleInput() ? 6 : 70;

const DIRECTIONS = [
  [0, 1],
  [1, 0],
  [0, -1],
  [-1, 0],
];

const part1 = (): number => {
  const input = getInputByLine();
  const numberOfBytes = isSampleInput() ? 12 : 1024;

  return getShortestPath(input.slice(0, numberOfBytes));
};

const part2 = (): string => {
  const input = getInputByLine();

  let maxReachable = 0;
  let minUnreachable = input.length;

  while (minUnreachable - maxReachable > 1) {
    const middle = Math.floor((minUnreachable + maxReachable) / 2);
    const isReachable = getShortestPath(input.slice(0, middle)) > -1;

    if (isReachable) {
      maxReachable = middle;
    } else {
      minUnreachable = middle;
    }
  }

  return input[minUnreachable - 1];
};

const getShortestPath = (map: string[]): number => {
  const visited = new Set<string>();
  const queue: { x: number; y: number; steps: number }[] = [];

  queue.push({
    x: 0,
    y: 0,
    steps: 0,
  });

  while (queue.length) {
    const { x, y, steps } = queue.shift();

    if (visited.has(`${x},${y}`)) {
      continue;
    }

    visited.add(`${x},${y}`);

    if (x === SIZE && y === SIZE) {
      return steps;
    }

    for (let [directionX, directionY] of DIRECTIONS) {
      const nextX = x + directionX;
      const nextY = y + directionY;

      if (nextX < 0 || nextX > SIZE || nextY < 0 || nextY > SIZE) {
        continue;
      }

      if (map.includes(`${nextX},${nextY}`)) {
        continue;
      }

      queue.push({ x: nextX, y: nextY, steps: steps + 1 });
    }
  }

  return -1;
};

execute([part1, part2]);

// Part 1: 294, took 23ms
// Part 2: 31,22, took 66ms
