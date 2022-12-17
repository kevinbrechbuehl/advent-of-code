# --- Day 16: Proboscidea Volcanium ---
# https://adventofcode.com/2022/day/16

from functools import lru_cache

import sys
sys.path.insert(0, "..")

import utils

def parse_input() -> tuple[dict[str, int], dict[str, list[str]]]:
    input = utils.get_input_by_line()

    flows: dict[str, int] = {}
    tunnels: dict[str, list[str]] = {}

    for line in input:
        parts = line.split(" ")
        valve = parts[1]
        flows[valve] = int(parts[4][5:-1])
        tunnels[valve] = "".join(parts[9:]).split(",")

    return (flows, tunnels)

flows, tunnels = parse_input()

def part1() -> int:
    return get_max_pressure(30, "AA", (), False)

def part2() -> int:
    return get_max_pressure(26, "AA", (), True)

@lru_cache(None)
def get_max_pressure(time_left: int, valve: str, opened: tuple, with_elephant: bool) -> int:
    if time_left <= 0:
        # Add pressure of elephant for part 2 (within the same graph)
        return 0 if not with_elephant else get_max_pressure(26, "AA", opened, False)
    
    pressure = int(0)

    # Open the valve, add pressure for it and go to each tunnel
    if flows[valve] > 0 and valve not in opened:
        valve_pressure = (time_left - 1) * flows[valve] 
        valve_opened = tuple(sorted(opened + (valve,)))
        for tunnel in tunnels[valve]:
            pressure = max(pressure, valve_pressure + get_max_pressure(time_left - 2, tunnel, valve_opened, with_elephant))

    # Go to each tunnel without opening the valve
    for tunnel in tunnels[valve]:
        pressure = max(pressure, get_max_pressure(time_left - 1, tunnel, opened, with_elephant))

    return pressure

utils.execute([ part1, part2 ])

# Part 1: 1845, took 1.297s
# Part 2: 2286, took 84.023s