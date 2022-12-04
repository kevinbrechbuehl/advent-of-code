with open("input.txt", "r") as file:
    input = file.read().split("\n\n")

def puzzle1():
    calories = []
    for elf in input:
        elf_calories = sum(map(int, elf.splitlines()))
        calories.append(elf_calories)

    print(f"Puzzle 1: {max(calories)}")

def puzzle2():
    calories = []
    for elf in input:
        elf_calories = sum(map(int, elf.splitlines()))
        calories.append(elf_calories)
    
    sorted_calories = sorted(calories)

    print(f"Puzzle 2: {sum(sorted_calories[-3:])}")

puzzle1()
puzzle2()