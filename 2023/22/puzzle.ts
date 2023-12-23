// --- Day 22: Sand Slabs ---
// https://adventofcode.com/2023/day/22

import { execute, getInputByLine } from '../utils';

interface Brick {
  id: number;
  sx: number; // Starting X
  sy: number; // Starting Y
  sz: number; // Starting Z
  ex: number; // Ending X
  ey: number; // Ending Y
  ez: number; // Ending Z
}

const part1 = (): number => {
  const bricks = settle(parseInput());
  const bricksPerZ = getBricksPerZ(bricks);

  return bricks
    .map((brick) => (canRemoveBrick(brick, bricksPerZ) ? 1 : 0))
    .reduce((total, currentValue) => total + currentValue, 0);
};

const part2 = (): number => {
  const bricks = settle(parseInput());

  let sum = 0;

  for (let i = 0; i < bricks.length; i++) {
    // Make a copy of the bricks without element "i".
    // We could also use "structuredClone()" and then "splice()",
    // but this is way faster than doing it manually.
    const bricksRemoved: Brick[] = [];
    bricks.forEach((brick, index) => {
      if (i !== index) {
        bricksRemoved.push({ ...brick });
      }
    });

    // Now settle the new bricks
    settle(bricksRemoved);

    // Count the number of bricks where Z is not equal
    // to the original brick (means that is has been
    // fallen down)
    for (let j = i; j < bricks.length - 1; j++) {
      if (bricks[j + 1].ez !== bricksRemoved[j].ez) {
        sum++;
      }
    }
  }

  return sum;
};

// Sorted by Z
const parseInput = (): Brick[] => {
  return getInputByLine()
    .map((line, i) => {
      const [start, end] = line.split('~');
      const [sx, sy, sz] = start.split(',').map(Number);
      const [ex, ey, ez] = end.split(',').map(Number);
      return { id: i, sx, sy, sz, ex, ey, ez };
    })
    .sort((a, b) => a.sz - b.sz);
};

const settle = (bricks: Brick[]): Brick[] => {
  // Highest Z for each x/y
  const highestZ: { [key: string]: number } = {};

  bricks.forEach((brick) => {
    const brickHeight = brick.ez - brick.sz + 1;

    // Adjust current highest Z for each x/y
    for (let x = brick.sx; x <= brick.ex; x++) {
      for (let y = brick.sy; y <= brick.ey; y++) {
        const current = highestZ[`${x},${y}`] ?? 0;
        highestZ[`${x},${y}`] = current + brickHeight;
      }
    }

    // Get the available Z which the current brick can fall to
    let availableZ = 0;
    for (let x = brick.sx; x <= brick.ex; x++) {
      for (let y = brick.sy; y <= brick.ey; y++) {
        availableZ = Math.max(availableZ, highestZ[`${x},${y}`]);
      }
    }

    // Set available Z Z as all highest Z for each x/y
    for (let x = brick.sx; x <= brick.ex; x++) {
      for (let y = brick.sy; y <= brick.ey; y++) {
        highestZ[`${x},${y}`] = availableZ;
      }
    }

    // Let the brick fall down to the lowest Z
    const fallHeight = brick.ez - availableZ;
    brick.sz -= fallHeight;
    brick.ez -= fallHeight;
  });

  return bricks;
};

const getBricksPerZ = (bricks: Brick[]): Brick[][] => {
  const bricksPerZ: Brick[][] = [];

  bricks.forEach((brick) => {
    for (let z = brick.sz; z <= brick.ez; z++) {
      if (!bricksPerZ[z]) {
        bricksPerZ[z] = [];
      }

      bricksPerZ[z].push(brick);
    }
  });

  // We will check above and below bricks later, so initialize
  // them to avoid null reference exception
  bricksPerZ[0] = [];
  bricksPerZ[bricksPerZ.length] = [];

  return bricksPerZ;
};

// Check every brick above which is suported by the current brick. For
// each of them, check again all bricks below which are supporting it.
// If any other brick than the current is supporting, the current can be
// removed.
const canRemoveBrick = (brick: Brick, bricksPerZ: Brick[][]): boolean => {
  for (let i = 0; i < bricksPerZ[brick.ez + 1].length; i++) {
    const above = bricksPerZ[brick.ez + 1][i];
    if (!isBrickSupportedByOther(above, brick)) {
      continue;
    }

    var hasOtherSupport = bricksPerZ[above.sz - 1]
      .filter((below) => below.id !== brick.id)
      .some((below) => isBrickSupportedByOther(above, below));

    if (!hasOtherSupport) {
      return false;
    }
  }

  return true;
};

const isBrickSupportedByOther = (brick: Brick, other: Brick): boolean => {
  return (
    brick.sx <= other.ex &&
    brick.ex >= other.sx &&
    brick.sy <= other.ey &&
    brick.ey >= other.sy &&
    brick.sz === other.ez + 1
  );
};

execute([part1, part2]);

// Part 1: 471, took 9ms
// Part 2: 68525, took 1.423s
