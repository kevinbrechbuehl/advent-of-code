// --- Day 9: Disk Fragmenter ---
// https://adventofcode.com/2024/day/9

import { getInput, execute } from "../utils";

const part1 = (): number => {
  const blocks = parseInput();

  for (let i = 0; i < blocks.length; i++) {
    while (blocks[i] === "." && blocks.length > i + 1) {
      blocks[i] = blocks.pop();
    }
  }

  return calculateChecksum(blocks);
};

const part2 = (): number => {
  const blocks = parseInput();
  const files = groupFiles(blocks);

  for (let i = files.length - 1; i >= 0; i--) {
    const file = files[i];

    // skip free spaces
    if (file.id === ".") {
      continue;
    }

    // search for free space
    const freeSpace = files.find(
      (space) =>
        space.id === "." && // only free spaces
        space.count >= file.count && // big enough
        space.start < file.start // before the current file
    );

    // no free space found -> skip the file
    if (!freeSpace) {
      continue;
    }

    // update the current blocks
    for (let j = 0; j < file.count; j++) {
      blocks[file.start + j] = ".";
      blocks[freeSpace.start + j] = file.id;
    }

    // update the free space left
    freeSpace.start += file.count;
    freeSpace.count -= file.count;
  }

  return calculateChecksum(blocks);
};

const parseInput = (): string[] => {
  const blocks: string[] = [];
  const input = getInput().split("").map(Number);

  for (let i = 0; i < input.length; i++) {
    const id = i % 2 === 0 ? (i / 2).toString() : ".";
    blocks.push(...Array.from({ length: input[i] }, () => id));
  }

  return blocks;
};

const groupFiles = (
  blocks: string[]
): { start: number; id: string; count: number }[] => {
  const files: { start: number; id: string; count: number }[] = [];

  let current = "";
  for (let i = 0; i < blocks.length; i++) {
    if (blocks[i] !== current) {
      current = blocks[i];
      files.push({ start: i, id: current, count: 1 });
    } else {
      files[files.length - 1].count++;
    }
  }

  return files;
};

const calculateChecksum = (blocks: string[]): number => {
  return blocks.reduce(
    (checksum, block, index) => checksum + index * (Number(block) || 0),
    0
  );
};

execute([part1, part2]);

// Part 1: 6154342787400, took 9ms
// Part 2: 6183632723350, took 278ms
