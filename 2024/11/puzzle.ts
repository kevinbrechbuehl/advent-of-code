// --- Day 11: Plutonian Pebbles ---
// https://adventofcode.com/2024/day/11

import { getInput, execute } from "../utils";

const part1 = (): bigint => {
  return blink(25);
};

const part2 = (): bigint => {
  return blink(75);
};

const blink = (numberOfIterations: number): bigint => {
  let stones = parseInput();

  Array.from({ length: numberOfIterations }).forEach((_) => {
    const newStones = new Map<bigint, bigint>();
    for (const [stone, count] of stones) {
      const stoneNumberLength = stone.toString().length;

      if (stone === 0n) {
        addStone(newStones, 1n, count);
      } else if (stoneNumberLength % 2 === 0) {
        const left = BigInt(stone.toString().slice(0, stoneNumberLength / 2));
        addStone(newStones, left, count);

        const right = BigInt(stone.toString().slice(stoneNumberLength / 2));
        addStone(newStones, right, count);
      } else {
        const value = stone * 2024n;
        addStone(newStones, value, count);
      }
    }

    stones = new Map(newStones);
  });

  const stoneValues = Array.from(stones.values());
  return stoneValues.reduce((total, currentValue) => total + currentValue, 0n);
};

const parseInput = (): Map<bigint, bigint> => {
  let stones = new Map<bigint, bigint>();

  getInput()
    .split(" ")
    .map(BigInt)
    .forEach((stone) => {
      addStone(stones, stone, 1n);
    });

  return stones;
};

const addStone = (
  stones: Map<bigint, bigint>,
  stone: bigint,
  count: bigint
) => {
  stones.set(stone, (stones.get(stone) ?? 0n) + count);
};

execute([part1, part2]);

// Part 1: 218079, took 1ms
// Part 2: 259755538429618, took 27ms
