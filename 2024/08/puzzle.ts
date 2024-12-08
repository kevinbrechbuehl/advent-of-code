// --- Day 8: Resonant Collinearity ---
// https://adventofcode.com/2024/day/8

import { getInputByLine, execute } from "../utils";

const part1 = (): number => {
  const { rows, cols, map } = parseInput();

  const antinodes = new Set<string>();

  Object.values(map).map((antennas) => {
    for (let i = 0; i < antennas.length; i++) {
      for (let j = 0; j < antennas.length; j++) {
        if (i !== j) {
          const rowDistance = antennas[i][0] - antennas[j][0];
          const colDistance = antennas[i][1] - antennas[j][1];

          const antinodeRow = antennas[i][0] + rowDistance;
          const antinodeCol = antennas[i][1] + colDistance;

          if (
            antinodeRow >= 0 &&
            antinodeRow < rows &&
            antinodeCol >= 0 &&
            antinodeCol < cols
          ) {
            antinodes.add(`${antinodeRow},${antinodeCol}`);
          }
        }
      }
    }
  });

  return antinodes.size;
};

const part2 = (): number => {
  const { rows, cols, map } = parseInput();

  const antinodes = new Set<string>();

  Object.values(map).map((antennas) => {
    for (let i = 0; i < antennas.length; i++) {
      for (let j = 0; j < antennas.length; j++) {
        if (i !== j) {
          antinodes.add(`${antennas[i][0]},${antennas[i][1]}`);

          const rowDistance = antennas[i][0] - antennas[j][0];
          const colDistance = antennas[i][1] - antennas[j][1];

          let antinodeRow = antennas[i][0] + rowDistance;
          let antinodeCol = antennas[i][1] + colDistance;

          while (
            antinodeRow >= 0 &&
            antinodeRow < rows &&
            antinodeCol >= 0 &&
            antinodeCol < cols
          ) {
            antinodes.add(`${antinodeRow},${antinodeCol}`);

            antinodeRow += rowDistance;
            antinodeCol += colDistance;
          }
        }
      }
    }
  });

  return antinodes.size;
};

const parseInput = (): {
  rows: number;
  cols: number;
  map: { [key: string]: [number, number][] };
} => {
  const input = getInputByLine();

  const rows = input.length;
  const cols = input[0].length;
  const map: { [key: string]: [number, number][] } = {};

  input.map((line, row) => {
    line.split("").map((char, col) => {
      if (char !== ".") {
        (map[char] ??= []).push([row, col]);
      }
    });
  });

  return { rows, cols, map };
};

execute([part1, part2]);

// Part 1: 252, took 0ms
// Part 2: 839, took 0ms
