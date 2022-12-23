# --- Day 20: Grove Positioning System ---
# https://adventofcode.com/2022/day/20

import sys
sys.path.insert(0, "..")

import utils

class ValueWrapper:
    def __init__(self: 'ValueWrapper', value: int):
        self.value = value

def part1() -> int:
    data, zero = parse_input()
    sorted = mix(data, list(data))
    return get_grove_coordinates(sorted, zero)

def part2() -> int:
    data, zero = parse_input()

    for wrapper in data:
        wrapper.value *= 811589153

    sorted = mix(data, list(data), iterations = 10)
    return get_grove_coordinates(sorted, zero)

def parse_input() -> tuple[list[ValueWrapper], ValueWrapper]:
    input = utils.get_input_by_line()
    data = [ValueWrapper(int(line)) for line in input]
    zero = next(wrapper for wrapper in data if wrapper.value == 0)

    return (data, zero)

def mix(original: list[ValueWrapper], sorted: list[ValueWrapper], iterations = 1) -> list[ValueWrapper]:
    length = len(sorted)

    for _ in range(iterations):
        for wrapper in original:
            old_index = sorted.index(wrapper)
            new_index = (old_index + wrapper.value) % (length - 1)
            new_index = length - 1 if new_index == 0 else new_index # Wrap to the end if new index is 0

            sorted.insert(new_index, sorted.pop(old_index))

    return sorted

def get_grove_coordinates(sorted: list[ValueWrapper], zero: ValueWrapper) -> int:
    length = len(sorted)
    zero_index = sorted.index(zero)
    result = sum([sorted[(zero_index + v * 1000) % length].value for v in range(1, 4)])

    return result

utils.execute([ part1, part2 ])

# Part 1: 11037, took 89ms
# Part 2: 3033720253914, took 741ms