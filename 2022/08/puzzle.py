# --- Day 8: Treetop Tree House ---
# https://adventofcode.com/2022/day/8

import sys
sys.path.insert(0, "..")

import utils

def part1() -> int:
    grids = get_grids()

    sum = int(0)
    for y, row in enumerate(grids[0]):
        for x, tree in enumerate(row):
            # A tree is visible if all of the other trees between it and an edge
            # of the grid are shorter than it.
            if any(tree > max(view or [-1]) for view in get_views(grids, x, y)):
                sum += 1

    return sum

def part2() -> int:
    grids = get_grids()

    best_score = int(0)
    for y, row in enumerate(grids[0]):
        for x, tree in enumerate(row):
            tree_score = int(1)

            # Calculate scenic score for the tree
            for direction in get_views(grids, x, y):
                tree_score *= get_viewing_distance(tree, direction)
            
            best_score = max(best_score, tree_score)
            
    return best_score

# Returns a tuple of grids, where the first item is the original grid and
# the second contains an inverted grid (rows/column inverted).
def get_grids() -> tuple[list[list[int]], list[list[int]]]:
    input = utils.get_input_by_line()

    grid = [list(map(int, tree)) for tree in input]
    inverted_grid = list(zip(*grid))

    return (grid, inverted_grid)

# Returns a tuple(up, left, right, down) where each item/direction is a
# list of trees which are in the view of the given tree.
def get_views(grids: tuple[list[list[int]], list[list[int]]], x: int, y: int) -> tuple[list[int], list[int], list[int], list[int]]:
    original_grid = grids[0]
    inverted_grid = grids[1]
    
    up = list(inverted_grid[x][:y])
    left  = original_grid[y][:x]
    right = original_grid[y][x+1:]
    down = list(inverted_grid[x][y+1:])

    # Reverse up and left to get the correct ordering
    return (up[::-1], left[::-1], right, down)

# Returns number of trees which are visible from the given tree.
def get_viewing_distance(tree: int, direction_view: list[int]) -> int:
    score = int(0)

    for other_tree in direction_view:
        score += 1
        if other_tree >= tree:
            break

    return score

utils.execute([ part1, part2 ])

# Part 1: 1779, took 66ms
# Part 2: 172224, took 43ms