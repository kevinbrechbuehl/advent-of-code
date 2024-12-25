// --- Day 24: Crossed Wires ---
// https://adventofcode.com/2024/day/24

import { getInputByGroupOfLines, isSampleInput, execute } from "../utils";

type Wires = { [key: string]: boolean };

type Gate = {
  a: string;
  b: string;
  output: string;
  operation: string;
};

const part1 = (): number => {
  const { wires, gates } = parseInput();

  let needsUpdate = true;
  while (needsUpdate) {
    needsUpdate = false;

    for (const gate of gates) {
      const valueA = wires[gate.a];
      const valueB = wires[gate.b];
      const outputValue = wires[gate.output];

      if (valueA === undefined || valueB === undefined) {
        needsUpdate = true;
        continue;
      }

      if (outputValue === undefined) {
        switch (gate.operation) {
          case "AND":
            wires[gate.output] = valueA && valueB;
            break;
          case "OR":
            wires[gate.output] = valueA || valueB;
            break;
          case "XOR":
            wires[gate.output] = valueA !== valueB;
            break;
        }
      }
    }
  }

  const zWires = Object.entries(wires)
    .filter(([key]) => key.startsWith("z"))
    .sort()
    .reverse()
    .map(([_, value]) => (value ? "1" : "0"));

  return parseInt(zWires.join(""), 2);
};

/*
Part 2 was again too hard for me to solve, so I had to look for help.
In the Megathread on Reddit I found that it must be 45-bit full adder.
https://en.m.wikipedia.org/wiki/Adder_%28electronics%29

Alex Prosser has done a very good job with his visualization and explanation,
so my solution is heavily inspired by him. Thanks Alex!
https://github.com/CodingAP/advent-of-code/blob/main/puzzles/2024/day24/README.md

The full adder looks like this:
          _____
X1-+-----|     \              _____
   |     | XOR  |--I1--+-----|     \
Y1----+--|_____/       |     | XOR  |------Z
   |  |                |  +--|_____/
   |  |   _____        |  |
   +-----|     \       |  |
      |  | AND  |--I2--|--|------------+    _____
      +--|_____/       |  |   _____    +---|     \
                       +--|--|     \       | OR   |------CO
                          |  | AND  |--I3--|_____/
                          |--|_____/
                          |
                          |
CI------------------------+

This results in the following logic:

X1 XOR Y1 => I1
X1 AND Y1 => I2
I1 XOR CI => Z
I1 AND CI => I3
I2 OR I3 => CO

To solve the puzzle, we need to verify this logic.
*/
const part2 = (): string => {
  if (isSampleInput()) {
    return "Code does not work for sample input";
  }

  const { wires, gates } = parseInput();
  const numberOfBits = Object.keys(wires).length / 2;

  const swapped: string[] = [];
  for (let i = 0; i < numberOfBits; i++) {
    const bit = i.toString().padStart(2, "0");

    const i1 = getOutput(gates, `x${bit}`, `y${bit}`, "XOR");
    const i2 = getOutput(gates, `x${bit}`, `y${bit}`, "AND");
    const z = getGateByOutput(gates, `z${bit}`);

    // each I1 must go to a XOR or AND
    const i1Next = getGateByInput(gates, i1);
    if (
      i1Next !== undefined &&
      i1Next.operation !== "XOR" &&
      i1Next.operation !== "AND"
    ) {
      swapped.push(i1);
    }

    // each I2 must go to an OR (except the first one as it starts the carry flag)
    const c0 = getGateByInput(gates, i2);
    if (c0 !== undefined && c0.operation !== "OR" && i > 0) {
      swapped.push(i2);
    }

    // each Z must be connected to a XOR
    if (z.operation !== "XOR") {
      swapped.push(z.output);
    }
  }

  // each XOR must be connected to a X, Y or Z
  const xorGates = getGatesByOperation(gates, "XOR");
  for (const gate of xorGates) {
    if (gate.a.startsWith("x") || gate.a.startsWith("y")) continue;
    if (gate.b.startsWith("x") || gate.b.startsWith("y")) continue;
    if (gate.output.startsWith("z")) continue;

    swapped.push(gate.output);
  }

  return swapped.sort().join(",");
};

const parseInput = (): { wires: Wires; gates: Gate[] } => {
  const groups = getInputByGroupOfLines();

  const wires: Wires = {};
  groups[0].forEach((line) => {
    const [name, value] = line.split(": ");
    wires[name] = value === "1";
  });

  const gates = groups[1].map((line) => {
    const [a, operation, b, _, output] = line.split(" ");
    return { a, operation, b, output };
  });

  return { wires, gates };
};

const getOutput = (
  gates: Gate[],
  a: string,
  b: string,
  operator: string
): string => {
  return gates.find(
    (gate) =>
      gate.operation === operator &&
      ((gate.a === a && gate.b === b) || (gate.a === b && gate.b === a))
  ).output;
};

const getGateByOutput = (gates: Gate[], output: string): Gate => {
  return gates.find((gate) => gate.output === output);
};

const getGateByInput = (gates: Gate[], input: string): Gate => {
  return gates.find((gate) => gate.a === input || gate.b === input);
};

const getGatesByOperation = (gates: Gate[], operation: string): Gate[] => {
  return gates.filter((gate) => gate.operation === operation);
};

execute([part1, part2]);

// Part 1: 60714423975686, took 1ms
// Part 2: cgh,frt,pmd,sps,tst,z05,z11,z23, took 1ms
