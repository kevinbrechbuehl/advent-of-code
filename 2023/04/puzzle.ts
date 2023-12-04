// --- Day 4: Scratchcards ---
// https://adventofcode.com/2023/day/4

import { getInputByLine, execute } from '../utils';

const part1 = (): number => {
  return getInputByLine()
    .map((line) => getNumberOfMatches(line))
    .reduce((total, current) => {
      return current > 0 ? total + Math.pow(2, current - 1) : total;
    }, 0);
};

const part2 = (): number => {
  const sum = (input: number[]): number => {
    return input.reduce((total, currentValue) => total + currentValue, 0);
  };

  let cardCopies: number[] = [];

  getInputByLine()
    .map((line) => getNumberOfMatches(line))
    .map((matchingNumbers, index) => {
      cardCopies[index] = cardCopies[index] + 1 || 1;

      for (let i = index; i < index + matchingNumbers; i++) {
        cardCopies[i + 1] = cardCopies[i + 1]
          ? cardCopies[i + 1] + cardCopies[index]
          : cardCopies[index];
      }
    });

  return sum(cardCopies);
};

const getNumberOfMatches = (line: string): number => {
  const [w, m] = line.split(':')[1].trim().split('|');
  const winningNumbers = [...w.matchAll(/\d+/g)].map((n) => parseInt(n[0], 10));
  const myNumbers = [...m.matchAll(/\d+/g)].map((n) => parseInt(n[0], 10));

  return myNumbers.reduce((total, current) => {
    return winningNumbers.includes(current) ? total + 1 : total;
  }, 0);
};

execute([part1, part2]);

// Part 1: 20117, took 7ms
// Part 2: 13768818, took 3ms
