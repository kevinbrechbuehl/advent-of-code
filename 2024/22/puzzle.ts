// --- Day 22: Monkey Market ---
// https://adventofcode.com/2024/day/22

import { getInputByLine, execute } from "../utils";

const part1 = (): number => {
  return parseInput()
    .map((secretNumber) => {
      for (let i = 0; i < 2000; i++) {
        secretNumber = evolve(secretNumber);
      }
      return Number(secretNumber);
    })
    .reduce((total, currentValue) => total + currentValue, 0);
};

const part2 = (): number => {
  const bananas = new Map<string, number>();

  for (let secretNumber of parseInput()) {
    const visited = new Set<string>();
    const changes: number[] = [];

    for (let i = 0; i < 2000; i++) {
      const nextSecretNumber = evolve(secretNumber);
      changes.push(Number((nextSecretNumber % 10n) - (secretNumber % 10n)));
      secretNumber = nextSecretNumber;

      if (changes.length === 4) {
        const key = changes.join(",");
        if (!visited.has(key)) {
          visited.add(key);
          bananas[key] = (bananas[key] || 0) + Number(nextSecretNumber % 10n);
        }
        changes.shift();
      }
    }
  }

  return Math.max(...Object.values(bananas));
};

const parseInput = (): bigint[] => {
  return getInputByLine().map(BigInt);
};

const evolve = (secretNumber: bigint): bigint => {
  secretNumber = ((secretNumber * 64n) ^ secretNumber) % 16777216n;
  secretNumber = ((secretNumber / 32n) ^ secretNumber) % 16777216n;
  secretNumber = ((secretNumber * 2048n) ^ secretNumber) % 16777216n;

  return secretNumber;
};

execute([part1, part2]);

// Part 1: 20332089158, took 70ms
// Part 2: 2191, took 1.031s
