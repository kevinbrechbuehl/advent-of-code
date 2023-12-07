// --- Day 7: Camel Cards ---
// https://adventofcode.com/2023/day/7

import { execute, getInputByLine } from '../utils';

const part1 = (): number => {
  return getTotalWinnings(1);
};

const part2 = (): number => {
  return getTotalWinnings(2);
};

const getTotalWinnings = (part: 1 | 2): number => {
  return getInputByLine()
    .map((line) => {
      const [hand, bid] = line.split(' ');
      const handNumbers = parseHand(hand, part);
      const score = getScore(hand, part);
      return { hand: handNumbers, bid: parseInt(bid, 10), score };
    })
    .sort((a, b) => {
      if (a.score !== b.score) {
        return a.score - b.score;
      }

      for (let i = 0; ; i++) {
        if (a.hand[i] !== b.hand[i]) {
          return a.hand[i] - b.hand[i];
        }
      }
    })
    .reduce(
      (total, currentValue, index) => total + currentValue.bid * (index + 1),
      0
    );
};

const parseHand = (hand: string, part: 1 | 2): number[] => {
  const isDigit = (input: string): boolean => {
    return /^\d+$/g.test(input);
  };

  return hand.split('').map((char) => {
    if (isDigit(char)) {
      return parseInt(char, 10);
    }

    switch (char) {
      case 'T':
        return 10;
      case 'J':
        return part === 2 ? 0 : 11;
      case 'Q':
        return 12;
      case 'K':
        return 13;
      case 'A':
        return 14;
    }
  });
};

const getScore = (hand: string, part: 1 | 2): number => {
  const numbers: { [card: string]: number } = {};
  let jokers = part === 1 ? 0 : hand.match(/J/g)?.length || 0;

  for (const card of hand) {
    if (part === 1 || card !== 'J') {
      numbers[card] = (numbers[card] || 0) + 1;
    }
  }

  const commonNumbers = [...Object.values(numbers)].sort((a, b) => b - a);

  // Five of a kind   =>  3 * 5 + 0 = 15
  // Four of a kind   =>  3 * 4 + 1 = 13
  // Full house       =>  3 * 3 + 2 = 11
  // Three of a kind  =>  3 * 3 + 1 = 10
  // Two pair         =>  3 * 2 + 2 = 8
  // One pair         =>  3 * 2 + 1 = 7
  // High card        =>  3 * 1 + 1 = 4

  // And the joker always will be added to the most common number of cards
  return 3 * ((commonNumbers[0] || 0) + jokers) + (commonNumbers[1] || 0);
};

execute([part1, part2]);

// Part 1: 249483956, took 4ms
// Part 2: 252137472, took 3ms
