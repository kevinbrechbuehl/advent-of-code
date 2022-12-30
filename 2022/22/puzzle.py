# --- Day 22: Monkey Map ---
# https://adventofcode.com/2022/day/22

import re
import sys
sys.path.insert(0, "..")

import utils

RIGHT, DOWN, LEFT, UP = int(0), int(1), int(2), int(3)

def part1() -> int:
    grid, stones, instructions, cube_size, is_sample = parse_input()
    return travel(grid, stones, instructions, cube_size, False, is_sample)

# This was insane... I stopped trying to figure out how I could
# rotate and calculate the cube with all its possible folds (that's
# something for another day.. maybe...). As a help, I created a paper
# cube and add a static transition map from each side where we leave the
# cube to the exact position where we re-enter the cube. I did this
# for the example and the real input and not for all the possible cube
# foldings. But as far as I have seen, the real input format is always
# the same. Have fun with this!
def part2() -> int:
    grid, stones, instructions, cube_size, is_sample = parse_input()
    return travel(grid, stones, instructions, cube_size, True, is_sample)

def parse_input() -> tuple[set[tuple[int, int]], set[tuple[int, int]], list[str], int, bool]:
    input = utils.get_input_by_group_of_lines()

    grid: set[tuple[int, int]] = set() # Contains every position, including the stones
    stones: set[tuple[int, int]] = set()

    for row, line in enumerate(input[0]):
        for column, char in enumerate(line):
            if char != " ": grid.add((row + 1, column + 1))
            if char == "#": stones.add((row + 1, column + 1))
    
    instructions: list[str] = re.split("(L|R)", input[1][0])
    cube_size = int((len(grid) / 6) ** 0.5) # sqrt == pow(0.5)
    is_sample = True if utils.is_sample_input() else False

    return (grid, stones, instructions, cube_size, is_sample)

def travel(grid: set[tuple[int, int]], stones: set[tuple[int, int]], instructions: list[str], cube_size: int, use_cube: bool, is_sample: bool) -> int:
    # position = tuple(row, column, direction)
    position = (min(grid)[0], min(grid)[1], RIGHT)

    for instruction in instructions:
        if instruction.isnumeric():
            position = move(grid, stones, position, int(instruction), cube_size, use_cube, is_sample)
        else:
            position = change_direction(position, instruction)

    return 1000 * position[0] + 4 * position[1] + position[2]

def move(grid: set[tuple[int, int]], stones: set[tuple[int, int]], position: tuple[int, int, int], instruction: int, cube_size: int, use_cube: bool, is_sample: bool) -> tuple[int, int, int]:
    for _ in range(instruction):
        row, column, direction = position

        # Move 1 step in the direction
        if direction == RIGHT:
            column += int(1)
        elif direction == DOWN:
            row += int(1)
        elif direction == LEFT:
            column -= int(1)
        elif direction == UP:
            row -= int(1)

        # Check if we reached a stone
        if (row, column) in stones:
            break

        # If we are out of the grid, we change the face
        if (row, column) not in grid:
            row, column, direction = change_face(grid, (row, column, direction), cube_size, use_cube, is_sample)

        # Check again if we reached a stone
        if (row, column) in stones:
            break

        # Everything ok, we can execute the step
        position = (row, column, direction)

    return position

def change_face(grid: set[tuple[int, int]], position: tuple[int, int, int], cube_size: int, use_cube: bool, is_sample: bool) -> tuple[int, int, int]:
    # Part 2
    if use_cube:
        if is_sample:
            return change_cube_face_for_sample_input(position, cube_size)
        else:
            return change_cube_face_for_real_input(position, cube_size)

    # Part 1
    row, column, direction = position

    if direction == RIGHT:
        column = min([pos[1] for pos in grid if pos[0] == row])

    elif direction == DOWN:
        row = min([pos[0] for pos in grid if pos[1] == column])

    elif direction == LEFT:
        column = max([pos[1] for pos in grid if pos[0] == row])

    elif direction == UP:
        row = max([pos[0] for pos in grid if pos[1] == column])

    return (row, column, direction)

def change_cube_face_for_sample_input(position: tuple[int, int, int], cube_size: int) -> tuple[int, int, int]:

    #                /-----\
    #                |  1  |
    #    /-----X-----X-----X
    #    |  2  |  3  |  4  |
    #    \-----X-----X-----X-----\
    #                |  5  |  6  |
    #                \-----X-----/

    row, column, direction = position

    if direction == RIGHT:
        if 1 <= row <= 4: # Right out of 1
            direction = LEFT
            row = 13 - row
            column = 4 * cube_size
        elif 5 <= row <= 8: # Right out of 4
            direction = DOWN
            column = 21 - row
            row = 2 * cube_size + 1
        elif 9 <= row <= 12: # Right out of 6
            direction = LEFT
            row = 13 - row
            column = 3 * cube_size
    elif direction == DOWN:
        if 1 <= column <= 4: # Down out of 2
            direction = UP
            column = 13 - column
            row = 3 * cube_size
        elif 5 <= column <= 8: # Down out of 3
            direction = RIGHT
            row = 17 - column
            column = 3 * cube_size
        elif 9 <= column <= 12: # Down out of 5
            direction = UP
            column = 13 - column
            row = 2 * cube_size
        elif 13 <= column <= 16: # Down out of 6
            direction = RIGHT
            row = 21 - column
            column = 1
    elif direction == UP:
        if 1 <= column <= 4: # Up out of 2
            direction = DOWN
            column = 13 - column
            row = 1
        elif 5 <= column <= 8: # Up out of 3
            direction = RIGHT
            row = column - 4
            column = 2 * cube_size + 1
        elif 9 <= column <= 12: # Up out of 1
            direction = DOWN
            column = 13 - column
            row = cube_size + 1
        elif 13 <= column <= 16: # Up out of 6
            direction = LEFT
            row = 21 - column
            column = 3 * cube_size
    elif direction == LEFT:
        if 1 <= row <= 4: # Left out of 1
            direction = DOWN
            column = row - 4
            row = cube_size + 1
        elif 5 <= row <= 8: # Left out of 2
            direction = UP
            column = 21 - row
            row = 3 * cube_size
            
    return (row, column, direction)

def change_cube_face_for_real_input(position: tuple[int, int, int], cube_size: int) -> tuple[int, int, int]:

    #          /-----X-----\
    #          |  1  |  2  |
    #          X-----X-----/
    #          |  3  |
    #    /-----X-----X
    #    |  4  |  5  |
    #    X-----x-----/
    #    |  6  |
    #    \-----/

    row, column, direction = position

    if direction == RIGHT:
        if 1 <= row <= 50: # Right out of 2
            direction = LEFT
            row = 151 - row
            column = 2 * cube_size
        elif 51 <= row <= 100: # Right out of 3
            direction = UP
            column = 50 + row
            row = cube_size
        elif 101 <= row <= 150: # Right out of 5
            direction = LEFT
            row = 151 - row
            column = 3 * cube_size
        elif 151 <= row <= 200: # Right out of 6
            direction = UP
            column = row - 100
            row = 3 * cube_size
    elif direction == DOWN:
        if 1 <= column <= 50: # Down out of 6
            direction = DOWN
            column = column + 100
            row = 1
        elif 51 <= column <= 100: # Down out of 5
            direction = LEFT
            row = column + 100
            column = cube_size
        elif 101 <= column <= 150: # Down out of 2
            direction = LEFT
            row = column - 50
            column = 2 * cube_size
    elif direction == LEFT:
        if 1 <= row <= 50: # Left out of 1
            direction = RIGHT
            row = 151 - row
            column = 1
        elif 51 <= row <= 100: # Left out of 3
            direction = DOWN
            column = row - 50
            row = 2 * cube_size + 1
        elif 101 <= row <= 150: # Left out of 4
            direction = RIGHT
            row = 151 - row
            column = cube_size + 1
        elif 151 <= row <= 200: # Left out of 6
            direction = DOWN
            column = row - 100
            row = 1
    elif direction == UP:
        if 1 <= column <= 50: # Up out of 4
            direction = RIGHT
            row = column + 50
            column = cube_size + 1
        elif 51 <= column <= 100: # Up out of 1
            direction = RIGHT
            row = column + 100
            column = 1
        elif 101 <= column <= 151: # Up out of 2
            direction = UP
            column = column - 100
            row = 4 * cube_size

    return (row, column, direction)

def change_direction(position: tuple[int, int, int], instruction: str) -> tuple[int, int, int]:
    direction = position[2]
    if instruction == "R":
        direction = 0 if direction == 3 else direction + 1
    else:
        direction = 3 if direction == 0 else direction - 1

    return (position[0], position[1], direction)

utils.execute([ part1, part2 ])

# Part 1: 95358, took 136ms
# Part 2: 144361, took 17ms