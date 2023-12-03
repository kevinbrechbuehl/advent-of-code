// --- Day 3: Gear Ratios ---
// https://adventofcode.com/2023/day/3

import { getInputByLine, execute } from '../utils';

const part1 = (): number => {
  const sum = (input: number[]): number => {
    return input.reduce((total, currentValue) => total + currentValue, 0);
  };

  const { numbers, symbols } = parseInput();

  let result = 0;

  for (const [coordinates, _] of symbols) {
    const parts = findParts(coordinates, numbers);

    result += sum(Array.from(parts));
  }

  return result;
};

const part2 = (): number => {
  const multiply = (input: number[]): number => {
    return input.reduce((total, currentValue) => total * currentValue, 1);
  };

  const { numbers, symbols } = parseInput();

  let result = 0;

  for (const [coordinates, symbol] of symbols) {
    if (symbol !== '*') {
      continue;
    }

    const parts = findParts(coordinates, numbers);

    if (parts.size === 2) {
      result += multiply(Array.from(parts));
    }
  }

  return result;
};

const parseInput = (): {
  numbers: Map<string, number>;
  symbols: Map<string, string>;
} => {
  const isDigit = (input: string): boolean => {
    return /^\d+$/g.test(input);
  };

  const numbers = new Map<string, number>();
  const symbols = new Map<string, string>();

  getInputByLine().map((line, row) => {
    const matches = [...line.matchAll(/\d+|[^.]/g)];
    matches.map((match) => {
      if (isDigit(match[0])) {
        const value = parseInt(match[0], 10);
        for (let i = match.index; i < match.index + match[0].length; i++) {
          numbers.set(`${row},${i}`, value);
        }
      } else {
        symbols.set(`${row},${match.index}`, match[0]);
      }
    });
  });

  return { numbers, symbols };
};

const findParts = (
  coordinates: string,
  numbers: Map<string, number>
): Set<number> => {
  const parts = new Set<number>();
  const [row, col] = coordinates.split(',').map((c) => parseInt(c, 10));

  const sourroundings = [
    [row - 1, col - 1],
    [row - 1, col],
    [row - 1, col + 1],
    [row, col - 1],
    [row, col + 1],
    [row + 1, col - 1],
    [row + 1, col],
    [row + 1, col + 1],
  ];

  for (const coord of sourroundings) {
    if (numbers.has(`${coord[0]},${coord[1]}`)) {
      parts.add(numbers.get(`${coord[0]},${coord[1]}`));
    }
  }

  return parts;
};

execute([part1, part2]);

// Part 1: 537732, took 4ms
// Part 2: 84883664, took 3ms
