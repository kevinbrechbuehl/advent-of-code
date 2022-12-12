# --- Day 12: Hill Climbing Algorithm ---
# https://adventofcode.com/2022/day/12

from typing import Callable
from collections import deque

import sys
sys.path.insert(0, "..")

import utils

# Straight forward: Start at the starting position and end at the ending position
def part1() -> int:
    heightmap, starting_position, ending_position = parse_input()
    distance = traverse(heightmap, starting_position, lambda y, x: (y, x) == ending_position)

    return distance

# Traverse in inverted direction: Start at the ending position, go max. one step down
# and end at the first square with height "a"
def part2() -> int:
    heightmap, _, ending_position = parse_input()
    distance = traverse(heightmap, ending_position, lambda y, x: heightmap[y][x] == "a", top_down = True)
    
    return distance

# Parse the input and return the height-matrix, the starting position (square "S")
# and the ending position (square "E")
def parse_input() -> tuple[list[list[str]], tuple[int, int], tuple[int, int]]:
    input = utils.get_input_by_line()

    heightmap: list[list[str]] = []
    starting_position = (int(0), int(0))
    ending_position = (int(0), int(0))

    for y, line in enumerate(input):
        heightmap.append([*line])
        for x, square in enumerate(line):
            if square == "S":
                heightmap[y][x] = "a"
                starting_position = (y, x)
            elif square == "E":
                heightmap[y][x] = "z"
                ending_position = (y, x)

    return (heightmap, starting_position, ending_position)

# Traverse using BFS algorithm:
# https://en.wikipedia.org/wiki/Breadth-first_search
def traverse(heightmap: list[list[str]], starting_position: tuple[int, int], is_end: Callable[[int, int], bool], top_down: bool = False) -> int:

    total_rows = len(heightmap)
    total_columns = len(heightmap[0])

    visited = [starting_position]
    queue = deque([(starting_position[0], starting_position[1], int(0))])

    while len(queue) > 0:
        y, x, distance = queue.popleft()

        for next_y, next_x in [(y, x + 1), (y, x - 1), (y + 1, x), (y - 1, x)]:
            # We would be out of the map
            if next_y < 0 or next_y >= total_rows or next_x < 0 or next_x >= total_columns:
                continue

            # We already visited this square, skip it
            if (next_y, next_x) in visited:
                continue

            height_a = heightmap[y][x] if top_down else heightmap[next_y][next_x]
            height_b = heightmap[next_y][next_x] if top_down else heightmap[y][x]

            # The height of the step is more than 1
            if ord(height_a) - ord(height_b) > 1:
                continue

            # Yeah, we reached the desired ending position
            if is_end(next_y, next_x):
                return distance + 1
            
            # Potential next step, add it to the queue
            visited.append((next_y, next_x))
            queue.append((next_y, next_x, distance + 1))

utils.execute([ part1, part2 ])

# Part 1: 408, took 254ms
# Part 2: 399, took 111ms