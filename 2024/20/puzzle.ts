// --- Day 20: Race Condition ---
// https://adventofcode.com/2024/day/20

import { getInputByLine, isSampleInput, execute } from "../utils";

const DIRECTIONS = [
  [0, 1],
  [1, 0],
  [0, -1],
  [-1, 0],
];

const REQUIRED_SAVING = isSampleInput() ? 1 : 100;

const part1 = (): number => {
  const { map, start } = parseInput();
  const path = getPath(map, start);
  return getNumberOfCheats(path, 2);
};

const part2 = (): number => {
  const { map, start } = parseInput();
  const path = getPath(map, start);
  return getNumberOfCheats(path, 20);
};

const parseInput = (): { map: string[][]; start: [number, number] } => {
  const map = getInputByLine().map((line) => line.split(""));
  let start: [number, number];

  for (let row = 0; row < map.length; row++) {
    for (let col = 0; col < map[row].length; col++) {
      if (map[row][col] === "S") {
        start = [row, col];
      }
    }
  }

  return { map, start };
};

const getPath = (
  map: string[][],
  start: [number, number]
): { [key: string]: number } => {
  const distances: { [key: string]: number } = {};
  distances[`${start[0]},${start[1]}`] = 0;

  const queue: { row: number; col: number; distance: number }[] = [];
  queue.push({
    row: start[0],
    col: start[1],
    distance: 0,
  });

  while (queue.length) {
    const { row, col, distance } = queue.shift();

    for (const nextDirection of DIRECTIONS) {
      const nextRow = row + nextDirection[0];
      const nextCol = col + nextDirection[1];
      const nextDistance = distance + 1;

      if (nextRow <= 0 || nextRow >= map.length - 1) continue;
      if (nextCol <= 0 || nextRow >= map[0].length - 1) continue;
      if (map[nextRow][nextCol] === "#") continue;

      const key = `${nextRow},${nextCol}`;
      if (!distances[key] || distances[key] > nextDistance) {
        queue.push({ row: nextRow, col: nextCol, distance: nextDistance });
        distances[key] = nextDistance;
      }
    }
  }

  return distances;
};

const getNumberOfCheats = (
  path: { [key: string]: number },
  cheatDistance: number
): number => {
  let numberOfCheats = 0;
  const positions = Object.keys(path);

  for (let i = 0; i < positions.length; i++) {
    for (let j = i + 1; j < positions.length; j++) {
      const distanceA = path[positions[i]];
      const [rowA, colA] = positions[i].split(",").map(Number);

      const distanceB = path[positions[j]];
      const [rowB, colB] = positions[j].split(",").map(Number);

      const distance = Math.abs(rowA - rowB) + Math.abs(colA - colB);
      const saving = Math.abs(distanceA - distanceB) - distance;

      if (distance <= cheatDistance && saving >= REQUIRED_SAVING)
        numberOfCheats++;
    }
  }

  return numberOfCheats;
};

execute([part1, part2]);

// Part 1: 1296, took 13.8s
// Part 2: 977665, took 13.852s
