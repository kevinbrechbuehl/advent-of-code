with open("input.txt", "r") as f:
    input = f.read().split("\n")

dict = {
    "A": 1, # Rock
    "B": 2, # Paper
    "C": 3, # Scissors
    "X": 1, # Rock
    "Y": 2, # Paper
    "Z": 3, # Scissors
}

def map_shape(shape):
  return dict[shape]

def puzzle1():
    def calculate_score(opponent, me):
        if (opponent == me): return 3
        elif (opponent == ((me % 3) + 1)): return 0
        else: return 6
    
    score = 0
    for game in input:
        shapes = list(map(map_shape, game.split(" ")))
        score += calculate_score(shapes[0], shapes[1]) # Add score
        score += shapes[1] # Add my shape value

    print(f"Puzzle 1: {score}")

def puzzle2():
    def my_shape(opponent, me):
        if (me == 1 and opponent == 1): return 3
        elif (me == 1): return opponent - 1
        elif (me == 2): return opponent
        else: return (opponent % 3) + 1

    def calculate_score(opponent, me):
        if (opponent == me): return 3
        elif (opponent == ((me % 3) + 1)): return 0
        else: return 6
    
    score = 0
    for game in input:
        shapes = list(map(map_shape, game.split(" ")))
        opponent = shapes[0]
        me = my_shape(opponent, shapes[1])
        score += calculate_score(opponent, me) # Add score
        score += me # Add my shape value

    print(f"Puzzle 2: {score}")

puzzle1()
puzzle2()