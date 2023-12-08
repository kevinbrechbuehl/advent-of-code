// --- Day 8: Haunted Wasteland ---
// https://adventofcode.com/2023/day/8

import { execute, getInputByGroupOfLines, isSampleInput } from '../utils';

const part1 = (): number => {
  const { instructions, network } = parseInput(1);

  let steps = 0;
  let current = 'AAA';

  while (current !== 'ZZZ') {
    for (let i = 0; i < instructions.length; i++) {
      const node: [string, string] = network[current];
      current = instructions[i] === 'L' ? node[0] : node[1];
      steps++;

      if (current === 'ZZZ') {
        return steps;
      }
    }
  }

  return -1;
};

const part2 = (): number => {
  const { instructions, starts, network } = parseInput(2);

  const ghostSteps: number[] = [];

  for (let i = 0; i < starts.length; i++) {
    let steps = 0;
    let current = starts[i];

    while (current.split('')[2] !== 'Z') {
      for (let j = 0; j < instructions.length; j++) {
        const node: [string, string] = network[current];
        current = instructions[j] === 'L' ? node[0] : node[1];
        steps++;

        if (current.split('')[2] === 'Z') {
          break;
        }
      }
    }

    ghostSteps[i] = steps;
  }

  // Greatest common divisor
  const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));

  // Least common multiple
  const lcm = (a: number, b: number): number => (a * b) / gcd(a, b);

  return ghostSteps.reduce(lcm);
};

const parseInput = (
  part: 1 | 2
): {
  instructions: string[];
  starts: string[];
  network: Map<string, [string, string]>;
} => {
  // We have different sample inputs for the two parts
  const fileName = isSampleInput() ? `sample${part}.txt` : 'input.txt';
  const input = getInputByGroupOfLines(fileName);

  const starts = part === 1 ? ['AAA'] : [];

  const instructions = input[0][0].split('');

  const network = new Map<string, [string, string]>();
  input[1].forEach((line) => {
    const parts = line.match(/[A-Z\d]+/g);
    const key = parts[0];
    network[key] = [parts[1], parts[2]];

    if (part === 2 && key.split('')[2] === 'A') {
      starts.push(key);
    }
  });

  return { instructions, starts, network };
};

execute([part1, part2]);

// Part 1: 21797, took 3ms
// Part 2: 23977527174353, took 17ms
