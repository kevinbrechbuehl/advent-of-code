# --- Day 6: Tuning Trouble ---
# https://adventofcode.com/2022/day/6

import sys
sys.path.insert(0, "..")

import utils

def part1() -> int:
    return find_marker(4)

def part2() -> int:
    return find_marker(14)

def find_marker(char_count: int) -> int:
    input = utils.get_input()
    marker = char_count
    buffer = list(input[:char_count])

    for char in input[char_count:]:
        if len(set(buffer)) == char_count:
            return marker

        marker += 1
        buffer = buffer[1:] + [char]

    return -1

utils.execute([ part1, part2 ])

# Part 1: 1538, took 11ms
# Part 2: 2315, took 11ms