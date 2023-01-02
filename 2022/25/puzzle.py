# --- Day 25: Full of Hot Air ---
# https://adventofcode.com/2022/day/25

import sys
sys.path.insert(0, "..")

import utils

SNAFU = {
    '=': -2,
    '-': -1,
    '0': 0,
    '1': 1,
    '2': 2
}

def part1() -> str:
    input = utils.get_input_by_line()
    base10_sum = sum(map(to_base10, input))
    return to_snafu(base10_sum)

def to_base10(value: str) -> int:
    result = int(0)

    for i, digit in enumerate(reversed(value)):
        result += SNAFU[digit] * 5 ** i

    return result

def to_snafu(value: int) -> str:
    result = ""

    while value > 0:
        # With a normal modulo, we would get numbers 3 and 4,
        # which should be treated as = (5-2) and - (5-1). So we
        # add + 2 and can retrieve the SNAFU code much easier.
        value, remainder = divmod(value + 2, 5)
        result += "=-012"[remainder]

    return result[::-1] # Reversed

utils.execute([ part1 ])

# Part 1: 2=112--220-=-00=-=20, took 13ms