with open("input.txt", "r") as f:
    input = f.read().split("\n")

def get_move(direction):
    return {"R": (1, 0), "L": (-1, 0), "U": (0, 1), "D": (0, -1)}[direction]

def follow_knot(previous, current):
    distance_x = previous[0] - current[0]
    if (abs(distance_x) > 1):
        x = 1 if previous[0] > current[0] else -1
        y = 0 if previous[1] == current[1] else 1 if previous[1] > current[1] else -1
        return (current[0] + x, current[1] + y)

    distance_y = previous[1] - current[1]
    if (abs(distance_y) > 1):
        x = 0 if previous[0] == current[0] else 1 if previous[0] > current[0] else -1
        y = 1 if previous[1] > current[1] else -1
        return (current[0] + x, current[1] + y)

    return current

def play(number_of_knots):
    visited = set()
    knots = [(0, 0) for _ in range(number_of_knots)]
    
    for line in input:
        direction = line[0]
        distance = int(line[2:])
        move = get_move(direction)

        for _ in range(distance):
            knots[0] = (knots[0][0] + move[0], knots[0][1] + move[1])

            for i in range(1, number_of_knots):
                knots[i] = follow_knot(knots[i-1], knots[i])
                
            visited.add(knots[-1])

    return len(visited)

def puzzle1():
    visited = play(2)
    print(f"Puzzle 1: {visited}")

def puzzle2():
    visited = play(10)
    print(f"Puzzle 2: {visited}")

puzzle1()
puzzle2()