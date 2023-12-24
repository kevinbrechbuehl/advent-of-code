// --- Day 23: A Long Walk ---
// https://adventofcode.com/2023/day/23

import { execute, getInputByLine } from '../utils';

interface Neighbor {
  position: string;
  steps: number;
}

const directions = {
  '>': [0, 1],
  v: [1, 0],
  '<': [0, -1],
  '^': [-1, 0],
};

const part1 = (): number => {
  const { graph, start, end } = parseInput(1);

  return travel(graph, start, end);
};

const part2 = (): number => {
  const { graph, start, end } = parseInput(2);

  const optimizedGraph = getOptimizedGraph(graph, start, end);

  return travel(optimizedGraph, start, end);
};

const parseInput = (
  part: 1 | 2
): {
  graph: { [key: string]: Neighbor[] };
  start: string;
  end: string;
} => {
  const graph: { [key: string]: Neighbor[] } = {};

  const map = getInputByLine().map((line) => line.split(''));
  const start = `0,${map[0].indexOf('.')}`;
  const end = `${map.length - 1},${map[map.length - 1].indexOf('.')}`;

  const isInMap = (row: number, col: number): boolean => {
    return row >= 0 && row < map.length && col >= 0 && col < map[0].length;
  };

  const isForest = (row: number, col: number): boolean => {
    return map[row][col] === '#';
  };

  const tryAddToGraph = (row: number, col: number, direction: number[]) => {
    const nextRow = row + direction[0];
    const nextCol = col + direction[1];

    if (isInMap(nextRow, nextCol) && !isForest(nextRow, nextCol)) {
      const next = `${nextRow},${nextCol}`;
      graph[`${row},${col}`].push({ position: next, steps: 1 });
    }
  };

  for (let row = 0; row < map.length; row++) {
    for (let col = 0; col < map[row].length; col++) {
      if (isForest(row, col)) {
        continue;
      }

      graph[`${row},${col}`] = [];

      const char = map[row][col];
      if (char === '.' || part === 2) {
        Object.values(directions).forEach((direction) => {
          tryAddToGraph(row, col, direction);
        });
      } else {
        tryAddToGraph(row, col, directions[char]);
      }
    }
  }

  return { graph, start, end };
};

const travel = (
  graph: { [key: string]: Neighbor[] },
  start: string,
  end: string
): number => {
  let maxSteps = 0;

  const visited = new Set<string>();

  const queue: Neighbor[] = [];
  queue.push({ position: start, steps: 0 });

  while (queue.length > 0) {
    const { position, steps } = queue.pop();

    if (steps === -1) {
      visited.delete(position);
      continue;
    }

    if (position === end) {
      maxSteps = Math.max(maxSteps, steps);
      continue;
    }

    if (visited.has(position)) {
      continue;
    }

    visited.add(position);

    // Add current position to the queue and set steps to -1.
    // This way we can handle a single visited cache and can remove
    // the current position from the visited cache again as soon as
    // all the other paths reached the end. This is a huge performance
    // improvement on having a separated visited cache for every possible
    // path.
    queue.push({ position, steps: -1 });

    graph[position].forEach((next) => {
      queue.push({ position: next.position, steps: steps + next.steps });
    });
  }

  return maxSteps;
};

// Optimize graph by edge contraction. We can skip every neighbor
// without a junction, because there is only one way to travel
// through it. At the end we have a graph with only junctions
// and the steps required to their next junctions.
const getOptimizedGraph = (
  originalGraph: { [key: string]: Neighbor[] },
  start: string,
  end: string
): {
  [key: string]: { position: string; steps: number }[];
} => {
  const junctions = [
    start,
    ...Object.entries(originalGraph)
      .filter(([_, neighbors]) => neighbors.length > 2)
      .map(([position]) => position),
    ,
    end,
  ];

  const graph: { [key: string]: Neighbor[] } = {};
  junctions.forEach((junction) => {
    graph[junction] = getNextJunctions(originalGraph, junction, junctions);
  });

  return graph;
};

const getNextJunctions = (
  graph: { [key: string]: Neighbor[] },
  start: string,
  junctions: string[]
): Neighbor[] => {
  const queue: Neighbor[] = [];
  queue.push({ position: start, steps: 0 });

  const visited = new Set<string>();
  visited.add(start);

  const neighbors: Neighbor[] = [];

  while (queue.length > 0) {
    const { position, steps } = queue.shift();

    if (position !== start && junctions.includes(position)) {
      neighbors.push({ position, steps });
      continue;
    }

    graph[position].forEach((neighbor) => {
      if (!visited.has(neighbor.position)) {
        visited.add(neighbor.position);
        queue.push({ position: neighbor.position, steps: steps + 1 });
      }
    });
  }

  return neighbors;
};

execute([part1, part2]);

// Part 1: 2326, took 60ms
// Part 2: 6574, took 6.109s
