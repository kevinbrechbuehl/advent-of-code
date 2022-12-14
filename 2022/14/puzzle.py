# --- Day 14: Regolith Reservoir ---
# https://adventofcode.com/2022/day/14

import sys
sys.path.insert(0, "..")

import utils

# As we have an endless void at the bottom, the lowest rock
# is relevant. If sand falls lower than the lowest rock,
# the number of sand has reached it's maximum.
def part1() -> int:
    return get_total_sand(is_endless_void = True)

# As we do not have an endless void, sand never falls out of 
# the map. The sand comes to rest at the lowest rock + 2, but
# a next sand can always be added, as long as it can move at
# least one position down.
def part2() -> int:
    return get_total_sand(is_endless_void = False)

# Add sand as long as the sand moved at least one position down (did
# not come to rest at the starting position) and came to rest before
# the bottom of the map.
def get_total_sand(is_endless_void: bool) -> int:
    occupied, lowest_rock = parse_input()

    bottom = lowest_rock if is_endless_void else lowest_rock + 2
    
    y = int(1)
    sum = int(0)
    
    while y < bottom and y > 0:
        y = add_sand(occupied, bottom if is_endless_void else bottom - 1)
        sum += 1

    # If the last sand fell into the endless void, we need to remove this
    # from the sum
    return sum if y == 0 else sum - 1

# Returns a tuple containing a set with all the rock coordinates
# and the y-coordinate of the lowest rock.
def parse_input() -> tuple[set, int]:
    input = utils.get_input_by_line()

    rocks = set()
    bottom = int(0)

    for line in input:
        edges = [list(map(int, edge.split(","))) for edge in line.split(" -> ")]

        # Add a rock for each coordinate between two edges in the line
        for i in range(len(edges) - 1):
            x_min = min(edges[i][0], edges[i+1][0])
            x_max = max(edges[i][0], edges[i+1][0])
            y_min = min(edges[i][1], edges[i+1][1])
            y_max = max(edges[i][1], edges[i+1][1])

            # Vertical lines: x_min == x_max
            # Horizontal lines: y_min == y_max
            for x in range(x_min, x_max + 1):
                for y in range(y_min, y_max + 1):
                    bottom = max(bottom, y)
                    rocks.add((x, y))

    return (rocks, bottom)

# Add new sand and go down until the sand comes to rest.
# If the sand comes to rest, it adds the coordinates
# to the list of occupied coordinates and returns
# the y-coordinate where it came to rest.
def add_sand(occupied: set, bottom: int) -> int:
    # Sand starting coordinates
    x = int(500)
    y = int(0)

    while True:
        # go straight down
        if (x, y+1) not in occupied and y < bottom:
            y += 1
        
        # go left down
        elif (x-1, y+1) not in occupied and y < bottom:
            x -= 1
            y += 1

        # go right down
        elif (x+1, y+1) not in occupied and y < bottom:
            x += 1
            y += 1
        
        # came to rest
        else:
            occupied.add((x, y))
            return y

utils.execute([ part1, part2 ])

# Part 1: 692, took 38ms
# Part 2: 31706, took 856ms