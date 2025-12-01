// ---- Day 1: Secret Entrance ---
// https://adventofcode.com/2025/day/1

import { getInputByLine, execute } from "../utils";

const part1 = (): number => {
  let password = 0;
  let dial = 50;

  getInputByLine().forEach((line) => {
    const direction = line[0];
    const distance = parseInt(line.slice(1), 10);

    const sign = direction === "L" ? -1 : 1;
    dial = (dial + sign * distance + 100) % 100;

    if (dial === 0) {
      password++;
    }
  });

  return password;
};

const part2 = (): number => {
  let password = 0;
  let dial = 50;

  getInputByLine().forEach((line) => {
    const direction = line[0];
    const distance = parseInt(line.slice(1), 10);

    const step = direction === "L" ? -1 : 1;
    for (let i = 0; i < distance; i++) {
      dial = (dial + step + 100) % 100;
      if (dial === 0) {
        password++;
      }
    }
  });

  return password;
};

execute([part1, part2]);

// Part 1: 1026, took 1ms
// Part 2: 5923, took 3ms
