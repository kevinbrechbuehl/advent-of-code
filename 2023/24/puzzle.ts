// --- Day 24: Never Tell Me The Odds ---
// https://adventofcode.com/2023/day/24

import { execute, getInputByLine, isSampleInput } from '../utils';

interface Hailstone {
  px: number; // Point X
  py: number; // Point Y
  pz: number; // Point Z
  vx: number; // Vector X
  vy: number; // Vector Y
  vz: number; // Vector Z
}

const part1 = (): number => {
  const min = isSampleInput() ? 7 : 200_000_000_000_000;
  const max = isSampleInput() ? 27 : 400_000_000_000_000;

  const hailstones = parseInput();

  let intersections = 0;

  const isWithinRange = (x: number, y: number): boolean => {
    return x >= min && x <= max && y >= min && y <= max;
  };

  const isInFuture = (hailstone: Hailstone, x: number, y: number): boolean => {
    return (
      x - hailstone.px > 0 === hailstone.vx > 0 &&
      y - hailstone.py > 0 === hailstone.vy > 0
    );
  };

  for (let i = 0; i < hailstones.length; i++) {
    for (let j = i + 1; j < hailstones.length; j++) {
      const a = hailstones[i];
      const b = hailstones[j];
      const intersect = getIntersection(a, b);

      // Did not intersect
      if (!intersect) {
        continue;
      }

      const { x, y } = intersect;
      if (isWithinRange(x, y) && isInFuture(a, x, y) && isInFuture(b, x, y)) {
        intersections++;
      }
    }
  }

  return intersections;
};

// I was thinking of brute forcing the possible velocities for some
// of the hailstones by intersecting with an offset. If they intersect,
// I would assume that this would be the right velocity. As we have
// the intersection, we also have the starting position. I struggled
// with the implementation and found a solution with a pretty much
// same idea as I had: https://pastebin.com/B0LijzNb
const part2 = (): number => {
  // A range for 300 is enough, at least for my input
  const range = 300;

  const hailstones = parseInput();

  const isSamePoint = (
    a: { x: number; y: number },
    b: { x: number; y: number }
  ): boolean => {
    return a.x === b.x && a.y === b.y;
  };

  for (let x = -range; x < range; x++) {
    for (let y = -range; y < range; y++) {
      const offset = { x, y };

      // Try to intersect the first four hailstones
      const intersect1 = getIntersection(hailstones[1], hailstones[0], offset);
      const intersect2 = getIntersection(hailstones[2], hailstones[0], offset);
      const intersect3 = getIntersection(hailstones[3], hailstones[0], offset);

      // Not valid if not all of them are intersecting
      if (!intersect1 || !intersect2 || !intersect3) {
        continue;
      }

      // Not valid if intersection positions are not the same
      if (
        !isSamePoint(intersect1, intersect2) ||
        !isSamePoint(intersect1, intersect3) ||
        !isSamePoint(intersect2, intersect3)
      ) {
        continue;
      }

      // Go ahead and check velocity of the z-dimension as well.
      // We know at what time we would intersect the rock's initial position,
      // so we can just check where the Z would end up at
      for (let z = -range; z < range; z++) {
        const intersectZ1 =
          hailstones[1].pz + intersect1.time * (hailstones[1].vz + z);
        const intersectZ2 =
          hailstones[2].pz + intersect2.time * (hailstones[2].vz + z);
        const intersectZ3 =
          hailstones[3].pz + intersect3.time * (hailstones[3].vz + z);

        // Not valid if intersections are not the same
        if (
          intersectZ1 !== intersectZ2 ||
          intersectZ1 !== intersectZ3 ||
          intersectZ2 !== intersectZ3
        ) {
          continue;
        }

        // If four hailstones happen to intersect, just assume we found the answer and exit.
        return intersect1.x + intersect1.y + intersectZ1;
      }
    }
  }

  return -1;
};

const parseInput = (): Hailstone[] => {
  return getInputByLine().map((line) => {
    const [point, vector] = line.split(' @ ');
    const [px, py, pz] = point.split(', ').map(Number);
    const [vx, vy, vz] = vector.split(', ').map(Number);

    return { px, py, pz, vx, vy, vz };
  });
};

// Source: https://paulbourke.net/geometry/pointlineplane/
const getIntersection = (
  a: Hailstone,
  b: Hailstone,
  offset: { x: number; y: number } = { x: 0, y: 0 }
): { x: number; y: number; time: number } | false => {
  // Prepare input
  const x1 = a.px;
  const y1 = a.py;
  const x2 = a.px + a.vx + offset.x;
  const y2 = a.py + a.vy + offset.y;
  const x3 = b.px;
  const y3 = b.py;
  const x4 = b.px + b.vx + offset.x;
  const y4 = b.py + b.vy + offset.y;

  // Check if none of the lines are of length 0
  if ((x1 === x2 && y1 === y2) || (x3 === x4 && y3 === y4)) {
    return false;
  }

  const denominator = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);

  // Lines are parallel
  if (denominator === 0) {
    return false;
  }

  let ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denominator;

  // Return an object with the x and y coordinates of the intersection
  let x = x1 + ua * (x2 - x1);
  let y = y1 + ua * (y2 - y1);

  return { x, y, time: ua };
};

execute([part1, part2]);

// Part 1: 17867, took 12ms
// Part 2: 557743507346379, took 12ms
