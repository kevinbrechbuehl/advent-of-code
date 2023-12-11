// --- Day 11: Cosmic Expansion ---
// https://adventofcode.com/2023/day/11

import { execute, getInputByLine } from '../utils';

const part1 = (): number => {
  const galaxies = getGalaxies(2);
  return getDistance(galaxies);
};

const part2 = (): number => {
  const galaxies = getGalaxies(1_000_000);
  return getDistance(galaxies);
};

const getGalaxies = (expansion: number): { row: number; col: number }[] => {
  const universe = getInputByLine().map((line) => line.split(''));
  const galaxies: { row: number; col: number }[] = [];

  const isEmptyRow = (row: number): boolean => {
    return universe[row].every((c) => c !== '#');
  };

  const isEmptyCol = (col: number): boolean => {
    return universe.every((line) => line[col] !== '#');
  };

  let emptyRows = 0;

  for (let row = 0; row < universe.length; row++) {
    let emptyCols = 0;

    if (isEmptyRow(row)) {
      emptyRows += expansion - 1;
    }

    for (let col = 0; col < universe[row].length; col++) {
      if (isEmptyCol(col)) {
        emptyCols += expansion - 1;
      }

      if (universe[row][col] === '#') {
        galaxies.push({ row: row + emptyRows, col: col + emptyCols });
      }
    }
  }

  return galaxies;
};

const getDistance = (galaxies: { row: number; col: number }[]): number => {
  let sum = 0;

  for (let i = 0; i < galaxies.length; i++) {
    const first = galaxies[i];
    for (let j = i + 1; j < galaxies.length; j++) {
      const second = galaxies[j];
      const rowDistance = Math.abs(first.row - second.row);
      const colDistance = Math.abs(first.col - second.col);
      sum += rowDistance + colDistance;
    }
  }

  return sum;
};

execute([part1, part2]);

// Part 1: 9639160, took 10ms
// Part 2: 752936133304, took 8ms
