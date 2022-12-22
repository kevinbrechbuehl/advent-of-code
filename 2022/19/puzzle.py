# --- Day 19: Not Enough Minerals ---
# https://adventofcode.com/2022/day/19

from collections import deque

import sys
sys.path.insert(0, "..")

import utils

ORE, CLAY, OBSIDIAN, GEODE = int(0), int(1), int(2), int(3)

class Blueprint:
    def __init__(self: 'Blueprint', line: str):
        parts = line.split(" ")

        self.id = int(parts[1][:-1])

        self.costs = {
            ORE: { ORE: int(parts[6]) },
            CLAY: { ORE: int(parts[12]) },
            OBSIDIAN: { ORE: int(parts[18]), CLAY: int(parts[21]) },
            GEODE: { ORE: int(parts[27]), OBSIDIAN: int(parts[30])}
        }

        self.max_resources = {
            ORE: max(self.costs[ORE][ORE], self.costs[CLAY][ORE], self.costs[OBSIDIAN][ORE], self.costs[GEODE][ORE]),
            CLAY: self.costs[OBSIDIAN][CLAY],
            OBSIDIAN: self.costs[GEODE][OBSIDIAN],
            GEODE: 0
        }

def part1() -> int:
    sum = int(0)
    blueprints = parse_input()

    for blueprint in blueprints:
        sum += blueprint.id * get_max_geodes(blueprint, 24)

    return sum

def part2() -> int:
    sum = int(1)
    blueprints = parse_input()

    for blueprint in blueprints[:3]:
        sum *= get_max_geodes(blueprint, 32)

    return sum

def parse_input() -> list[Blueprint]:
    input = utils.get_input_by_line()
    return [Blueprint(line) for line in input]

# This was hard again. Pretty similar than day 16, but I tried to
# solve it with a DFS queue this time. I was able to solve puzzle 1
# relatively quickly but struggled with the optimizations for puzzle 2.
# What a messs... I ended up in adding pretty much everything from
# this walkthrough (thanks a lot for helping me out):
# https://github.com/mebeim/aoc/blob/master/2022/README.md#day-19---not-enough-minerals
def get_max_geodes(blueprint: Blueprint, time_left: int) -> int:

    max_geodes = int(0)
    visited = set()
    queue = deque([(time_left, (int(0), int(0), int(0), int(0)), (int(1), int(0), int(0), int(0)), ())])

    costs = blueprint.costs
    max_resources = blueprint.max_resources

    while queue:
        # Cache
        values = queue.pop()
        state = values[:-1]
        if state in visited:
            continue

        visited.add(state)

        # Get state
        time_left, resources, robots, did_not_build = values

        # Collect resources
        new_resources = (
            resources[ORE] + robots[ORE],
            resources[CLAY] + robots[CLAY],
            resources[OBSIDIAN] + robots[OBSIDIAN],
            resources[GEODE] + robots[GEODE]
        )
        
        time_left -= 1

        # Running out of time
        if time_left == 0:
            max_geodes = max(max_geodes, new_resources[GEODE])
            continue

        # What could we potentially produce over time
        # We could optimize this here a bit more, but I didn't want to just copy/paste everything ;-)
        best_case = resources[GEODE] + robots[GEODE] * (time_left + 1) + time_left * (time_left + 1) // 2
        if best_case < max_geodes:
            continue

        can_build: list[int] = []

        # For each resource type, we only build a new robot if:
        # - We have enough resources
        # - We did not already have the max needed resources of this type
        # - We haven't built the robot in the last cycle, although we could have to

        if resources[ORE] >= costs[GEODE][ORE] and resources[OBSIDIAN] >= costs[GEODE][OBSIDIAN] and GEODE not in did_not_build:
            can_build.append(GEODE)
            queue.append((time_left, (new_resources[ORE] - costs[GEODE][ORE], new_resources[CLAY], new_resources[OBSIDIAN] - costs[GEODE][OBSIDIAN], new_resources[GEODE]), (robots[ORE], robots[CLAY], robots[OBSIDIAN], robots[GEODE] + 1), ()))

        if resources[ORE] >= costs[OBSIDIAN][ORE] and resources[CLAY] >= costs[OBSIDIAN][CLAY] and robots[OBSIDIAN] < max_resources[OBSIDIAN] and OBSIDIAN not in did_not_build:
            can_build.append(OBSIDIAN)
            queue.append((time_left, (new_resources[ORE] - costs[OBSIDIAN][ORE], new_resources[CLAY] - costs[OBSIDIAN][CLAY], new_resources[OBSIDIAN], new_resources[GEODE]), (robots[ORE], robots[CLAY], robots[OBSIDIAN] + 1, robots[GEODE]), ()))

        if resources[ORE] >= costs[CLAY][ORE] and robots[CLAY] < max_resources[CLAY] and CLAY not in did_not_build:
            can_build.append(CLAY)
            queue.append((time_left, (new_resources[ORE] - costs[CLAY][ORE], new_resources[CLAY], new_resources[OBSIDIAN], new_resources[GEODE]), (robots[ORE], robots[CLAY] + 1, robots[OBSIDIAN], robots[GEODE]), ()))

        if resources[ORE] >= costs[ORE][ORE] and robots[ORE] < max_resources[ORE] and ORE not in did_not_build:
            can_build.append(ORE)
            queue.append((time_left, (new_resources[ORE] - costs[ORE][ORE], new_resources[CLAY], new_resources[OBSIDIAN], new_resources[GEODE]), (robots[ORE] + 1, robots[CLAY], robots[OBSIDIAN], robots[GEODE]), ()))

        # If we have robots and need more resources of at least one type, we go ahead to collect more, without building something.
        # We also pass the robots we could have built, but decided to not build.
        if (robots[OBSIDIAN] and resources[OBSIDIAN] < max_resources[OBSIDIAN]) or (robots[CLAY] and resources[CLAY] < max_resources[CLAY]) or resources[ORE] < max_resources[ORE]:
            queue.append((time_left, (new_resources[ORE], new_resources[CLAY], new_resources[OBSIDIAN], new_resources[GEODE]), (robots[ORE], robots[CLAY], robots[OBSIDIAN], robots[GEODE]), can_build))

    return max_geodes

utils.execute([ part1, part2 ])

# Part 1: 1624, took 9.765s
# Part 2: 12628, took 30.069s