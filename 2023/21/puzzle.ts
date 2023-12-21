// --- Day 21: Step Counter ---
// https://adventofcode.com/2023/day/21

import { execute, getInputByLine } from '../utils';

interface QueueItem {
  row: number;
  col: number;
  step: number;
}

const directions = [
  [0, 1],
  [1, 0],
  [0, -1],
  [-1, 0],
];

const part1 = (): number => {
  const { size, start, rocks } = parseInput();

  return getNumberOfPlots(64, size, start, rocks);
};

// This one was too hard for me, I didn't figure out how this really works.
// It's implemented with the "Lagrange's Interpolation formula".
// Credits to: https://pastebin.com/u/scibuff
const part2 = (): number => {
  const { size, start, rocks } = parseInput();

  /**
   * Lagrange's Interpolation formula for ax^2 + bx + c with x=[0,1,2] and y=[y0,y1,y2] we have
   *   f(x) = (x^2-3x+2) * y0/2 - (x^2-2x)*y1 + (x^2-x) * y2/2
   * so the coefficients are:
   * a = y0/2 - y1 + y2/2
   * b = -3*y0/2 + 2*y1 - y2/2
   * c = y0
   */
  const simplifiedLagrange = (values: number[]) => {
    return {
      a: values[0] / 2 - values[1] + values[2] / 2,
      b: -3 * (values[0] / 2) + 2 * values[1] - values[2] / 2,
      c: values[0],
    };
  };

  const values = [
    getNumberOfPlots(65, size, start, rocks),
    getNumberOfPlots(65 + 131, size, start, rocks),
    getNumberOfPlots(65 + 131 * 2, size, start, rocks),
  ];

  const poly = simplifiedLagrange(values);
  const target = (26501365 - 65) / 131;
  return poly.a * target * target + poly.b * target + poly.c;
};

const parseInput = (): {
  size: number;
  start: string;
  rocks: Set<string>;
} => {
  const input = getInputByLine();

  const rocks = new Set<string>();
  const size = input.length; // Grid is a square
  let start: string;

  input.forEach((line, row) => {
    line.split('').forEach((char, col) => {
      if (char === '#') {
        rocks.add(`${row},${col}`);
      } else if (char === 'S') {
        start = `${row},${col}`;
      }
    });
  });

  return { size, start, rocks };
};

const getNumberOfPlots = (
  steps: number,
  size: number,
  start: string,
  rocks: Set<string>
): number => {
  // Wrap row and col if the end of the grid is reached
  const isRock = (row: number, col: number): boolean => {
    const wrappedRow = row >= 0 ? row % size : (size + (row % size)) % size;
    const wrappedCol = col >= 0 ? col % size : (size + (col % size)) % size;

    return rocks.has(`${wrappedRow},${wrappedCol}`);
  };

  const visited: { [key: string]: number } = {};

  const queue: QueueItem[] = [];
  const [startRow, startCol] = start.split(',').map(Number);
  queue.push({ row: startRow, col: startCol, step: 0 });

  while (queue.length > 0) {
    const { row, col, step } = queue.shift();

    if (step > steps) {
      return Object.values(visited).filter((s) => s === steps % 2).length / 2;
    }

    visited[`${row},${col}`] = step % 2;

    directions.forEach((direction) => {
      const nextRow = row + direction[0];
      const nextCol = col + direction[1];
      const nextTile = `${nextRow},${nextCol};`;

      if (!visited[nextTile] && !isRock(nextRow, nextCol)) {
        visited[nextTile] = (step + 1) % 2;
        queue.push({ row: nextRow, col: nextCol, step: step + 1 });
      }
    });
  }

  return -1;
};

execute([part1, part2]);

// Part 1: 3751, took 36ms
// Part 2: 619407349431167, took 974ms
