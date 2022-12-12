from collections import deque

with open("input.txt", "r") as f:
    input = f.read().split("\n")

heightmap = []
starting_position = (0, 0)
ending_position = (0, 0)

for x, line in enumerate(input):
    heightmap.append([*line])
    for y, item in enumerate(line):
        if item == "S":
            heightmap[x][y] = "a"
            starting_position = (x, y)
        elif item == "E":
            heightmap[x][y] = "z"
            ending_position = (x, y)

rows = len(heightmap)
columns = len(heightmap[0])

# Traverse using breadth-first search algorithm (https://en.wikipedia.org/wiki/Breadth-first_search)
def traverse(start_x, start_y, is_end, top_down = False):
    visited = [(start_x, start_y)]
    queue = deque([(start_x, start_y, 0)])

    while len(queue) > 0:
        x, y, distance = queue.popleft()

        for next_x, next_y in [(x, y + 1), (x, y - 1), (x + 1, y), (x - 1, y)]:
            if next_x < 0 or next_x >= rows or next_y < 0 or next_y >= columns:
                continue

            if (next_x, next_y) in visited:
                continue

            height_a = heightmap[x][y] if top_down else heightmap[next_x][next_y]
            height_b = heightmap[next_x][next_y] if top_down else heightmap[x][y]

            if ord(height_a) - ord(height_b) > 1:
                continue

            if is_end(next_x, next_y):
                return distance + 1
            
            visited.append((next_x, next_y))
            queue.append((next_x, next_y, distance + 1))
            
def puzzle1():
    distance = traverse(starting_position[0], starting_position[1], lambda x, y: (x, y) == ending_position)
    print(f"Puzzle 1: {distance}")

def puzzle2():
    distance = traverse(ending_position[0], ending_position[1], lambda x, y: heightmap[x][y] == "a", True)
    print(f"Puzzle 2: {distance}")

puzzle1()
puzzle2()