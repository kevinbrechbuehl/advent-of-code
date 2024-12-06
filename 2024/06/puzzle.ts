// --- Day 6: Guard Gallivant ---
// https://adventofcode.com/2024/day/6

import { getInputByLine, execute } from "../utils";

const DIRECTIONS = [
  [-1, 0], // ^
  [0, 1], // >
  [1, 0], // v
  [0, -1], // <
];

const part1 = (): number => {
  const { map, startRow, startCol } = parseInput();

  const visited = traverse(map, startRow, startCol) as Set<string>;
  return visited.size ?? -1;
};

const part2 = (): number => {
  const { map, startRow, startCol } = parseInput();

  const visited = traverse(map, startRow, startCol) as Set<string>;
  if (!visited) {
    return -1;
  }

  const loops = new Set<string>();
  for (const position of visited) {
    const [row, col] = position.split(",").map(Number);

    const withNewObstruction = map.map((row) => row.slice());
    withNewObstruction[row][col] = "#";

    if (traverse(withNewObstruction, startRow, startCol) === true) {
      loops.add(`${row},${col}`);
    }
  }

  return loops.size;
};

const parseInput = (): {
  map: string[][];
  startRow: number;
  startCol: number;
} => {
  const map = getInputByLine().map((line) =>
    line.split("").map((char) => char)
  );

  for (let row = 0; row < map.length; row++) {
    for (let col = 0; col < map[row].length; col++) {
      if (map[row][col] === "^") {
        map[row][col] = ".";
        return { map, startRow: row, startCol: col };
      }
    }
  }
};

const traverse = (
  map: string[][],
  row: number,
  col: number
): boolean | Set<string> => {
  let direction = 0;

  const visited = new Set<string>();
  const path = new Set<string>();

  while (true) {
    if (path.has(`${row},${col},${direction}`)) {
      return true;
    }

    visited.add(`${row},${col}`);
    path.add(`${row},${col},${direction}`);

    const [directionRow, directionCol] = DIRECTIONS[direction];
    const nextRow = row + directionRow;
    const nextCol = col + directionCol;

    if (isOutOfMap(map, nextRow, nextCol)) {
      return visited;
    }

    if (map[nextRow][nextCol] !== "#") {
      row = nextRow;
      col = nextCol;
    } else {
      direction = (direction + 1) % 4;
    }
  }
};

const isOutOfMap = (map: string[][], row: number, col: number): boolean => {
  return row < 0 || row >= map.length || col < 0 || col >= map[row].length;
};

execute([part1, part2]);

// Part 1: 4826, took 2ms
// Part 2: 1721, took 3.265s
