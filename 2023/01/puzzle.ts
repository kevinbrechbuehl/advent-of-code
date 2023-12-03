// --- Day 1: Trebuchet?! ---
// https://adventofcode.com/2023/day/1

import { getInputByLine, isSampleInput, execute } from '../utils';

const part1 = (): number => {
  var digits = {
    '1': '1',
    '2': '2',
    '3': '3',
    '4': '4',
    '5': '5',
    '6': '6',
    '7': '7',
    '8': '8',
    '9': '9',
  };

  return getCalibrationCode(1, digits);
};

const part2 = (): number => {
  var digits = {
    '1': '1',
    '2': '2',
    '3': '3',
    '4': '4',
    '5': '5',
    '6': '6',
    '7': '7',
    '8': '8',
    '9': '9',
    one: '1',
    two: '2',
    three: '3',
    four: '4',
    five: '5',
    six: '6',
    seven: '7',
    eight: '8',
    nine: '9',
  };

  return getCalibrationCode(2, digits);
};

const getCalibrationCode = (
  part: 1 | 2,
  digits: { [key: string]: string }
): number => {
  // We have different sample inputs for the two parts
  const fileName = isSampleInput() ? `sample${part}.txt` : 'input.txt';

  return getInputByLine(fileName)
    .map((line) => {
      // Use a Map here, because I can't sort an object by it's numeric key
      const numbers = new Map<number, string>();

      for (const [key, value] of Object.entries(digits)) {
        let index = line.indexOf(key);
        while (index > -1) {
          numbers.set(index, value);
          index = line.indexOf(key, index + 1);
        }
      }

      // Return an array with all numbers found, in the order they were found
      return Array.from(numbers)
        .sort(([a], [b]) => a - b)
        .map((value) => value[1]);
    })
    .map((numbers) => parseInt(numbers[0] + numbers[numbers.length - 1], 10))
    .reduce((total, currentValue) => total + currentValue);
};

execute([part1, part2]);

// Part 1: 53386, took 4ms
// Part 2: 53312, took 5ms
