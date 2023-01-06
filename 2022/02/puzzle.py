# --- Day 2: Rock Paper Scissors ---
# https://adventofcode.com/2022/day/2

import sys
sys.path.insert(0, "..")

import utils

shapes = {
    "A": 1, # Rock
    "B": 2, # Paper
    "C": 3, # Scissors
    "X": 1, # Rock
    "Y": 2, # Paper
    "Z": 3, # Scissors
}

def part1() -> int:
    return calculate_score(use_top_secret_strategy = False)

def part2() -> int:
    return calculate_score(use_top_secret_strategy = True)

def calculate_score(use_top_secret_strategy) -> int:
    input = utils.get_input_by_line()
    
    score = int(0)
    for game in input:
        shapes = list(map(map_shape, game.split(" ")))
        
        opponent = shapes[0]
        me = shapes[1]
        if use_top_secret_strategy:
            me = calculate_my_shape(opponent, me)

        score += calculate_game(opponent, me)
        score += me

    return score

def map_shape(shape: str) -> int:
    return shapes[shape]

def calculate_game(opponent: int, me: int) -> int:
    if (opponent == me): return 3
    elif (opponent == ((me % 3) + 1)): return 0
    else: return 6

def calculate_my_shape(opponent: int, me: int) -> int:
    if (me == 1 and opponent == 1): return 3
    elif (me == 1): return opponent - 1
    elif (me == 2): return opponent
    else: return (opponent % 3) + 1

utils.execute([ part1, part2 ])

# Part 1: 13682, took 14ms
# Part 2: 12881, took 13ms