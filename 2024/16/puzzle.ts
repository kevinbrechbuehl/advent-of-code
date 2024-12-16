// --- Day 16: Reindeer Maze ---
// https://adventofcode.com/2024/day/16

import { PriorityQueue } from "../types";
import { getInputByLine, execute } from "../utils";

type Item = {
  row: number;
  col: number;
  direction: string;
  score: number;
  path: string[];
};

const DIRECTIONS = {
  ">": [0, 1],
  v: [1, 0],
  "<": [0, -1],
  "^": [-1, 0],
};

const part1 = (): number => {
  const { map, start } = parseInput();

  const paths = getPaths(map, start);
  const bestScore = getBestScore(paths);

  return bestScore;
};

const part2 = (): number => {
  const { map, start } = parseInput();

  const paths = getPaths(map, start, true);
  const bestSpots = getBestSpots(paths);

  return bestSpots.size;
};

const parseInput = (): { map: string[][]; start: [number, number] } => {
  const map = getInputByLine().map((line) => line.split(""));
  let start: [number, number];
  for (let row = 0; row < map.length; row++) {
    for (let col = 0; col < map[row].length; col++) {
      if (map[row][col] === "S") {
        start = [row, col];
        map[row][col] = ".";
      }
    }
  }

  return { map, start };
};

const getPaths = (
  map: string[][],
  start: [number, number],
  allPaths: boolean = false
): Item[] => {
  const paths: Item[] = [];
  const visited = new Map<string, number>();
  const queue = new PriorityQueue<Item>(
    (a: Item, b: Item) => b.score - a.score
  );

  queue.add({
    row: start[0],
    col: start[1],
    direction: ">",
    score: 0,
    path: [`${start[0]},${start[1]}`],
  });

  while (queue.size) {
    const { row, col, direction, score, path } = queue.poll();

    for (const nextDirection of Object.keys(DIRECTIONS)) {
      if (direction === ">" && nextDirection === "<") continue;
      if (direction === "<" && nextDirection === ">") continue;
      if (direction === "^" && nextDirection === "v") continue;
      if (direction === "v" && nextDirection === "^") continue;

      const nextRow = row + DIRECTIONS[nextDirection][0];
      const nextCol = col + DIRECTIONS[nextDirection][1];
      const nextScore = score + (direction === nextDirection ? 1 : 1001);

      if (map[nextRow][nextCol] === ".") {
        const key = `${nextRow},${nextCol},${nextDirection}`;

        if (visited.has(key) && (!allPaths || nextScore > visited.get(key))) {
          continue;
        }

        visited.set(key, nextScore);

        queue.add({
          row: nextRow,
          col: nextCol,
          direction: nextDirection,
          score: nextScore,
          path: [...path, `${nextRow},${nextCol}`],
        });
      } else if (map[nextRow][nextCol] === "E") {
        paths.push({
          row: nextRow,
          col: nextCol,
          direction: nextDirection,
          score: nextScore,
          path: [...path, `${nextRow},${nextCol}`],
        });
      }
    }
  }

  return paths;
};

const getBestScore = (paths: Item[]): number => {
  return Math.min(...paths.map((p) => p.score));
};

const getBestSpots = (paths: Item[]): Set<string> => {
  const bestScore = getBestScore(paths);
  const bestSpots = new Set<string>();

  paths
    .filter((p) => p.score === bestScore)
    .forEach((p) => {
      p.path.forEach((spot) => bestSpots.add(spot));
    });

  return bestSpots;
};

execute([part1, part2]);

// Part 1: 83432, took 22ms
// Part 2: 467, took 143ms
