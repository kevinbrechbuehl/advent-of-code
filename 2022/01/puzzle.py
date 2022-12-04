# --- Day 1: Calorie Counting ---
# https://adventofcode.com/2022/day/1

import sys
sys.path.insert(0, "..")

import utils

def part1() -> int:
    calories = get_calories()
    return max(calories)

def part2() -> int:
    calories = sorted(get_calories())
    return sum(calories[-3:])

def get_calories() -> list[int]:
    input = utils.get_input_by_group_of_lines()

    calories = list[int]()
    for elf in input:
        elf_calories = sum(map(int, elf))
        calories.append(elf_calories)

    return calories

utils.execute([ part1, part2 ])

# Part 1: 69310, took 13ms
# Part 2: 206104, took 12ms