# --- Day 13: Distress Signal ---
# https://adventofcode.com/2022/day/13

from functools import cmp_to_key

import sys
sys.path.insert(0, "..")

import utils

def part1() -> int:
    input = utils.get_input_by_group_of_lines()

    sum = int(0)
    for i, pair in enumerate(input):
        if compare(eval(pair[0]), eval(pair[1])) < 0:
            sum += i + 1

    return sum

def part2() -> int:
    input = utils.get_input_by_group_of_lines()
    packets = [eval(packet) for pair in input for packet in pair]

    first_divider = [[2]]
    second_divider = [[6]]
    packets.append(first_divider)
    packets.append(second_divider)

    sorted_packets = sorted(packets, key=cmp_to_key(compare))

    first_index = sorted_packets.index(first_divider) + 1
    second_index = sorted_packets.index(second_divider) + 1

    return first_index * second_index

def compare(left: int | list, right: int | list) -> int:
    if is_int(left) and is_int(right):
        return left - right
    
    if is_int(left):
        left = [left]
    
    if is_int(right):
        right = [right]
    
    for i in range(len(left)):
        if i >= len(right):
            return 1

        result = compare(left[i], right[i])
        if result != 0:
            return result

    return 0 if len(right) == len(left) else -1

def is_int(value) -> bool:
    return type(value) == int

utils.execute([ part1, part2 ])

# Part 1: 5557, took 27ms
# Part 2: 22425, took 40ms