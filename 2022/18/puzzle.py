# --- Day 18: Boiling Boulders ---
# https://adventofcode.com/2022/day/18

from collections import deque

import sys
sys.path.insert(0, "..")

import utils

def part1() -> int:
    return get_area(1)

def part2() -> int:
    return get_area(2)

def get_area(part: int) -> int:
    input = utils.get_input_by_line()
    
    area = int(0)

    cubes: set[tuple[int, int, int]] = set()
    for line in input:
        cubes.add(tuple(map(int, line.split(","))))

    min_x = min(i[0] for i in cubes) - 1
    max_x = max(i[0] for i in cubes) + 1
    min_y = min(i[1] for i in cubes) - 1
    max_y = max(i[1] for i in cubes) + 1
    min_z = min(i[2] for i in cubes) - 1
    max_z = max(i[2] for i in cubes) + 1

    offsets: list[tuple[int, int, int]] = [(1, 0, 0), (-1, 0, 0), (0, 1, 0), (0, -1, 0), (0, 0, 1), (0, 0, -1)]

    for (cx, cy, cz) in cubes:
        for (ox, oy, oz) in offsets:
            cube = (cx + ox, cy + oy, cz + oz)
            if part == 1:
                if is_exposed_surface(cube, cubes):
                    area += 1
            if part == 2:
                if is_exterior_surface(cube, cubes, min_x, max_x, min_y, max_y, min_z, max_z, offsets):
                    area += 1

    return area

def is_exposed_surface(cube: tuple[int, int, int], cubes: set[tuple[int, int, int]]) -> bool:
    return cube not in cubes

# Check if given cube is reachable from outside of the whole area using BFS algorithm
def is_exterior_surface(
        cube: tuple[int, int, int],
        cubes: set[tuple[int, int, int]],
        min_x: int,
        max_x: int,
        min_y: int,
        max_y: int,
        min_z: int,
        max_z: int,
        offsets: list[tuple[int, int, int]]) -> bool:

    visited: set[tuple[int, int, int]] = set()
    queue = deque([cube])

    while len(queue):
        cx, cy, cz = cube = queue.popleft()

        if cx < min_x or cx > max_x or cy < min_y or cy > max_y or cz < min_z or cz > max_z:
            return True
        
        if cube in visited or cube in cubes:
            continue

        visited.add(cube)

        for (ox, oy, oz) in offsets:
            queue.append((cx + ox, cy + oy, cz + oz))
        
    return False

utils.execute([ part1, part2 ])

# Part 1: 3530, took 12ms
# Part 2: 2000, took 2.161s