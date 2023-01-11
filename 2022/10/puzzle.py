# --- Day 10: Cathode-Ray Tube ---
# https://adventofcode.com/2022/day/10

import sys
sys.path.insert(0, "..")

import utils

def part1() -> int:
    register = get_register()
    signal_strength = get_signal_strength(register)

    return signal_strength

def part2() -> str:
    register = get_register()
    print_crt(register)

    return "See CRT above"

# Get a list of values for the register, where each
# list element represents the value for the cycle
def get_register() -> list[int]:
    input = utils.get_input_by_line()

    register = [1]
    for instruction in input:
        register.append(register[-1])
        if instruction.startswith("addx"):
            register.append(register[-1] + int(instruction[5:]))

    return register

def get_signal_strength(register: list[int]) -> int:
    sum = 0
    for cycle in range(20, len(register), 40):
        sum += cycle * register[cycle-1]

    return sum

def print_crt(register: list[int]) -> None:
    line: list[str] = []
    for cycle, value in enumerate(register):
        if abs(value - cycle % 40) > 1:
            line.append(".")
        else:
            line.append("#")

        # Print the line after 40 chars
        if ((cycle + 1) % 40 == 0):
            print("".join(line))
            line = []
        
utils.execute([ part1, part2 ])

# Part 1: 11960, took 11ms
# ####...##..##..####.###...##..#....#..#.
# #.......#.#..#.#....#..#.#..#.#....#..#.
# ###.....#.#....###..#..#.#....#....####.
# #.......#.#....#....###..#.##.#....#..#.
# #....#..#.#..#.#....#....#..#.#....#..#.
# ####..##...##..#....#.....###.####.#..#.
# Part 2: See CRT above, took 12ms