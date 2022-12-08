with open("input.txt", "r") as f:
    input = f.read().split("\n")

grid = [list(map(int, tree)) for tree in input]
grid_columns = list(zip(*grid))

def get_view(x, y):
    up = list(grid_columns[x][:y])
    left  = grid[y][:x]
    right = grid[y][x+1:]
    down = list(grid_columns[x][y+1:])

    return [up[::-1], left[::-1], right, down]

def get_score(tree, direction_view):
    score = 0
    for other in direction_view:
        score += 1
        if other >= tree:
            break
    return score

def puzzle1():
    sum = 0
    for y, row in enumerate(grid):
        for x, tree in enumerate(row):
            if any(tree > max(view or [-1]) for view in get_view(x, y)):
                sum += 1

    print(f"Puzzle 1: {sum}")

def puzzle2():
    score = 0
    for y, row in enumerate(grid):
        for x, tree in enumerate(row):
            tree_score = 1
            for direction in get_view(x, y):
                tree_score *= get_score(tree, direction)
            if tree_score > score:
                score = tree_score
            
    print(f"Puzzle 2: {score}")

puzzle1()
puzzle2()