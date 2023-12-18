// --- Day 18: Lavaduct Lagoon ---
// https://adventofcode.com/2023/day/18

import { execute, getInputByLine } from '../utils';

const directions = {
  R: [0, 1],
  D: [1, 0],
  L: [0, -1],
  U: [-1, 0],
};

const part1 = (): number => {
  return getLagoonSize(1);
};

const part2 = (): number => {
  return getLagoonSize(2);
};

const getLagoonSize = (part: 1 | 2): number => {
  const { corners, borderLength } = traverse(part);

  // Use Shoelace formula to calculate the area of a polygon
  // https://en.m.wikipedia.org/wiki/Shoelace_formula#Triangle_formula
  const interiorArea = getInteriorArea(corners);

  // Use pick's theorem formula to calculate the inner points of a polygon
  // https://en.wikipedia.org/wiki/Pick%27s_theorem
  const points = getInnerPoints(interiorArea, borderLength);

  return points + borderLength;
};

const traverse = (
  part: 1 | 2
): { corners: number[][]; borderLength: number } => {
  const corners: number[][] = [];

  let borderLength = 0;
  let current = [0, 0];

  getInputByLine().forEach((line) => {
    const { meters, direction } = parseLine(part, line);
    const delta = directions[direction];

    for (var i = 0; i < meters; i++) {
      current = [current[0] + delta[0], current[1] + delta[1]];
    }

    corners.push([current[0], current[1]]);
    borderLength += meters;
  });

  return { corners, borderLength };
};

const parseLine = (
  part: 1 | 2,
  line: string
): { meters: number; direction: string } => {
  const matches = line.match(/^([URDL]{1}) (\d+) \(#(.*)\)$/);

  if (part === 1) {
    return { meters: parseInt(matches[2], 10), direction: matches[1] };
  } else {
    return {
      meters: parseInt('0x' + matches[3].substring(0, 5), 16),
      direction: mapDirection(matches[3].substring(5)),
    };
  }
};

const mapDirection = (direction: string): string => {
  switch (direction) {
    case '0':
      return 'R';
    case '1':
      return 'D';
    case '2':
      return 'L';
    case '3':
      return 'U';
  }
};

const getInteriorArea = (corners: number[][]): number => {
  let area = 0;
  for (let i = 0; i < corners.length; i++) {
    var j = i === corners.length - 1 ? 0 : i + 1;
    area += corners[i][0] * corners[j][1] - corners[i][1] * corners[j][0];
  }

  return Math.abs(area / 2);
};

const getInnerPoints = (area: number, borderLength: number): number => {
  return area - borderLength / 2 + 1;
};

execute([part1, part2]);

// Part 1: 35401, took 2ms
// Part 2: 48020869073824, took 1.182s
