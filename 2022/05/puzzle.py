with open("input.txt", "r") as f:
    input = f.read().split("\n\n")

initial_stack = input[0].split("\n")[::-1] # Reverse list
moves = input[1].split("\n")
number_of_stacks = len(initial_stack[0].replace(" ", ""))

def rearrange(model):
    stacks = {i: [] for i in range(number_of_stacks)}
    for row in initial_stack[1:]:
        for i, crate in enumerate(row):
            if i % 4 == 1 and not crate.isspace():
                stacks[int(i / 4)].append(crate)
        
    for move in moves:
        instructions = move.split(" ")
        number_of_crates = int(instructions[1])
        old_stack = stacks[int(instructions[3]) - 1]
        new_stack = stacks[int(instructions[5]) - 1]

        crates = [old_stack.pop() for _ in range(number_of_crates)]

        if model == "9001": crates.reverse()
            
        new_stack += crates

    return (''.join([stacks[i].pop() for i in stacks]))

def puzzle1():
    output = rearrange("9000")
    print(f"Puzzle 1: {output}")

def puzzle2():
    output = rearrange("9001")
    print(f"Puzzle 2: {output}")

puzzle1()
puzzle2()