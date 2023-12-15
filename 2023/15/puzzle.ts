// --- Day 15: Lens Library ---
// https://adventofcode.com/2023/day/15

import { execute, getInput } from '../utils';

interface Box {
  label: string;
  focalLength: number;
}

const part1 = (): number => {
  return parseInput()
    .map((step) => getHash(step))
    .reduce((total, currentValue) => total + currentValue, 0);
};

const part2 = (): number => {
  // Prepare boxes
  const boxes: Box[][] = [];
  for (let i = 0; i < 256; i++) {
    boxes[i] = [];
  }

  // Fill boxes
  parseInput().forEach((step) => {
    if (step.endsWith('-')) {
      const label = step.substring(0, step.length - 1);
      const boxNumber = getHash(label);

      const index = boxes[boxNumber].findIndex((b) => b.label === label);
      if (index > -1) {
        boxes[boxNumber].splice(index, 1);
      }
    } else {
      const [label, length] = step.split('=');
      const focalLength = parseInt(length, 10);
      const boxNumber = getHash(label);

      const index = boxes[boxNumber].findIndex((b) => b.label === label);
      if (index > -1) {
        boxes[boxNumber][index] = { label, focalLength };
      } else {
        boxes[boxNumber].push({ label, focalLength });
      }
    }
  });

  // Calculate total focusing power
  let sum = 0;

  for (let i = 0; i < boxes.length; i++) {
    for (let j = 0; j < boxes[i].length; j++) {
      sum += (i + 1) * (j + 1) * boxes[i][j].focalLength;
    }
  }

  return sum;
};

const parseInput = (): string[] => {
  return getInput().split(',');
};

const getHash = (step: string): number => {
  let value = 0;

  step.split('').forEach((char) => {
    value += char.charCodeAt(0);
    value *= 17;
    value %= 256;
  });

  return value;
};

execute([part1, part2]);

// Part 1: 514639, took 3ms
// Part 2: 279470, took 3ms
