# --- Day 5: Supply Stacks ---
# https://adventofcode.com/2022/day/5

import sys
sys.path.insert(0, "..")

import utils

def part1() -> str:
    return calculate_top_crates("9000")

def part2() -> str:
    return calculate_top_crates("9001")

def calculate_top_crates(model: str) -> str:
    input = utils.get_input_by_group_of_lines()
    
    stacks = get_stacks(input[0])
    moves = input[1]

    return rearrange(stacks, moves, model)

def get_stacks(definition: list[str]) -> dict[int, list]:
    # Reverse definition
    definition = definition[::-1]

    # Create a dictionary for each stack and initialize with an empty list
    number_of_stacks = len(list(filter(lambda x: x.isdigit(), definition[0])))
    stacks = { i: [] for i in range(number_of_stacks) }

    # Check every fourth char and if it's a crate, add it to the specific stack
    for row in definition[1:]:
        for i, crate in enumerate(row):
            if i % 4 == 1 and not crate.isspace():
                stacks[int(i / 4)].append(crate)

    return stacks

def rearrange(stacks: dict[int, list], moves: list[str], model: str) -> str:
    for move in moves:
        # Parse instructions
        instructions = move.split(" ")
        number_of_crates = int(instructions[1])
        old_stack = stacks[int(instructions[3]) - 1]
        new_stack = stacks[int(instructions[5]) - 1]

        # Take the number of crates from the old stack
        crates = [old_stack.pop() for _ in range(number_of_crates)]

        # We popped one by one, so we need to reverse the list to move multiple crates at once
        if model == "9001":
            crates.reverse()
            
        new_stack += crates

    # Take the top crate per stack
    return (''.join([stacks[i].pop() for i in stacks]))

utils.execute([ part1, part2 ])

# Part 1: WCZTHTMPS, took 12ms
# Part 2: BLSGJSDTS, took 10ms