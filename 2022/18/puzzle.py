from collections import deque
import time

with open("input.txt", "r") as f:
    input = f.read().split("\n")

cubes = set()
for line in input:
    cubes.add(tuple(map(int, line.split(","))))

min_x = min(i[0] for i in cubes) - 1
max_x = max(i[0] for i in cubes) + 1
min_y = min(i[1] for i in cubes) - 1
max_y = max(i[1] for i in cubes) + 1
min_z = min(i[2] for i in cubes) - 1
max_z = max(i[2] for i in cubes) + 1

offsets = [(1, 0, 0), (-1, 0, 0), (0, 1, 0), (0, -1, 0), (0, 0, 1), (0, 0, -1)]

def is_exposed_surface(cube):
    return cube not in cubes

# Check if given cube is reachable from outside of the whole area using BFS algorithm
def is_exterior_surface(cube):

    visited = set()
    queue = deque([cube])

    while len(queue):
        cx, cy, cz = cube = queue.popleft()

        if cx < min_x or cx > max_x or cy < min_y or cy > max_y or cz < min_z or cz > max_z:
            return True
        
        if cube in visited or cube in cubes:
            continue

        visited.add(cube)

        for (ox, oy, oz) in offsets:
            queue.append((cx + ox, cy + oy, cz + oz))
        
    return False

def execute_with_duration(puzzle):
    start = time.time()
    
    area = 0
    for (cx, cy, cz) in cubes:
        for (ox, oy, oz) in offsets:
            cube = (cx + ox, cy + oy, cz + oz)
            if (puzzle == 1 and is_exposed_surface(cube)) or (puzzle == 2 and is_exterior_surface(cube)):
                area += 1

    end = time.time()
    return (area, "{:.2f}".format((end - start) * 1000))

def puzzle1():
    result = execute_with_duration(1)
    print(f"Puzzle 1: {result[0]}, took {result[1]}ms") # took 1.68ms

def puzzle2():
    result = execute_with_duration(2)
    print(f"Puzzle 2: {result[0]}, took {result[1]}ms") # took 1'801.87ms

puzzle1()
puzzle2()