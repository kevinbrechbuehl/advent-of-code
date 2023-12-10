// --- Day 10: Pipe Maze ---
// https://adventofcode.com/2023/day/10

import { execute, getInputByLine, isSampleInput } from '../utils';

enum Direction {
  Up,
  Down,
  Left,
  Right,
}

const part1 = (): number => {
  const { grid, position, direction } = parseInput(1);
  const { steps } = traverse(grid, position, direction);

  return steps / 2;
};

const part2 = (): number => {
  const { grid, position, direction } = parseInput(2);
  const { traversed } = traverse(grid, position, direction);

  let enclosed = 0;

  for (let row = 0; row < traversed.length; row++) {
    let isInside = false;
    let marker = '';

    for (let col = 0; col < traversed[row].length; col++) {
      const shape = traversed[row][col];

      if (shape === '|') {
        isInside = !isInside;
      } else if (shape === 'F') {
        marker = 'F';
      } else if (shape === 'L') {
        marker = 'L';
      } else if (shape === '7' && marker === 'L') {
        isInside = !isInside;
      } else if (shape === 'J' && marker === 'F') {
        isInside = !isInside;
      } else if (shape === '.' && isInside) {
        enclosed++;
      }
    }
  }

  return enclosed;
};

const parseInput = (
  part: 1 | 2
): { grid: string[][]; position: [number, number]; direction: Direction } => {
  const fileName = isSampleInput() ? `sample${part}.txt` : 'input.txt';

  let startingRow = -1;
  let startingCol = -1;

  // Parse grid
  const grid = getInputByLine(fileName).map((line, row) => {
    return line.split('').map((tile, col) => {
      if (tile === 'S') {
        startingRow = row;
        startingCol = col;
      }

      return tile;
    });
  });

  // Get starting shape and direction
  const isTopConnected =
    startingRow > 0 && '|7F'.includes(grid[startingRow - 1][startingCol]);

  const isRightConnected =
    startingCol < grid[startingRow].length + 1 &&
    '-J7'.includes(grid[startingRow][startingCol + 1]);

  const isBottomConnected =
    startingRow < grid.length + 1 &&
    '|LJ'.includes(grid[startingRow + 1][startingCol]);

  let startingShape: string;
  let startingDirection: Direction;

  if (isTopConnected) {
    startingShape = isRightConnected ? 'L' : isBottomConnected ? '|' : 'J';
    startingDirection = Direction.Up;
  } else if (isRightConnected) {
    startingShape = isBottomConnected ? 'F' : '-';
    startingDirection = Direction.Right;
  } else if (isBottomConnected) {
    startingShape = '7';
    startingDirection = Direction.Down;
  }

  grid[startingRow][startingCol] = startingShape;

  return {
    grid,
    position: [startingRow, startingCol],
    direction: startingDirection,
  };
};

const traverse = (
  grid: string[][],
  startingPosition: [number, number],
  startingDirection: Direction
): { traversed: string[][]; steps: number } => {
  // Copy grid and fill with "."
  const traversed = [...Array(grid.length).fill('.')].map((_, i) =>
    Array(grid[i].length).fill('.')
  );

  let steps = 0;
  let position = startingPosition;
  let direction = startingDirection;

  do {
    // Copy the traversed value into the traversed grid
    traversed[position[0]][position[1]] = grid[position[0]][position[1]];

    const next = getNext(grid, position, direction);
    position = next.position;
    direction = next.direction;

    steps++;
  } while (
    position[0] !== startingPosition[0] ||
    position[1] !== startingPosition[1]
  );

  return { traversed, steps };
};

const getNext = (
  grid: string[][],
  position: [number, number],
  direction: Direction
): { position: [number, number]; direction: Direction } => {
  let nextPosition: [number, number];
  let nextShape: string;
  let nextDirection: Direction;

  switch (direction) {
    case Direction.Up:
      nextPosition = [position[0] - 1, position[1]];
      nextShape = grid[nextPosition[0]][nextPosition[1]];
      nextDirection =
        nextShape === '|'
          ? Direction.Up
          : nextShape === '7'
          ? Direction.Left
          : Direction.Right;
      break;

    case Direction.Right:
      nextPosition = [position[0], position[1] + 1];
      nextShape = grid[nextPosition[0]][nextPosition[1]];
      nextDirection =
        nextShape === '-'
          ? Direction.Right
          : nextShape === 'J'
          ? Direction.Up
          : Direction.Down;
      break;

    case Direction.Down:
      nextPosition = [position[0] + 1, position[1]];
      nextShape = grid[nextPosition[0]][nextPosition[1]];
      nextDirection =
        nextShape === '|'
          ? Direction.Down
          : nextShape === 'L'
          ? Direction.Right
          : Direction.Left;
      break;

    case Direction.Left:
      nextPosition = [position[0], position[1] - 1];
      nextShape = grid[nextPosition[0]][nextPosition[1]];
      nextDirection =
        nextShape === '-'
          ? Direction.Left
          : nextShape === 'L'
          ? Direction.Up
          : Direction.Down;
      break;
  }

  return { position: nextPosition, direction: nextDirection };
};

execute([part1, part2]);

// Part 1: 7093, took 9ms
// Part 2: 407, took 9ms
