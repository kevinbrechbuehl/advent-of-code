// --- Day 12: Garden Groups ---
// https://adventofcode.com/2024/day/12

import { getInputByLine, execute } from "../utils";

const DIRECTIONS = [
  [-1, 0],
  [1, 0],
  [0, -1],
  [0, 1],
];

const part1 = (): number => {
  return getRegions()
    .map((region) => region.size * getPerimeter(region))
    .reduce((total, currentValue) => total + currentValue, 0);
};

const part2 = (): number => {
  return getRegions()
    .map((region) => region.size * getSides(region))
    .reduce((total, currentValue) => total + currentValue, 0);
};

const getRegions = (): Set<string>[] => {
  const map = getInputByLine().map((line) => line.split(""));

  const visited = new Set<string>();
  const regions: Set<string>[] = [];

  for (let row = 0; row < map.length; row++) {
    for (let col = 0; col < map[row].length; col++) {
      if (visited.has(`${row},${col}`)) {
        continue;
      }

      const plant = map[row][col];
      const region = new Set<string>();

      const queue = [{ row, col }];
      while (queue.length) {
        const { row, col } = queue.shift();
        const key = `${row},${col}`;

        if (visited.has(key)) {
          continue;
        }

        region.add(key);
        visited.add(key);

        for (let [directionRow, directionCol] of DIRECTIONS) {
          const nextRow = row + directionRow;
          const nextCol = col + directionCol;

          if (isOutOfMap(map, nextRow, nextCol)) {
            continue;
          }

          if (map[nextRow][nextCol] !== plant) {
            continue;
          }

          queue.push({ row: nextRow, col: nextCol });
        }
      }

      regions.push(region);
    }
  }

  return regions;
};

const getPerimeter = (region: Set<string>): number => {
  let perimeter = 0;

  region.forEach((key) => {
    const [row, col] = key.split(",").map(Number);
    for (let [directionRow, directionCol] of DIRECTIONS) {
      if (!region.has(`${row + directionRow},${col + directionCol}`)) {
        perimeter++;
      }
    }
  });

  return perimeter;
};

const getSides = (region: Set<string>): number => {
  let sides = 0;

  region.forEach((key) => {
    const [row, col] = key.split(",").map(Number);

    const top = `${row - 1},${col}`;
    const topRight = `${row - 1},${col + 1}`;
    const right = `${row},${col + 1}`;
    const bottomRight = `${row + 1},${col + 1}`;
    const bottom = `${row + 1},${col}`;
    const bottomLeft = `${row + 1},${col - 1}`;
    const left = `${row},${col - 1}`;
    const topLeft = `${row - 1},${col - 1}`;

    // Outer edges for each side
    //   .
    // . A
    if (!region.has(top) && !region.has(right)) {
      sides++;
    }

    if (!region.has(right) && !region.has(bottom)) {
      sides++;
    }

    if (!region.has(bottom) && !region.has(left)) {
      sides++;
    }

    if (!region.has(left) && !region.has(top)) {
      sides++;
    }

    // Inner edges for each side
    // . A
    // A A
    if (region.has(top) && region.has(right) && !region.has(topRight)) {
      sides++;
    }

    if (region.has(right) && region.has(bottom) && !region.has(bottomRight)) {
      sides++;
    }

    if (region.has(bottom) && region.has(left) && !region.has(bottomLeft)) {
      sides++;
    }

    if (region.has(left) && region.has(top) && !region.has(topLeft)) {
      sides++;
    }
  });

  return sides;
};

const isOutOfMap = (map: string[][], row: number, col: number): boolean => {
  return row < 0 || row >= map.length || col < 0 || col >= map[row].length;
};

execute([part1, part2]);

// Part 1: 1381056, took 23ms
// Part 2: 834828, took 21ms
