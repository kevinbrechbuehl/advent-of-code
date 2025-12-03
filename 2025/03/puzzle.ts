// --- Day 3: Lobby ---
// https://adventofcode.com/2025/day/3

import { getInputByLine, execute } from "../utils";

const part1 = (): number => {
  return getTotalJoltage(2);
};

const part2 = (): number => {
  return getTotalJoltage(12);
};

const getTotalJoltage = (numberOfBatteries: number): number => {
  return getInputByLine()
    .map((line) => getLargestJoltage(line, numberOfBatteries))
    .reduce((total, current) => total + current, 0);
};

const getLargestJoltage = (bank: string, numberOfBatteries: number): number => {
  const batteries = bank.split("").map(Number);
  const result: number[] = [];

  let start = 0;
  let end = batteries.length - numberOfBatteries;

  for (let remaining = numberOfBatteries; remaining > 0; remaining--) {
    let bestIndex = start;
    for (let i = start; i <= end; i++) {
      if (batteries[i] > batteries[bestIndex]) {
        bestIndex = i;
      }
    }

    result.push(batteries[bestIndex]);

    start = bestIndex + 1;
    end = end + 1;
  }

  return parseInt(result.join(""), 0);
};

execute([part1, part2]);

// Part 1: 17092, took 1ms
// Part 2: 170147128753455, took 1ms
