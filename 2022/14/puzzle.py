from functools import cmp_to_key

with open("input.txt", "r") as f:
    input = f.read().split("\n")

def get_wall():
    rocks = set()
    bottom = 0
    for line in input:
        edges = [list(map(int, edge.split(","))) for edge in line.split(" -> ")]
        for i in range(len(edges) - 1):
            x_min = min(edges[i][0], edges[i+1][0])
            x_max = max(edges[i][0], edges[i+1][0])
            y_min = min(edges[i][1], edges[i+1][1])
            y_max = max(edges[i][1], edges[i+1][1])

            for x in range(x_min, x_max + 1):
                for y in range(y_min, y_max + 1):
                    bottom = max(bottom, y)
                    rocks.add((x, y))

    return (rocks, bottom)

def add_sand(occupied, bottom):
    x = 500
    y = 0

    while True:
        if (x, y+1) not in occupied and y < bottom: # go straight down
            y += 1
        elif (x-1, y+1) not in occupied and y < bottom: # go left down
            x -= 1
            y += 1
        elif (x+1, y+1) not in occupied and y < bottom: # go right down
            x += 1
            y += 1
        else: # came to an end
            occupied.add((x, y))
            return y

def puzzle1():
    wall = get_wall()
    occupied = wall[0]
    bottom = wall[1]
    
    last_y = 1
    sum = 0
    
    while last_y < bottom and last_y > 0:
        last_y = add_sand(occupied, bottom)
        sum += 1

    print(f"Puzzle 1: {sum - 1}")

def puzzle2():
    wall = get_wall()
    occupied = wall[0]
    bottom = wall[1] + 2
    
    last_y = 1
    sum = 0
    
    while last_y < bottom and last_y > 0:
        last_y = add_sand(occupied, bottom - 1)
        sum += 1

    print(f"Puzzle 2: {sum}")

puzzle1()
puzzle2()