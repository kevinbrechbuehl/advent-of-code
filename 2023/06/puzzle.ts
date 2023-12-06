// --- Day 6: Wait For It ---
// https://adventofcode.com/2023/day/6

import { execute, getInputByLine } from '../utils';

const part1 = (): number => {
  const input = getInputByLine();
  const times = [...input[0].matchAll(/\d+/g)].map(Number);
  const distances = [...input[1].matchAll(/\d+/g)].map(Number);

  return times
    .map((time, race) => getNumberOfWinsForRace(time, distances[race]))
    .reduce((total, currentValue) => total * currentValue, 1);
};

const part2 = (): number => {
  const input = getInputByLine();
  const time = parseInt(input[0].replaceAll(' ', '').split(':')[1], 10);
  const distance = parseInt(input[1].replaceAll(' ', '').split(':')[1], 10);

  return getNumberOfWinsForRace(time, distance);
};

const getNumberOfWinsForRace = (time: number, distance: number): number => {
  let wins = 0;

  for (let i = 1; i < time - 1; i++) {
    const reached = (time - i) * i;
    if (reached > distance) {
      wins++;
    }
  }

  return wins;
};

execute([part1, part2]);

// Part 1: 633080, took 0ms
// Part 2: 20048741, took 40ms
