// --- Day 14: Restroom Redoubt ---
// https://adventofcode.com/2024/day/14

import { getInputByLine, isSampleInput, execute } from "../utils";

type Robot = { px: number; py: number; vx: number; vy: number };

const WIDTH = isSampleInput() ? 11 : 101;
const HEIGHT = isSampleInput() ? 7 : 103;

const part1 = (): number => {
  const robots = parseInput();

  let positions: Map<string, number>;
  for (let i = 0; i < 100; i++) {
    positions = move(robots);
  }

  printSpace(positions);

  const WIDTH_HALF = Math.floor(WIDTH / 2);
  const HEIGHT_HALF = Math.floor(HEIGHT / 2);

  const quadrants = Array(4).fill(0);

  for (const robot of robots) {
    if (robot.px < WIDTH_HALF && robot.py < HEIGHT_HALF) {
      quadrants[0]++;
    } else if (robot.px > WIDTH_HALF && robot.py < HEIGHT_HALF) {
      quadrants[1]++;
    } else if (robot.px < WIDTH_HALF && robot.py > HEIGHT_HALF) {
      quadrants[2]++;
    } else if (robot.px > WIDTH_HALF && robot.py > HEIGHT_HALF) {
      quadrants[3]++;
    }
  }

  return quadrants.reduce((total, quadrant) => total * quadrant, 1);
};

const part2 = (): number => {
  const robots = parseInput();

  let seconds = 0;
  while (true) {
    seconds++;

    const positions = move(robots);

    // It was just a wild guess that the picture could be where
    // all the robots are in a different position. And it worked!
    if (positions.size === robots.length) {
      printSpace(positions);
      return seconds;
    }
  }
};

const parseInput = (): Robot[] => {
  return getInputByLine().map((line) => {
    const [px, py, vx, vy] = line.match(/-?\d+/g).map(Number);
    return { px, py, vx, vy };
  });
};

const move = (robots: Robot[]): Map<string, number> => {
  const positions = new Map<string, number>();

  for (const robot of robots) {
    let nextx = (robot.px + robot.vx) % WIDTH;
    let nexty = (robot.py + robot.vy) % HEIGHT;

    nextx = nextx < 0 ? WIDTH + nextx : nextx;
    nexty = nexty < 0 ? HEIGHT + nexty : nexty;

    robot.px = nextx;
    robot.py = nexty;

    const key = `${robot.px},${robot.py}`;
    positions.set(key, (positions.get(key) ?? 0) + 1);
  }

  return positions;
};

const printSpace = (positions: Map<string, number>): void => {
  console.log();

  for (let y = 0; y < HEIGHT; y++) {
    let line = "";
    for (let x = 0; x < WIDTH; x++) {
      const key = `${x},${y}`;
      line += positions.has(key) ? positions.get(key) : ".";
    }
    console.log(line);
  }

  console.log();
};

execute([part1, part2]);

// Part 1: 208437768, took 9ms
// Part 2: 7492, took 252ms
