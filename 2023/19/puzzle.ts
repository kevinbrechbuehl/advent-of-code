// --- Day 19: Aplenty ---
// https://adventofcode.com/2023/day/19

import { execute, getInputByGroupOfLines } from '../utils';

interface Rule {
  left?: string;
  operator?: string;
  right?: number;
  result: string;
}

const part1 = (): number => {
  const input = getInputByGroupOfLines();

  const workflows = parseWorkflows(input[0]);
  const parts = input[1];

  return parts
    .map((part) => getRatingNumber(workflows, part))
    .reduce((total, currentValue) => total + currentValue, 0);
};

const part2 = (): number => {
  const input = getInputByGroupOfLines();
  const workflows = parseWorkflows(input[0]);

  return getRatingCombinations(workflows, 'in');
};

const parseWorkflows = (input: string[]): { [key: string]: Rule[] } => {
  const workflows: { [key: string]: Rule[] } = {};

  input.forEach((line) => {
    const [name, rules] = line.substring(0, line.length - 1).split('{');
    workflows[name] = rules.split(',').map((rule) => {
      if (rule.includes(':')) {
        const [condition, result] = rule.split(':');
        if (condition.includes('<')) {
          const [left, right] = condition.split('<');
          return { left, operator: '<', right: Number(right), result };
        } else {
          const [left, right] = condition.split('>');
          return { left, operator: '>', right: Number(right), result };
        }
      } else {
        return { result: rule };
      }
    });
  });

  return workflows;
};

const getRatingNumber = (
  workflows: { [key: string]: Rule[] },
  part: string
): number => {
  const groups = part.match(/{x=(\d+),m=(\d+),a=(\d+),s=(\d+)}/).map(Number);

  const categories = {
    x: groups[1],
    m: groups[2],
    a: groups[3],
    s: groups[4],
  };

  let workflow = 'in';
  while (true) {
    // We reached the end
    if (workflow === 'R') {
      return 0;
    } else if (workflow === 'A') {
      return categories.x + categories.m + categories.a + categories.s;
    }

    // Execute each rule until a condition is met
    const rules = workflows[workflow];
    for (let i = 0; i < rules.length; i++) {
      const rule = rules[i];
      if (rule.operator === '>') {
        if (categories[rule.left] > rule.right) {
          workflow = rule.result;
          break;
        }
      } else if (rule.operator === '<') {
        if (categories[rule.left] < rule.right) {
          workflow = rule.result;
          break;
        }
      } else {
        workflow = rule.result;
        break;
      }
    }
  }
};

const getRatingCombinations = (
  workflows: { [key: string]: Rule[] },
  name: string,
  ranges = { x: [1, 4000], m: [1, 4000], a: [1, 4000], s: [1, 4000] }
): number => {
  // If accepted, return the product of all ranges
  if (name === 'A') {
    return Object.values(ranges)
      .map((range) => range[1] - range[0] + 1)
      .reduce((total, currentValue) => total * currentValue, 1);
  }

  // If rejected, return no valid combination
  if (name === 'R') {
    return 0;
  }

  let sum = 0;
  const workflow = workflows[name];

  workflow.forEach((rule) => {
    if (!rule.operator) {
      // We don't have a condition, so go ahead with the same ranges
      sum += getRatingCombinations(workflows, rule.result, ranges);
    } else {
      const range = ranges[rule.left];

      // If the right part of the condition is within the current range
      // we can go ahead and narrow down ranges
      if (range[0] < rule.right < range[1]) {
        const newRanges = { ...ranges };

        if (rule.operator === '>') {
          newRanges[rule.left] = [rule.right + 1, range[1]];
          ranges[rule.left] = [range[0], rule.right];
        } else {
          newRanges[rule.left] = [range[0], rule.right - 1];
          ranges[rule.left] = [rule.right, range[1]];
        }

        sum += getRatingCombinations(workflows, rule.result, newRanges);
      }
    }
  });

  return sum;
};

execute([part1, part2]);

// Part 1: 418498, took 3ms
// Part 2: 123331556462603, took 2ms
