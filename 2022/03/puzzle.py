with open("input.txt", "r") as f:
    input = f.read().split("\n")

def intersect(first, second):
    return list(set(first).intersection(second))

def priority(item_type):
    if item_type.isupper(): return ord(item_type) - 38
    else: return ord(item_type) - 96

def puzzle1():
    sum = 0
    for rucksack in input:
        compartment_length = int(len(rucksack) / 2)
        first = rucksack[:compartment_length]
        second = rucksack[compartment_length:]
        item_type = intersect(first, second)
        sum += priority(item_type[0])

    print(f"Puzzle 1: {sum}")

def puzzle2():
    sum = 0
    for index in range(0, len(input), 3):
        first = input[index]
        second = input[index + 1]
        third = input[index + 2]
        item_type = intersect(intersect(first, second), third)
        sum += priority(item_type[0])

    print(f"Puzzle 2: {sum}")

puzzle1()
puzzle2()