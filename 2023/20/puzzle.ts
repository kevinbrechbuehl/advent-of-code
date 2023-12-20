// --- Day 20: Pulse Propagation ---
// https://adventofcode.com/2023/day/20

import { execute, getInputByLine, isSampleInput } from '../utils';

interface Module {
  name: string;
  type: string;
  destinations: string[];
  state: boolean; // Flip-flops
  sources: { [key: string]: boolean }; // Conjunctions
}

interface Instruction {
  source: string;
  destination: string;
  pulse: boolean;
}

interface Cycle {
  first: number;
  second: number;
}

const part1 = (): number => {
  const modules = parseInput();

  let lowPulses = 0;
  let highPulses = 0;

  for (let i = 0; i < 1000; i++) {
    const { low, high } = pushButton(modules);

    lowPulses += low + 1;
    highPulses += high;
  }

  return lowPulses * highPulses;
};

const part2 = (): number => {
  if (isSampleInput()) {
    // No sample input for part 2
    return -1;
  }

  // Greatest common divisor
  const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));

  // Least common multiple
  const lcm = (a: number, b: number): number => (a * b) / gcd(a, b);

  const modules = parseInput();
  const cycles: { [key: string]: Cycle } = {};

  // There is only one module which sends to "rx", so search
  // every module which sends to this module. We then need
  // to find cycles for each of these modules. A cycle is the number
  // of button pushes needed between two high pulses of the module.
  // The least common multiple of all these cycles is the result.
  Object.values(modules)
    .filter((module) => module.destinations.some((name) => name === 'rx'))
    .forEach((module) => {
      Object.values(modules)
        .filter((innerModule) =>
          innerModule.destinations.some((name) => name === module.name)
        )
        .map(
          (innerModule) => (cycles[innerModule.name] = { first: 0, second: 0 })
        );
    });

  let pushCounter = 0;
  while (true) {
    pushButton(modules, cycles, ++pushCounter);

    // If we found a cycle for each of the required modules,
    // we have reached the end and can return the least
    // common multiplier.
    if (Object.values(cycles).every((cycle) => cycle.second)) {
      return Object.values(cycles)
        .map((cycle) => cycle.second - cycle.first)
        .reduce(lcm);
    }
  }
};

const parseInput = (): { [key: string]: Module } => {
  const modules: { [key: string]: Module } = {};

  getInputByLine().forEach((line) => {
    const [module, output] = line.split(' -> ');

    const type = module.substring(0, 1);
    const name = module.substring(1);
    const destinations = output.split(', ');

    if (type === 'b') {
      modules['broadcaster'] = {
        name: 'broadcaster',
        type: 'broadcaster',
        destinations,
        state: false,
        sources: {},
      };
    } else {
      modules[name] = {
        name,
        type,
        destinations,
        state: false,
        sources: {},
      };
    }
  });

  // Set all required module sources to false
  Object.values(modules)
    .filter((module) => module.type === '&')
    .forEach((module) => {
      Object.values(modules).forEach((innerModule) => {
        if (innerModule.destinations.some((name) => name === module.name)) {
          module.sources[innerModule.name] = false;
        }
      });
    });

  return modules;
};

const pushButton = (
  modules: { [key: string]: Module },
  cycles: { [key: string]: Cycle } = {},
  pushCounter: number = 0
): { low: number; high: number } => {
  let low = 0;
  let high = 0;

  const queue: Instruction[] = [
    { source: '', destination: 'broadcaster', pulse: false },
  ];

  const send = (module: Module, pulse: boolean) => {
    module.destinations.forEach((destination) => {
      if (pulse) {
        high++;
      } else {
        low++;
      }

      queue.push({ source: module.name, destination, pulse });
    });
  };

  let instruction: Instruction;
  while ((instruction = queue.shift())) {
    // Count cycles of modules for part 2
    const cycle = cycles[instruction.source];
    if (cycle && instruction.pulse) {
      if (!cycle.first) {
        cycle.first = pushCounter;
      } else if (!cycle.second) {
        cycle.second = pushCounter;
      }
    }

    const module = modules[instruction.destination];
    if (!module) {
      continue;
    }

    if (module.type === '%') {
      if (!instruction.pulse) {
        module.state = !module.state;
        send(module, module.state);
      }
    } else if (module.type === '&') {
      module.sources[instruction.source] = instruction.pulse;
      const pulse = Object.values(module.sources).some((p) => !p);
      send(module, pulse);
    } else {
      send(module, instruction.pulse);
    }
  }

  return { low, high };
};

execute([part1, part2]);

// Part 1: 866435264, took 18ms
// Part 2: 229215609826339, took 70ms
