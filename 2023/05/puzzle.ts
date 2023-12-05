// --- Day 5: If You Give A Seed A Fertilizer ---
// https://adventofcode.com/2023/day/5

import { execute, getInputByGroupOfLines } from '../utils';

// Brute force to find all the locations and return the minimum location found
const part1 = (): number => {
  const { seeds, maps } = parseInput();
  const locations = seeds.map((seed) => getLocation(seed, maps));
  return Math.min(...locations);
};

// Calculate seed for each location in reserve order and return the first valid seed
const part2 = (): number => {
  const { seeds, maps } = parseInput();
  for (let i = 0; i < Infinity; i++) {
    const seed = getSeed(i, maps);
    if (isValidSeed(seed, seeds)) {
      return i;
    }
  }

  return -1;
};

const parseInput = (): { seeds: number[]; maps: number[][][] } => {
  const input = getInputByGroupOfLines();
  const seeds = input[0][0].split(': ')[1].split(' ').map(Number);
  const maps = input
    .slice(1)
    .map((map) => map.slice(1).map((range) => range.split(' ').map(Number)));

  return { seeds, maps };
};

const getLocation = (seed: number, maps: number[][][]): number => {
  let current = seed;
  for (const map of maps) {
    for (const range of map) {
      const [destination, source, length] = range;
      if (source <= current && source + length > current) {
        current = destination + current - source;
        break;
      }
    }
  }

  return current;
};

const getSeed = (location: number, maps: number[][][]): number => {
  let current = location;
  for (const map of [...maps].reverse()) {
    for (const range of map) {
      const [destination, source, length] = range;
      if (destination <= current && destination + length > current) {
        current = source + current - destination;
        break;
      }
    }
  }

  return current;
};

const isValidSeed = (seed: number, seeds: number[]): boolean => {
  for (let i = 0; i < seeds.length; i += 2) {
    if (seed >= seeds[i] && seed <= seeds[i] + seeds[i + 1]) {
      return true;
    }
  }

  return false;
};

execute([part1, part2]);

// Part 1: 174137457, took 1ms
// Part 2: 1493866, took 5.371s
