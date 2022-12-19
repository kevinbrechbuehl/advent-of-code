# --- Day 17: Pyroclastic Flow ---
# https://adventofcode.com/2022/day/17

import sys
sys.path.insert(0, "..")

import utils

CHAMBER_WIDTH = 7

def part1() -> int:
    return play(2022)

def part2() -> int:
    return play(1000000000000)

def play(number_of_rocks: int) -> int:
    input = utils.get_input()
    cache: dict[str, tuple[int, int]] = {}
    
    chamber: set[tuple[int, int]] = set()
    top = int(0)

    shape_count = int(0)
    current_jet = int(0)
    
    added_by_pattern = int(0)
    
    while shape_count < number_of_rocks:
        rock = get_rock(shape_count % 5, top)
        
        while True:
            if input[current_jet] == "<":
                rock = move_left(rock)
                if has_collision(rock, chamber): # out of space left -> move back
                    rock = move_right(rock)
            else:
                rock = move_right(rock)
                if has_collision(rock, chamber): # out of space right -> move back
                    rock = move_left(rock)

            current_jet = (current_jet + 1) % len(input)

            rock = move_down(rock)
            if has_collision(rock, chamber): # has come to rest
                rock = move_up(rock)
                
                # Add each stone to the chamber and calculate new top
                for stone in rock:
                    chamber.add(stone)
                    top = max(top, stone[1])

                cacheKey = get_cache_key(chamber, current_jet, shape_count % 5, top)
                if cacheKey in cache:
                    (chached_shape_count, cached_top) = cache[cacheKey]

                    number_of_shapes = shape_count - chached_shape_count
                    pattern_length = top - cached_top

                    # How many times can the pattern be applied?
                    factor = (number_of_rocks - shape_count) // number_of_shapes

                    added_by_pattern += factor * pattern_length
                    shape_count += factor * number_of_shapes
                        
                cache[cacheKey] = (shape_count, top)

                break
                
        shape_count += 1

    return top + added_by_pattern

def get_rock(type: int, top: int) -> list[tuple[int, int]]:
    if type == 0:
        return [(3, top + 4), (4, top + 4), (5, top + 4), (6, top + 4)]
    elif type == 1:
        return [(4, top + 6), (3, top + 5), (4, top + 5), (5, top + 5), (4, top + 4)]
    elif type == 2:
        return [(5, top + 6), (5, top + 5), (3, top + 4), (4, top + 4), (5, top + 4)]
    elif type == 3:
        return [(3, top + 7), (3, top + 6), (3, top + 5), (3, top + 4)]
    elif type == 4:
        return [(3, top + 5), (4, top + 5), (3, top + 4), (4, top + 4)]

def move_left(rock: list[tuple[int, int]]) -> list[tuple[int, int]]:
    return [(x - 1, y) for (x,y) in rock]
def move_right(rock: list[tuple[int, int]]) -> list[tuple[int, int]]:
    return [(x + 1, y) for (x,y) in rock]
def move_down(rock: list[tuple[int, int]]) -> list[tuple[int, int]]:
    return [(x, y - 1) for (x,y) in rock]
def move_up(rock: list[tuple[int, int]]) -> list[tuple[int, int]]:
    return [(x, y + 1) for (x,y) in rock]

def has_collision(rock: list[tuple[int, int]], chamber: set[tuple[int, int]]) -> bool:
    if any([x == 0 or x == CHAMBER_WIDTH + 1 or y == 0 for (x,y) in rock]):
        return True
    
    for stone in rock:
        if stone in chamber:
            return True

    return False

# Cache key should contain the current jet, the current shape and
# the difference to the top for each column in the chamber
def get_cache_key(chamber: set[tuple[int, int]], jet: int, shape: int, top: int) -> str:
    top_values = [0 for _ in range(CHAMBER_WIDTH)]
    
    for i in range(CHAMBER_WIDTH):
        for (x, y) in chamber:
            if x == i + 1:
                top_values[i] = max(top_values[i], y)
        top_values[i] = top - top_values[i]

    return (jet, shape, "_".join(map(str, top_values)))

utils.execute([ part1, part2 ])

# Part 1: 3168, took 4.759s
# Part 2: 1554117647070, took 4.788s