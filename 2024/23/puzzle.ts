// --- Day 23: LAN Party ---
// https://adventofcode.com/2024/day/23

import { getInputByLine, execute } from "../utils";

const part1 = (): number => {
  const graph = parseInput();
  const connections = new Set<string>();

  for (const [node, neighbors] of graph.entries()) {
    for (let i = 0; i < neighbors.length; i++) {
      for (let j = i + 1; j < neighbors.length; j++) {
        if (graph.get(neighbors[i]).includes(neighbors[j])) {
          connections.add([node, neighbors[i], neighbors[j]].sort().join(","));
        }
      }
    }
  }

  return [...connections].filter((connection) =>
    connection.split(",").some((node) => node.startsWith("t"))
  ).length;
};

const part2 = (): string => {
  const graph = parseInput();

  const cliques: string[][] = [];
  bronKerbosch(new Set(), new Set(graph.keys()), new Set(), graph, cliques);

  return cliques
    .sort((a, b) => b.length - a.length)[0]
    .sort()
    .join(",");
};

const parseInput = (): Map<string, string[]> => {
  const graph = new Map<string, string[]>();

  getInputByLine().forEach((line) => {
    const [left, right] = line.split("-");

    if (!graph.get(left)) graph.set(left, []);
    graph.get(left).push(right);

    if (!graph.get(right)) graph.set(right, []);
    graph.get(right).push(left);
  });

  return graph;
};

// Bron–Kerbosch algorithm is an enumeration algorithm for finding all
// maximal cliques in an undirected graph.
// Source: https://en.wikipedia.org/wiki/Bron%E2%80%93Kerbosch_algorithm
const bronKerbosch = (
  r: Set<string>,
  p: Set<string>,
  x: Set<string>,
  graph: Map<string, string[]>,
  cliques: string[][]
): void => {
  if (p.size === 0 && x.size === 0) {
    cliques.push([...r]);
    return;
  }

  for (const v of p) {
    bronKerbosch(
      new Set([...r, v]),
      new Set([...p].filter((u) => (graph.get(v) || []).includes(u))),
      new Set([...x].filter((u) => (graph.get(v) || []).includes(u))),
      graph,
      cliques
    );

    p.delete(v);
    x.add(v);
  }
};

execute([part1, part2]);

// Part 1: 1485, took 14ms
// Part 2: cc,dz,ea,hj,if,it,kf,qo,sk,ug,ut,uv,wh, took 124ms
