# --- Day 4: Camp Cleanup ---
# https://adventofcode.com/2022/day/4

import sys
sys.path.insert(0, "..")

import utils

def part1() -> int:
    return calculate_overlappings(check_full_overlap = True)

def part2() -> int:
    return calculate_overlappings(check_full_overlap = False)

def calculate_overlappings(check_full_overlap: bool) -> int:
    input = utils.get_input_by_line()

    sum = int(0)
    for pair in input:
        sections = pair.split(",")
        first = convert_to_range(sections[0])
        second = convert_to_range(sections[1])

        if check_full_overlap:
            sum += full_overlap(first, second)
        else:
            sum += partial_overlap(first, second)

    return sum

def convert_to_range(sections: str) -> range:
    elements = list(map(int, sections.split("-")))
    return range(elements[0], elements[1])

def full_overlap(first: range, second: range) -> bool:
    return first.start <= second.start and first.stop >= second.stop or + \
        second.start <= first.start and second.stop >= first.stop

def partial_overlap(first: range, second: range) -> bool:
    return second.stop >= first.start and first.stop >= second.start

utils.execute([ part1, part2 ])

# Part 1: 584, took 14ms
# Part 2: 933, took 13ms