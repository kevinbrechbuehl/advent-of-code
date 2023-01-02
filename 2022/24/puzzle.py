# --- Day 24: Blizzard Basin ---
# https://adventofcode.com/2022/day/24

from collections import defaultdict, deque

import sys
sys.path.insert(0, "..")

import utils

DIRECTIONS: dict[str, tuple[int, int]] = {
    '^': (-1, 0),
    'v': (1, 0),
    '<': (0, -1),
    '>': (0, 1)
}

# Globally parse intput
input = utils.get_input_by_line()

# Get grid size
grid_height = len(input) - 2
grid_width = len(input[0]) - 2

# Initialize input
initial_blizzards: dict[tuple[int, int], str] = {}
starting_position = (int(-1), int(0))
destination_position = (grid_height, grid_width - 1)

for row, line in enumerate(input[1:-1]):
    for column, char in enumerate(line[1:-1]):
        if char in DIRECTIONS:
            initial_blizzards[row, column] = char

# Initialize blizzard cache
blizzards_cache = [ initial_blizzards ]

def part1() -> int:
    return play(number_of_rounds = 1)

def part2() -> int:
    return play(number_of_rounds = 3)

def play(number_of_rounds: int) -> int:
    result = int(0)
    for i in range(number_of_rounds):
        start_position = starting_position if i % 2 == 0 else destination_position
        end_position = destination_position if i % 2 == 0 else starting_position

        result = play_round(result, start_position, end_position)

    return result

def play_round(start_time: int, start_position: tuple[int, int], end_position: tuple[int, int]) -> int:
    visited: set[tuple[int, tuple[int, int]]] = set()
    queue = deque([(start_time, start_position)])

    while len(queue) > 0:
        time, position = queue.popleft()

        # We were already there at this time -> skip this path
        if (time, position) in visited:
            continue

        visited.add((time, position))

        # Update time and get next blizzards state
        time += 1
        blizzards = get_blizzards_state(time)
        
        for direction in DIRECTIONS.values():
            new_row = position[0] + direction[0]
            new_column = position[1] + direction[1]
            new_position = (new_row, new_column)

            # Yeah, we reached the end :-)
            if new_position == end_position:
                return time

            # If the new position is still within the field but not in a blizzard -> go on
            if 0 <= new_row < grid_height and 0 <= new_column < grid_width and new_position not in blizzards:
                queue.append((time, new_position))
        
        # If we are not in a blizzard -> don't move and wait here
        if position not in blizzards:
            queue.append((time, position))

# The state of the blizzards repeats every [width * height] of the grid
def get_blizzards_state(time: int) -> dict[tuple[int, int], str]:
    index = time % (grid_width * grid_height)

    if len(blizzards_cache) <= index:
        last_state = blizzards_cache[index - 1]

        new_state: dict[tuple[int, int], str] = defaultdict(list)

        for key in last_state.keys():
            for value in last_state[key]:
                delta = DIRECTIONS[value]

                new_row = (key[0] + delta[0]) % grid_height
                new_column = (key[1] + delta[1]) % grid_width

                # We append the current value, so if there are multiple blizzards
                # on the same field, we have both blizzards stored
                new_state[new_row, new_column].append(value)
        
        blizzards_cache.append(new_state)

    return blizzards_cache[index]

utils.execute([ part1, part2 ])

# Part 1: 308, took 608ms
# Part 2: 908, took 1.475s