# --- Day 23: Unstable Diffusion ---
# https://adventofcode.com/2022/day/23

import sys
sys.path.insert(0, "..")

import utils

def part1() -> int:
    result = play(10)
    elfs = result[0]

    min_row = min(pos[0] for pos in elfs)
    max_row = max(pos[0] for pos in elfs)
    min_col = min(pos[1] for pos in elfs)
    max_col = max(pos[1] for pos in elfs)

    width = max_col - min_col + 1
    height = max_row - min_row + 1

    empty_tiles = width * height - len(elfs)

    return empty_tiles

def part2() -> int:
    result = play(float("inf"))
    number_of_rounds = result[1]

    return number_of_rounds

def play(number_of_rounds: int) -> tuple[set[tuple[int, int]], int]:
    elfs = parse_input()
    directions = get_directions()
    round = int(1)

    while round <= number_of_rounds:
        proposals: dict[tuple[int, int], list[tuple[int, int]]] = {}

        for position in elfs:
            # Get every possible move
            proposed_moves: list[tuple[int, int]] = []
            for direction in directions:
                move = propose_move(elfs, position, direction)
                if move:
                    proposed_moves.append(move)

            # Every direction is already occupied
            if len(proposed_moves) == 0:
                continue
            
            # The elf could move anywhere
            if len(proposed_moves) == len(directions):
                continue

            # Add the current elf position to the proposals, where the
            # next position is the dictionary key. As there could be more
            # than one elf who proposed the same next position, the
            # dictionary value is a list.
            next_position = proposed_moves[0]
            proposed_position = proposals.get(next_position, [])
            proposed_position.append(position)
            proposals[next_position] = proposed_position

        for proposal in proposals.keys():
            positions = proposals[proposal]

            # If there is only one elf proposed to move to this position,
            # we can apply the move. Otherwise do nothing.
            if len(positions) == 1:
                elfs.discard(positions[0])
                elfs.add(proposal)

        # Swap directions
        directions.append(directions.pop(0))

        # No elf did a move, so we can exit the method and return
        # number of played rounts
        if len(proposals) == 0:
            return (elfs, round)

        round += 1

    return (elfs, round - 1)

def parse_input() -> set[tuple[int, int]]:
    input = utils.get_input_by_line()

    elfs: set[tuple[int, int]] = set()

    for row, line in enumerate(input):
        for column, char in enumerate(line):
            if char == "#":
                elfs.add((row, column))

    return elfs

def get_directions() -> list[list[tuple[int, int]]]:
    return [
        [(-1, 0), (-1, -1), (-1, 1)], # North
        [(1, 0), (1, -1), (1, 1)], # South
        [(0, -1), (-1, -1), (1, -1)], # West
        [(0, 1), (-1, 1), (1, 1)] # East
    ]

def propose_move(elfs: set[tuple[int, int]], current: tuple[int, int], direction: list[tuple[int, int]]) -> tuple[int, int]:
    for delta in direction:
        if (current[0] + delta[0], current[1] + delta[1]) in elfs:
            return None

    # First element in the directions list is the straight move
    return (current[0] + direction[0][0], current[1] + direction[0][1])

utils.execute([ part1, part2 ])

# Part 1: 3923, took 54ms
# Part 2: 1019, took 4.862s