// --- Day 14: Parabolic Reflector Dish ---
// https://adventofcode.com/2023/day/14

import { execute, getInputByLine } from '../utils';

const part1 = (): number => {
  const platform = parseInput();

  rollNorth(platform);

  return getTotalLoad(platform);
};

const part2 = (): number => {
  const platform = parseInput();

  const cycle = (platform: string[][]): void => {
    rollNorth(platform);
    rollWest(platform);
    rollSouth(platform);
    rollEast(platform);
  };

  const cache: { [key: string]: number } = {};

  let current = 0;
  let last = 0;

  // Find recurring cycles by storing the index of each
  // cycle into a cache. If the same hash has generated again,
  // we have a recurring cycle and can stop the loop.
  while (true) {
    const hash = JSON.stringify(platform);

    last = cache[hash];
    if (last) {
      break;
    }

    cycle(platform);

    cache[hash] = current;

    current++;
  }

  // We need to cycle the again for the rest
  const rest = (1_000_000_000 - last) % (current - last);
  for (let i = 0; i < rest; i++) {
    cycle(platform);
  }

  return getTotalLoad(platform);
};

const parseInput = (): string[][] => {
  return getInputByLine().map((line) => line.split(''));
};

const rollNorth = (platform: string[][]): void => {
  for (let col = 0; col < platform[0].length; col++) {
    let emptyRow = 0;
    for (let row = 0; row < platform.length; row++) {
      if (platform[row][col] === 'O') {
        platform[row][col] = '.';
        platform[emptyRow][col] = 'O';
        emptyRow++;
      } else if (platform[row][col] === '#') {
        emptyRow = row + 1;
      }
    }
  }
};

const rollWest = (platform: string[][]): void => {
  for (let row = 0; row < platform.length; row++) {
    let emptyCol = 0;
    for (let col = 0; col < platform[row].length; col++) {
      if (platform[row][col] === 'O') {
        platform[row][col] = '.';
        platform[row][emptyCol] = 'O';
        emptyCol++;
      } else if (platform[row][col] === '#') {
        emptyCol = col + 1;
      }
    }
  }
};

const rollSouth = (platform: string[][]): void => {
  for (let col = 0; col < platform[0].length; col++) {
    let emptyRow = platform.length - 1;
    for (let row = platform.length - 1; row >= 0; row--) {
      if (platform[row][col] === 'O') {
        platform[row][col] = '.';
        platform[emptyRow][col] = 'O';
        emptyRow--;
      } else if (platform[row][col] === '#') {
        emptyRow = row - 1;
      }
    }
  }
};

const rollEast = (platform: string[][]): void => {
  for (let row = 0; row < platform.length; row++) {
    let emptyCol = platform[row].length - 1;
    for (let col = platform[row].length - 1; col >= 0; col--) {
      if (platform[row][col] === 'O') {
        platform[row][col] = '.';
        platform[row][emptyCol] = 'O';
        emptyCol--;
      } else if (platform[row][col] === '#') {
        emptyCol = col - 1;
      }
    }
  }
};

const getTotalLoad = (platform: string[][]): number => {
  let sum = 0;

  platform.forEach((row, i) => {
    row.forEach((char) => {
      if (char === 'O') {
        sum += platform.length - i;
      }
    });
  });

  return sum;
};

execute([part1, part2]);

// Part 1: 111979, took 2ms
// Part 2: 102055, took 176ms
