# --- Day 9: Rope Bridge ---
# https://adventofcode.com/2022/day/9

import sys
sys.path.insert(0, "..")

import utils

moves = {
    "R": (1, 0),
    "L": (-1, 0),
    "U": (0, 1),
    "D": (0, -1)
}

def part1() -> int:
    return play(2)

def part2() -> int:
    return play(10)

def play(number_of_knots: int) -> int:
    input = utils.get_input_by_line()

    visited = set()
    knots = [(0, 0) for _ in range(number_of_knots)]
    
    for line in input:
        direction = line[0]
        distance = int(line[2:])
        move = get_move(direction)

        for _ in range(distance):
            # Move head
            knots[0] = (knots[0][0] + move[0], knots[0][1] + move[1])

            # Each other knot should follow the previous
            for i in range(1, number_of_knots):
                knots[i] = follow_knot(knots[i-1], knots[i])
                
            visited.add(knots[-1])

    return len(visited)

def get_move(direction: str) -> tuple[int, int]:
    return moves[direction]

def follow_knot(previous: tuple[int, int], current: tuple[int, int]) -> tuple[int, int]:
    distance_x = previous[0] - current[0]
    if (abs(distance_x) > 1):
        delta_x = 1 if previous[0] > current[0] else -1
        delta_y = 0 if previous[1] == current[1] else 1 if previous[1] > current[1] else -1
        return (current[0] + delta_x, current[1] + delta_y)

    distance_y = previous[1] - current[1]
    if (abs(distance_y) > 1):
        delta_x = 0 if previous[0] == current[0] else 1 if previous[0] > current[0] else -1
        delta_y = 1 if previous[1] > current[1] else -1
        return (current[0] + delta_x, current[1] + delta_y)

    return current

utils.execute([ part1, part2 ])

# Part 1: 5907, took 27ms
# Part 2: 2303, took 65ms