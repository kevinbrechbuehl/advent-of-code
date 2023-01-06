# --- Day 3: Rucksack Reorganization ---
# https://adventofcode.com/2022/day/3

import sys
sys.path.insert(0, "..")

import utils

def part1() -> int:
    input = utils.get_input_by_line()

    sum = int(0)
    for rucksack in input:
        compartment_length = int(len(rucksack) / 2)
        first = rucksack[:compartment_length]
        second = rucksack[compartment_length:]
        item_type = intersect(first, second)
        sum += priority(item_type[0])

    return sum

def part2() -> int:
    input = utils.get_input_by_line()

    sum = int(0)
    for index in range(0, len(input), 3):
        first = input[index]
        second = input[index + 1]
        third = input[index + 2]
        item_type = intersect(intersect(first, second), third)
        sum += priority(item_type[0])

    return sum

def intersect(first: str, second: str) -> list[str]:
    return list(set(first).intersection(set(second)))

def priority(item_type: str) -> int:
    if item_type.isupper():
        return ord(item_type) - 38
    else:
        return ord(item_type) - 96

utils.execute([ part1, part2 ])

# Part 1: 8240, took 32ms
# Part 2: 2587, took 8ms