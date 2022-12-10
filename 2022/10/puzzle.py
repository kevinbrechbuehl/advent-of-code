with open("input.txt", "r") as f:
    input = f.read().split("\n")

register = [1]
for instruction in input:
    register.append(register[-1])
    if instruction.startswith("addx"):
        register.append(register[-1] + int(instruction[5:]))

def signal_strengths():
    sum = 0
    for cycle in range(20, len(register), 40):
        sum += cycle * register[cycle-1]

    return sum

def print_crt():
    line = []
    for cycle, value in enumerate(register):
        if abs(value - cycle % 40) > 1:
            line.append(".")
        else:
            line.append("#")

        if ((cycle + 1) % 40 == 0):
            print("".join(line))
            line = []
        
def puzzle1():
    print(f"Puzzle 1: {signal_strengths()}")

def puzzle2():
    print(f"Puzzle 2:")
    print_crt()

puzzle1()
puzzle2()