// --- Day 21: Keypad Conundrum ---
// https://adventofcode.com/2024/day/21

import { getInputByLine, execute } from "../utils";

const NUMERIC_KEYPAD = [
  ["7", "8", "9"],
  ["4", "5", "6"],
  ["1", "2", "3"],
  [" ", "0", "A"],
];

const DIRECTIONAL_KEYPAD = [
  [" ", "^", "A"],
  ["<", "v", ">"],
];

const DIRECTIONS = {
  ">": [0, 1],
  v: [1, 0],
  "<": [0, -1],
  "^": [-1, 0],
};

const part1 = (): number => {
  return getInputByLine().reduce((total, code) => {
    const buttonPresses = getButtonPresses(NUMERIC_KEYPAD, code, 2);
    const numericPart = Number(code.slice(0, -1));
    return total + buttonPresses * numericPart;
  }, 0);
};

const part2 = (): number => {
  return getInputByLine().reduce((total, code) => {
    const buttonPresses = getButtonPresses(NUMERIC_KEYPAD, code, 25);
    const numericPart = Number(code.slice(0, -1));
    return total + buttonPresses * numericPart;
  }, 0);
};

const getButtonPresses = (
  keypad: string[][],
  code: string,
  robots: number,
  cache = new Map<string, number>()
): number => {
  const key = `${code},${robots}`;
  if (cache.has(key)) {
    return cache.get(key);
  }

  let currentButton = "A";
  let length = 0;

  for (let i = 0; i < code.length; i++) {
    const transitionPaths = getPaths(keypad, currentButton, code[i]);
    if (robots === 0) {
      length += transitionPaths[0].length;
    } else {
      const buttonPresses = transitionPaths.map((code) =>
        getButtonPresses(DIRECTIONAL_KEYPAD, code, robots - 1, cache)
      );

      length += Math.min(...buttonPresses);
    }

    currentButton = code[i];
  }

  cache.set(key, length);
  return length;
};

const getPaths = (keypad: string[][], start: string, end: string): string[] => {
  const paths: string[] = [];
  const position = findPosition(keypad, start);

  const queue: { row: number; col: number; path: string }[] = [];
  queue.push({ row: position[0], col: position[1], path: "" });

  while (queue.length) {
    const { row, col, path } = queue.shift();

    // Only get shortest possible paths
    if (paths.length > 0 && paths[0].length < path.length) {
      continue;
    }

    if (keypad[row][col] === end) {
      paths.push(path + "A");
      continue;
    }

    for (const [direction, vector] of Object.entries(DIRECTIONS)) {
      const nextRow = row + vector[0];
      const nextCol = col + vector[1];
      const nextPath = path + direction;

      if (nextRow < 0 || nextRow >= keypad.length) continue;
      if (nextCol < 0 || nextCol >= keypad[0].length) continue;
      if (keypad[nextRow][nextCol] === " ") continue;

      queue.push({ row: nextRow, col: nextCol, path: nextPath });
    }
  }

  return paths;
};

const findPosition = (keypad: string[][], value: string): [number, number] => {
  for (let row = 0; row < keypad.length; row++) {
    for (let col = 0; col < keypad[row].length; col++) {
      if (keypad[row][col] === value) {
        return [row, col];
      }
    }
  }

  return [-1, -1];
};

execute([part1, part2]);

// Part 1: 134120, took 5ms
// Part 2: 167389793580400, took 13ms
