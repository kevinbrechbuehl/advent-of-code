with open("input.txt", "r") as f:
    input = f.read().split("\n")

def convert_range(sections):
    elements = list(map(int, sections.split("-")))
    return range(elements[0], elements[1])

def partial_overlap(first, second):
    return first.start <= second.start and first.stop >= second.stop or + \
        second.start <= first.start and second.stop >= first.stop

def full_overlap(first, second):
    return second.stop >= first.start and first.stop >= second.start

def puzzle1():
    sum = 0
    for pair in input:
        sections = pair.split(",")
        first = convert_range(sections[0])
        second = convert_range(sections[1])
        if (partial_overlap(first, second)): sum = sum + 1

    print(f"Puzzle 1: {sum}")

def puzzle2():
    sum = 0
    for pair in input:
        sections = pair.split(",")
        first = convert_range(sections[0])
        second = convert_range(sections[1])
        if (full_overlap(first, second)): sum = sum + 1

    print(f"Puzzle 2: {sum}")

puzzle1()
puzzle2()