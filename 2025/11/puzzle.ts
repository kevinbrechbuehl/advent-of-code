// --- Day 11: Reactor ---
// https://adventofcode.com/2025/day/11

import { getInputByLine, isSampleInput, execute } from "../utils";

const part1 = (): number => {
  const devices = parseInput(1);

  const getNumberOfPaths = (device: string): number => {
    if (device === "out") {
      return 1;
    }

    let numberOfPaths = 0;
    for (const output of devices.get(device)) {
      numberOfPaths += getNumberOfPaths(output);
    }

    return numberOfPaths;
  };

  return getNumberOfPaths("you");
};

const part2 = (): number => {
  const devices = parseInput(2);

  const cache = new Map<string, number>();

  const getNumberOfPaths = (
    device: string,
    dac: boolean,
    fft: boolean
  ): number => {
    const cacheKey = `${device}|${dac}|${fft}`;
    if (cache.has(cacheKey)) {
      return cache.get(cacheKey);
    }

    let numberOfPaths = 0;
    for (const output of devices.get(device)) {
      if (output === "out") {
        if (dac && fft) {
          numberOfPaths++;
        }

        continue;
      }

      numberOfPaths += getNumberOfPaths(
        output,
        dac || output == "dac",
        fft || output == "fft"
      );
    }

    cache.set(cacheKey, numberOfPaths);
    return numberOfPaths;
  };

  return getNumberOfPaths("svr", false, false);
};

const parseInput = (part: 1 | 2): Map<string, string[]> => {
  const fileName = isSampleInput() ? `sample${part}.txt` : "input.txt";

  const devices = new Map<string, string[]>();
  getInputByLine(fileName).map((line) => {
    const [device, rest] = line.split(": ");
    const outputs = rest.split(" ");

    devices.set(device, outputs);
  });

  return devices;
};

execute([part1, part2]);

// Part 1: 719, took 1ms
// Part 2: 337433554149492, took 1ms
