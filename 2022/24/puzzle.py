from collections import defaultdict, deque
import time

DIRECTIONS = {
    '^': (-1, 0),
    'v': (1, 0),
    '<': (0, -1),
    '>': (0, 1)
}

with open("input.txt", "r") as f:
    input = f.read().split("\n")

# Get grid size
height = len(input) - 2
width = len(input[0]) - 2

# Initialize input
initial_blizzards = {}
starting_position = (-1, 0)
destination_position = (height, width - 1)

for row, line in enumerate(input[1:-1]):
    for column, char in enumerate(line[1:-1]):
        if char in DIRECTIONS:
            initial_blizzards[row, column] = char

# Initialize blizzard cache
blizzards_cache = [ initial_blizzards ]

# The state of the blizzards repeats every [width * height] of the grid
def get_blizzards_state(time):
    index = time % (width * height)

    if len(blizzards_cache) <= index:
        last_state = blizzards_cache[index - 1]

        new_state = defaultdict(list)

        for key in last_state.keys():
            for value in last_state[key]:
                delta = DIRECTIONS[value]

                new_row = (key[0] + delta[0]) % height
                new_column = (key[1] + delta[1]) % width

                # We append the current value, so if there are multiple blizzards
                # on the same field, we have both blizzards stored
                new_state[new_row, new_column].append(value)
        
        blizzards_cache.append(new_state)

    return blizzards_cache[index]

def play(start_time, start_position, end_position):
    visited = set()
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
            if new_position== end_position:
                return time

            # If the new position is still within the field but not in a blizzard -> go on
            if 0 <= new_row < height and 0 <= new_column < width and new_position not in blizzards:
                queue.append((time, new_position))
        
        # If we are not in a blizzard -> don't move and wait here
        if position not in blizzards:
            queue.append((time, position))

def execute_with_duration(number_of_rounds = 1):
    start_time = time.time()
    result = 0
    for i in range(number_of_rounds):
        start_position = starting_position if i % 2 == 0 else destination_position
        end_position = destination_position if i % 2 == 0 else starting_position

        result = play(result, start_position, end_position)

    end_time = time.time()
    return (result, "{:.2f}".format(end_time - start_time))

def puzzle1():
    result = execute_with_duration()
    print(f"Puzzle 1: {result[0]}, took {result[1]}s") # took 0.61s

def puzzle2():
    result = execute_with_duration(number_of_rounds = 3)
    print(f"Puzzle 2: {result[0]}, took {result[1]}s") # took 1.51s

puzzle1()
puzzle2()