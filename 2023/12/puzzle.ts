// --- Day 12: Hot Springs ---
// https://adventofcode.com/2023/day/12

import { execute, getInputByLine } from '../utils';

interface Record {
  springs: string;
  groups: number[];
}

const part1 = (): number => {
  return parseInput()
    .map((record) => getPossibleArrangements(record.springs, record.groups))
    .reduce((total, currentValue) => total + currentValue, 0);
};

const part2 = (): number => {
  return parseInput()
    .map((record) => {
      const springs = Array(5).fill(record.springs).join('?');
      const groups = Array(5).fill(record.groups).flat();

      return getPossibleArrangements(springs, groups);
    })
    .reduce((total, currentValue) => total + currentValue, 0);
};

const memoize = <Args extends unknown[], Result>(
  func: (...args: Args) => Result
): ((...args: Args) => Result) => {
  const cache = new Map<string, Result>();

  return (...args) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key)!;
    }

    const result = func(...args);
    cache.set(key, result);
    return result;
  };
};

// I really had troubles with this one and searched for inspiration.
// This implementation seemed very clear to me, therefor I took it
// as a base for my implementation. Thanks a lot!
// https://github.com/shemetz/advent_of_code_2023/blob/main/day12.py
const getPossibleArrangements = memoize(
  (springs: string, groups: number[]): number => {
    // We reached the final run and we only have a match
    // if there are no groups left as well
    if (springs.length === 0) {
      return groups.length === 0 ? 1 : 0;
    }

    // It could be both => calculate both ways
    if (springs.charAt(0) === '?') {
      return (
        getPossibleArrangements(springs.replace('?', '.'), groups) +
        getPossibleArrangements(springs.replace('?', '#'), groups)
      );
    }

    // Skip current spring and go ahead with the next one
    if (springs.charAt(0) === '.') {
      return getPossibleArrangements(springs.substring(1), groups);
    }

    // Possible match for the current spring => make other checks
    if (springs.charAt(0) === '#') {
      // If we have no groups left, we don't have a match
      if (groups.length === 0) {
        return 0;
      }

      // If we have less springs than required for the current group, we don't have a match
      if (springs.length < groups[0]) {
        return 0;
      }

      // If springs can't be damages, we don't have a match
      if (springs.substring(0, groups[0]).indexOf('.') > -1) {
        return 0;
      }

      if (groups.length > 1) {
        // If the spring after the current group is already damaged, we don't have a match
        if (springs.charAt(groups[0]) === '#') {
          return 0;
        }

        // Match for the current group => go ahead with the next
        return getPossibleArrangements(
          springs.substring(groups[0] + 1),
          groups.slice(1)
        );
      }

      // Match and only one group left => go ahead with the last one
      return getPossibleArrangements(
        springs.substring(groups[0]),
        groups.slice(1)
      );
    }

    return 0;
  }
);

const parseInput = (): Record[] => {
  return getInputByLine().map((line) => {
    const [springs, groups] = line.split(' ');
    return {
      springs,
      groups: groups.split(',').map(Number),
    };
  });
};

execute([part1, part2]);

// Part 1: 7490, took 27ms
// Part 2: 65607131946466, took 1.131s
