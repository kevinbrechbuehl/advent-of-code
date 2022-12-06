with open("input.txt", "r") as f:
    input = f.read()

def find_marker(char_count):
    marker = char_count
    buffer = list(input[:char_count])
    for char in input[char_count:]:
        if len(set(buffer)) == char_count:
            return marker
        marker += 1
        buffer = buffer[1:] + [char]

def puzzle1():
    marker = find_marker(4)
    print(f"Puzzle 1: {marker}")

def puzzle2():
    marker = find_marker(14)
    print(f"Puzzle 2: {marker}")

puzzle1()
puzzle2()