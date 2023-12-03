// --- Day 2: Cube Conundrum ---
// https://adventofcode.com/2023/day/2

import { execute, getInputByLine } from '../utils';

interface Game {
  id: number;
  cubes: { [key: string]: number };
}

const part1 = (): number => {
  const maxAvailable = { red: 12, green: 13, blue: 14 };

  return parseInput()
    .map((game) => {
      const isGameImpossible = Object.entries(maxAvailable).some((value) => {
        return game.cubes[value[0]] > value[1];
      });

      return isGameImpossible ? 0 : game.id;
    })
    .reduce((total, currentValue) => total + currentValue, 0);
};

const part2 = (): number => {
  const multiply = (input: number[]): number => {
    return input.reduce((total, currentValue) => total * currentValue, 1);
  };

  return parseInput()
    .map((game) => multiply(Object.values(game.cubes)))
    .reduce((total, currentValue) => total + currentValue, 0);
};

// Return the maximum number of cubes for each color and game
const parseInput = (): Game[] => {
  return getInputByLine().map((line) => {
    const [game, sets] = line.split(':');

    const gameId = parseInt(game.split(' ')[1], 10);

    const maxCubes: { [key: string]: number } = {};
    sets.split(';').forEach((set) => {
      set.split(',').forEach((cubes) => {
        const [count, color] = cubes.trim().split(' ');
        maxCubes[color] = Math.max(maxCubes[color] ?? 0, parseInt(count, 10));
      });
    });

    return { id: gameId, cubes: maxCubes };
  });
};

execute([part1, part2]);

// Part 1: 2256, took 2ms
// Part 2: 74229, took 1ms
