// --- Day 10: Hoof It ---
// https://adventofcode.com/2024/day/10

import { getInputByLine, execute } from "../utils";

const part1 = (): number => {
  return hike(false);
};

const part2 = (): number => {
  return hike(true);
};

const hike = (useUniqueTrails: boolean): number => {
  const directions = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ];

  const { map, trailheads } = parseInput();

  let sum = 0;

  for (let [row, col] of trailheads) {
    const queue: string[] = [];
    queue.push(`${row},${col},0`);

    while (queue.length) {
      const [row, col, value] = queue.shift().split(",").map(Number);

      if (value === 9) {
        sum++;
        continue;
      }

      for (let [directionRow, directionCol] of directions) {
        const nextRow = row + directionRow;
        const nextCol = col + directionCol;

        if (isOutOfMap(map, nextRow, nextCol)) {
          continue;
        }

        if (map[nextRow][nextCol] !== value + 1) {
          continue;
        }

        const item = `${nextRow},${nextCol},${value + 1}`;
        if (useUniqueTrails || !queue.includes(item)) {
          queue.push(item);
        }
      }
    }
  }

  return sum;
};

const parseInput = (): { map: number[][]; trailheads: [number, number][] } => {
  const trailheads: [number, number][] = [];

  const map = getInputByLine().map((line, row) =>
    line.split("").map((cell, col) => {
      const value = Number(cell);
      if (value === 0) {
        trailheads.push([row, col]);
      }

      return value;
    })
  );

  return { map, trailheads };
};

const isOutOfMap = (map: number[][], row: number, col: number): boolean => {
  return row < 0 || row >= map.length || col < 0 || col >= map[row].length;
};

execute([part1, part2]);

// Part 1: 737, took 4ms
// Part 2: 1619, took 5ms
