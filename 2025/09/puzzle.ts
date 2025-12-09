// --- Day 9: Movie Theater ---
// https://adventofcode.com/2025/day/9

import { getInputByLine, execute } from "../utils";

const part1 = (): number => {
  const points = parseInput();

  let maxArea = 0;

  for (let i = 0; i < points.length; i++) {
    for (let j = i + 1; j < points.length; j++) {
      const p1 = points[i];
      const p2 = points[j];

      const area = (p1.x - p2.x + 1) * (p1.y - p2.y + 1);
      maxArea = Math.max(maxArea, area);
    }
  }

  return maxArea;
};

const part2 = (): number => {
  const points = parseInput();

  let maxArea = 0;

  for (let i = 0; i < points.length; i++) {
    for (let j = i + 1; j < points.length; j++) {
      const p1 = points[i];
      const p2 = points[j];

      const minX = Math.min(p1.x, p2.x);
      const maxX = Math.max(p1.x, p2.x);
      const minY = Math.min(p1.y, p2.y);
      const maxY = Math.max(p1.y, p2.y);

      let isIntersecting = false;

      // Checking the current rectangle against every "wall" (edge) of the polygon.
      // A rectangle is valid only if NO wall cuts through its interior (walls touching edges are allowed).
      for (let k = 0; k < points.length; k++) {
        const w1 = points[k];
        const w2 = k === points.length - 1 ? points[0] : points[k + 1];

        if (
          Math.max(w1.x, w2.x) > minX &&
          Math.min(w1.x, w2.x) < maxX &&
          Math.max(w1.y, w2.y) > minY &&
          Math.min(w1.y, w2.y) < maxY
        ) {
          isIntersecting = true;
          break;
        }
      }

      if (!isIntersecting) {
        const area = (maxX - minX + 1) * (maxY - minY + 1);
        maxArea = Math.max(maxArea, area);
      }
    }
  }

  return maxArea;
};

const parseInput = (): { x: number; y: number }[] => {
  return getInputByLine().map((line) => {
    const [x, y] = line.split(",").map(Number);
    return { x, y };
  });
};

execute([part1, part2]);

// Part 1: 4782151432, took 1ms
// Part 2: 1450414119, took 47ms
