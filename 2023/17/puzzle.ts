// --- Day 17: Clumsy Crucible ---
// https://adventofcode.com/2023/day/17

import { PriorityQueue } from '../types';
import { execute, getInputByLine } from '../utils';

enum Direction {
  Up,
  Down,
  Left,
  Right,
}

interface Block {
  row: number;
  col: number;
  direction: Direction;
  heatLoss: number;
  streak: number;
}

const part1 = (): number => {
  const grid = parseInput();

  return getMinimumHeatLoss(grid, 0, 3);
};

const part2 = (): number => {
  const grid = parseInput();

  return getMinimumHeatLoss(grid, 4, 10);
};

const parseInput = (): number[][] => {
  return getInputByLine().map((line) => line.split('').map(Number));
};

const getMinimumHeatLoss = (
  grid: number[][],
  minStreaks: number,
  maxStreaks: number
): number => {
  const cache = new Set<string>();

  // Use a priority queue and always take the
  // block with the lowest heat loss first.
  const queue = new PriorityQueue<Block>(
    (a: Block, b: Block) => b.heatLoss - a.heatLoss
  );

  queue.add({
    row: 0,
    col: 0,
    direction: Direction.Right,
    heatLoss: 0,
    streak: 0,
  });

  queue.add({
    row: 0,
    col: 0,
    direction: Direction.Down,
    heatLoss: 0,
    streak: 0,
  });

  let block: Block;

  while ((block = queue.poll())) {
    const { row, col, direction, heatLoss, streak } = block;

    // We reached the end -> current heat loss is the minimum
    if (row === grid.length - 1 && col === grid[0].length - 1) {
      return heatLoss;
    }

    if (streak < maxStreaks) {
      enqueueNextMove(grid, block, direction, queue, cache);
    }

    if (streak >= minStreaks) {
      if (direction === Direction.Up || direction === Direction.Down) {
        enqueueNextMove(grid, block, Direction.Left, queue, cache);
        enqueueNextMove(grid, block, Direction.Right, queue, cache);
      } else {
        enqueueNextMove(grid, block, Direction.Up, queue, cache);
        enqueueNextMove(grid, block, Direction.Down, queue, cache);
      }
    }
  }

  return -1;
};

const enqueueNextMove = (
  grid: number[][],
  block: Block,
  direction: Direction,
  queue: PriorityQueue<Block>,
  cache: Set<string>
): void => {
  const [nextRow, nextCol] = move(block.row, block.col, direction);

  // Next move would be out of the grid
  if (
    nextRow < 0 ||
    nextRow >= grid.length ||
    nextCol < 0 ||
    nextCol >= grid[0].length
  ) {
    return;
  }

  const nextBlock: Block = {
    row: nextRow,
    col: nextCol,
    direction: direction,
    heatLoss: block.heatLoss + grid[nextRow][nextCol],
    streak: block.direction === direction ? block.streak + 1 : 1,
  };

  const key = `${nextBlock.row},${nextBlock.col},${nextBlock.direction},${nextBlock.streak}`;
  if (cache.has(key)) {
    return;
  }

  queue.add(nextBlock);
  cache.add(key);
};

const move = (
  row: number,
  col: number,
  direction: Direction
): [number, number] => {
  switch (direction) {
    case Direction.Up:
      return [row - 1, col];
    case Direction.Right:
      return [row, col + 1];
    case Direction.Down:
      return [row + 1, col];
    case Direction.Left:
      return [row, col - 1];
  }
};

execute([part1, part2]);

// Part 1: 970, took 218ms
// Part 2: 1149, took 794ms
