// --- Day 25: Snowverload ---
// https://adventofcode.com/2023/day/25

import { execute, getInputByLine } from '../utils';

const part1 = (): number => {
  const { vertices, edges } = parseInput();

  return getSumOfGroups(vertices, edges);
};

const parseInput = (): {
  vertices: Set<string>;
  edges: { a: string; b: string }[];
} => {
  const vertices = new Set<string>();
  const edges: { a: string; b: string }[] = [];

  const containsEdge = (a: string, b: string): boolean => {
    return edges.some(
      (edge) => (edge.a === a && edge.b === b) || (edge.a === b && edge.b === a)
    );
  };

  getInputByLine().forEach((line) => {
    const [a, components] = line.split(': ');
    components.split(' ').forEach((b) => {
      vertices.add(a);
      vertices.add(b);

      if (!containsEdge(a, b)) {
        edges.push({ a, b });
      }
    });
  });

  return { vertices, edges };
};

const getSumOfGroups = (
  vertices: Set<string>,
  edges: { a: string; b: string }[]
): number => {
  // The number of cuts is the difference between the number of edges
  // within the groups and the total number of edges in the original graph.
  const getNumberOfCuts = (groups: string[][]): number => {
    const edgesInGroups = groups
      .map((group) =>
        edges.filter((e) => group.some((g) => e.a === g || e.b === g))
      )
      .map((edges) => edges.length)
      .reduce((total, current) => total + current, 0);

    return edgesInGroups - edges.length;
  };

  // As the Karger's algorithm is a randomized algorithm we need to
  // try to cut the graph into groups as long as we have 3 cuts.
  while (true) {
    const groups = getGroups(vertices, edges);
    if (getNumberOfCuts(groups) === 3) {
      return groups.reduce((total, current) => total * current.length, 1);
    }
  }
};

// Cut the graph into two groups using Karger's algorithm:
// https://en.wikipedia.org/wiki/Karger%27s_algorithm
const getGroups = (
  vertices: Set<string>,
  edges: { a: string; b: string }[]
): string[][] => {
  // Generate a single group for each vertex
  const groups: string[][] = [];
  vertices.forEach((vertex) => {
    groups.push([vertex]);
  });

  while (groups.length > 2) {
    // Get random edge with it's vertices and two groups containing this vertices
    const { a, b } = edges[Math.floor(Math.random() * edges.length)];
    const group1 = groups.filter((g) => g.some((v) => v === a))[0];
    const group2 = groups.filter((g) => g.some((v) => v === b))[0];

    if (areEqual(group1, group2)) {
      continue;
    }

    // Remove group 2 from groups
    for (let i = 0; i < groups.length; i++) {
      if (areEqual(groups[i], group2)) {
        groups.splice(i, 1);
        break;
      }
    }

    // Add group 2 to group 1
    group1.push(...group2);
  }

  return groups;
};

const areEqual = (a: string[], b: string[]): boolean => {
  if (a.length !== b.length) {
    return false;
  }

  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) {
      return false;
    }
  }

  return true;
};

execute([part1]);

// Part 1: 567606, took 3.342s
