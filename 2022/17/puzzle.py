import time

with open("input.txt", "r") as f:
    input = f.read()

CHAMBER_WIDTH = 7

def get_rock(type, top):
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

def move_left(rock): return [(x - 1, y) for (x,y) in rock]
def move_right(rock): return [(x + 1, y) for (x,y) in rock]
def move_down(rock): return [(x, y - 1) for (x,y) in rock]
def move_up(rock): return [(x, y + 1) for (x,y) in rock]

def has_collision(rock, chamber):
    if any([x == 0 or x == CHAMBER_WIDTH + 1 or y == 0 for (x,y) in rock]):
        return True
    
    for stone in rock:
        if stone in chamber:
            return True

    return False

# Cache key should contain the current jet, the current shape and
# the difference to the top for each column in the chamber
def get_cache_key(chamber, jet, shape, top):
    top_values = [0 for _ in range(CHAMBER_WIDTH)]
    
    for i in range(CHAMBER_WIDTH):
        for (x, y) in chamber:
            if x == i + 1:
                top_values[i] = max(top_values[i], y)
        top_values[i] = top - top_values[i]

    return (jet, shape, "_".join(map(str, top_values)))
        
def play(number_of_rocks):
    cache = {}
    
    chamber = set()
    top = 0

    shape_count = 0
    current_jet = 0
    
    added_by_pattern = 0
    
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

def execute_with_duration(number_of_rocks):
    start = time.time()
    top = play(number_of_rocks)
    end = time.time()
    return (top, "{:.2f}".format(end - start))

def puzzle1():
    result = execute_with_duration(2022)
    print(f"Puzzle 1: {result[0]}, took {result[1]}s")

def puzzle2():
    result = execute_with_duration(1000000000000)
    print(f"Puzzle 2: {result[0]}, took {result[1]}s")

puzzle1()
puzzle2()