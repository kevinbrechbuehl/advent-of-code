// --- Day 6: Trash Compactor ---
// https://adventofcode.com/2025/day/6

import { getInputByLine, execute } from "../utils";

const part1 = (): number => {
  const input = getInputByLine().map((line) => line.trim().split(/\s+/));

  let grandTotal = 0;

  for (let col = 0; col < input[0].length; col++) {
    let operator = input[input.length - 1][col];
    let problemAnswer = operator === "+" ? 0 : 1;
    for (let row = 0; row < input.length - 1; row++) {
      if (operator === "+") {
        problemAnswer += parseInt(input[row][col], 10);
      } else {
        problemAnswer *= parseInt(input[row][col], 10);
      }
    }

    grandTotal += problemAnswer;
  }

  return grandTotal;
};

// The difficult part of this puzzle is to analyze the input correctly.
// My idea is to find out the length of each problem and then go through
// each column of the whole input accordingly. The digits from each row
// are combined into a complete number and then the operation is performed.
const part2 = (): number => {
  const input = getInputByLine();

  // Add a " " at the end to always have a separator at the end
  const operatorsLine = input[input.length - 1] + " ";

  // Get a list of problems with their operator and number length
  const problems = [...operatorsLine.matchAll(/([+*])(\s*)/g)].map((m) => ({
    operator: m[1],
    length: m[2].length,
  }));

  let grandTotal = 0;
  let col = 0;

  for (const problem of problems) {
    let problemAnswer = problem.operator === "+" ? 0 : 1;

    // Loop through the number of digits in the problem
    for (let i = 0; i < problem.length; i++) {
      let problemNumber = "";
      for (let row = 0; row < input.length - 1; row++) {
        problemNumber += input[row][col];
      }

      if (problem.operator === "+") {
        problemAnswer += parseInt(problemNumber, 10);
      } else {
        problemAnswer *= parseInt(problemNumber, 10);
      }

      col++;
    }

    // Skip  one column as a new problem starts after a space
    col++;

    grandTotal += problemAnswer;
  }

  return grandTotal;
};

execute([part1, part2]);

// Part 1: 6371789547734, took 1ms
// Part 2: 11419862653216, took 1ms
