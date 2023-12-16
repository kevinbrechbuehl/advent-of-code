// --- Day 16: The Floor Will Be Lava ---
// https://adventofcode.com/2023/day/16

import { execute, getInputByLine } from '../utils';

enum Direction {
  Up,
  Down,
  Left,
  Right,
}

interface Instruction {
  row: number;
  col: number;
  direction: Direction;
}

const part1 = (): number => {
  const grid = parseInput();

  return getEnergizedTiles(grid, {
    row: 0,
    col: 0,
    direction: Direction.Right,
  });
};

const part2 = (): number => {
  const grid = parseInput();
  const beams: number[] = [];

  // Calculate for each row
  for (let row = 0; row < grid.length; row++) {
    beams.push(
      getEnergizedTiles(grid, {
        row,
        col: 0,
        direction: Direction.Right,
      })
    );

    beams.push(
      getEnergizedTiles(grid, {
        row,
        col: grid[row].length - 1,
        direction: Direction.Left,
      })
    );
  }

  // Calculate for each col
  for (let col = 0; col < grid[0].length; col++) {
    beams.push(
      getEnergizedTiles(grid, {
        row: 0,
        col,
        direction: Direction.Down,
      })
    );

    beams.push(
      getEnergizedTiles(grid, {
        row: grid.length - 1,
        col,
        direction: Direction.Up,
      })
    );
  }

  return Math.max(...beams);
};

const parseInput = (): string[][] => {
  return getInputByLine().map((line) => line.split(''));
};

const getEnergizedTiles = (grid: string[][], start: Instruction): number => {
  const visited = new Set<string>();
  const energized = new Set<string>();

  const queue: Instruction[] = [start];
  let instruction: Instruction;

  while ((instruction = queue.shift())) {
    const { row, col, direction } = instruction;

    // Skip if outside of grid
    if (row < 0 || row > grid[0].length - 1) {
      continue;
    }

    if (col < 0 || col > grid.length - 1) {
      continue;
    }

    // Skip if we have already visited the tile in the same direction, because
    // we wouldn't energize any other tile
    const visitedKey = `${row},${col},${direction}`;
    if (visited.has(visitedKey)) {
      continue;
    }

    visited.add(visitedKey);

    // Energize the current tile
    energized.add(`${row},${col}`);

    const tile = grid[row][col];

    if (tile === '.') {
      // Move to the next tile in the same direction
      queue.push(move(instruction));
      continue;
    }

    if (tile === '-') {
      if (direction === Direction.Left || direction === Direction.Right) {
        // Move to the next tile in the same direction
        queue.push(move(instruction));
      } else {
        // Split and move to left and right
        queue.push(move({ ...instruction, direction: Direction.Left }));
        queue.push(move({ ...instruction, direction: Direction.Right }));
      }

      continue;
    }

    if (tile === '|') {
      if (direction === Direction.Up || direction === Direction.Down) {
        // Move to the next tile in the same direction
        queue.push(move(instruction));
      } else {
        // Split and move up and down
        queue.push(move({ ...instruction, direction: Direction.Up }));
        queue.push(move({ ...instruction, direction: Direction.Down }));
      }

      continue;
    }

    if (tile === '/') {
      // Change direction and move
      switch (direction) {
        case Direction.Up:
          queue.push(move({ ...instruction, direction: Direction.Right }));
          break;
        case Direction.Right:
          queue.push(move({ ...instruction, direction: Direction.Up }));
          break;
        case Direction.Down:
          queue.push(move({ ...instruction, direction: Direction.Left }));
          break;
        case Direction.Left:
          queue.push(move({ ...instruction, direction: Direction.Down }));
          break;
      }

      continue;
    }

    if (tile === '\\') {
      // Change direction and move
      switch (direction) {
        case Direction.Up:
          queue.push(move({ ...instruction, direction: Direction.Left }));
          break;
        case Direction.Right:
          queue.push(move({ ...instruction, direction: Direction.Down }));
          break;
        case Direction.Down:
          queue.push(move({ ...instruction, direction: Direction.Right }));
          break;
        case Direction.Left:
          queue.push(move({ ...instruction, direction: Direction.Up }));
          break;
      }

      continue;
    }
  }

  return energized.size;
};

const move = (instruction: Instruction): Instruction => {
  switch (instruction.direction) {
    case Direction.Up:
      return { ...instruction, row: instruction.row - 1 };
    case Direction.Right:
      return { ...instruction, col: instruction.col + 1 };
    case Direction.Down:
      return { ...instruction, row: instruction.row + 1 };
    case Direction.Left:
      return { ...instruction, col: instruction.col - 1 };
  }
};

execute([part1, part2]);

// Part 1: 7608, took 10ms
// Part 2: 8221, took 1.582s
