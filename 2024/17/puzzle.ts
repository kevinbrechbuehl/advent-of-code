// --- Day 17: Chronospatial Computer ---
// https://adventofcode.com/2024/day/17

import { getInputByGroupOfLines, isSampleInput, execute } from "../utils";

let a = 0n;
let b = 0n;
let c = 0n;

let pointer = 0;
let program: bigint[] = [];
let output: bigint[] = [];

const part1 = (): string => {
  initializeInput(1);

  runProgram();

  return output.join(",");
};

// A difficult puzzle today that I couldn't solve completely on my own.
// Thanks to Simon (https://github.com/shoedler) and various users on
// Reddit for their explanations and code samples.
const part2 = (): bigint => {
  initializeInput(2);

  const searchInitialA = (currentA: bigint, i: number): bigint => {
    if (i < 0) {
      return currentA;
    }

    // Here is the magic. As the program only checks 3 bits, we can shift
    // the current value of a by 3 bits and check the 8 next possible values.
    for (let nextA = currentA << 3n; nextA < (currentA << 3n) + 8n; nextA++) {
      a = nextA;
      runProgram();

      if (output[0] === program[i]) {
        const finalA = searchInitialA(nextA, i - 1);
        if (finalA >= 0) {
          return finalA;
        }
      }
    }

    return -1n;
  };

  return searchInitialA(0n, program.length - 1);
};

const initializeInput = (part: 1 | 2) => {
  const fileName = isSampleInput() ? `sample${part}.txt` : "input.txt";
  const groups = getInputByGroupOfLines(fileName);

  // Only relevant parameters are "a" and "program", "b" and "c" are
  // always 0 and are reset during program execution.
  a = BigInt(groups[0][0].split(": ")[1]);
  program = groups[1][0].split(": ")[1].split(",").map(BigInt);
};

const runProgram = () => {
  pointer = 0;
  output = [];

  b = 0n; // initial value is always 0
  c = 0n; // initial value is always 0

  while (program[pointer] != null) {
    const instruction = program[pointer];
    const operand = program[pointer + 1];

    executeInstruction(instruction, operand);
  }
};

const executeInstruction = (instruction: bigint, operand: bigint): void => {
  switch (instruction) {
    case 0n:
      a = a / 2n ** combo(operand);
      pointer += 2;
      break;
    case 1n:
      b = b ^ operand;
      pointer += 2;
      break;
    case 2n:
      b = combo(operand) % 8n;
      pointer += 2;
      break;
    case 3n:
      if (a !== 0n) {
        pointer = Number(operand);
      } else {
        pointer += 2;
      }
      break;
    case 4n:
      b = b ^ c;
      pointer += 2;
      break;
    case 5n:
      output.push(combo(operand) % 8n);
      pointer += 2;
      break;
    case 6n:
      b = a / 2n ** combo(operand);
      pointer += 2;
      break;
    case 7n:
      c = a / 2n ** combo(operand);
      pointer += 2;
      break;
  }
};

const combo = (operand: bigint): bigint => {
  if (operand < 4n) return BigInt(operand);
  if (operand === 4n) return a;
  if (operand === 5n) return b;
  if (operand === 6n) return c;
};

execute([part1, part2]);

// Part 1: 3,6,3,7,0,7,0,3,0, took 1ms
// Part 2: 136904920099226, took 1ms
