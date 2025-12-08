// --- Day 8: Playground ---
// https://adventofcode.com/2025/day/8

import { getInputByLine, isSampleInput, execute } from "../utils";

type Box = {
  x: number;
  y: number;
  z: number;
};

type Pair = {
  a: Box;
  b: Box;
  distance: number;
};

const part1 = (): number => {
  const numberOfConnections = isSampleInput() ? 10 : 1000;

  const boxes = parseInput();
  const pairs = connectBoxes(boxes);
  const circuits = boxes.map((b) => new Set<Box>([b]));

  for (let i = 0; i < numberOfConnections; i++) {
    mergeCircuits(circuits, pairs[i]);
  }

  circuits.sort((a, b) => b.size - a.size);

  return circuits[0].size * circuits[1].size * circuits[2].size;
};

const part2 = (): number => {
  const boxes = parseInput();
  const pairs = connectBoxes(boxes);
  const circuits = boxes.map((b) => new Set<Box>([b]));

  let i = 0;
  while (circuits[0].size < boxes.length) {
    mergeCircuits(circuits, pairs[++i]);
  }

  return pairs[i].a.x * pairs[i].b.x;
};

const parseInput = (): Box[] => {
  return getInputByLine().map((line) => {
    const [x, y, z] = line.split(",").map(Number);
    return { x, y, z };
  });
};

const connectBoxes = (boxes: Box[]): Pair[] => {
  const pairs: Pair[] = [];

  for (let i = 0; i < boxes.length; i++) {
    for (let j = i + 1; j < boxes.length; j++) {
      const a = boxes[i];
      const b = boxes[j];
      const distance = getDistance(a, b);

      pairs.push({ a, b, distance });
    }
  }

  return pairs.sort((a, b) => a.distance - b.distance);
};

const getDistance = (a: Box, b: Box): number => {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  const dz = a.z - b.z;

  return Math.sqrt(dx * dx + dy * dy + dz * dz);
};

const mergeCircuits = (circuits: Set<Box>[], pair: Pair) => {
  const aIndex = circuits.findIndex((c) => c.has(pair.a));
  const bIndex = circuits.findIndex((c) => c.has(pair.b));

  if (aIndex === bIndex) {
    return;
  }

  for (const box of circuits[bIndex]) {
    circuits[aIndex].add(box);
  }

  circuits.splice(bIndex, 1);
};

execute([part1, part2]);

// Part 1: 68112, took 190ms
// Part 2: 44543856, took 172ms
