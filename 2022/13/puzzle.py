from functools import cmp_to_key

with open("input.txt", "r") as f:
    input = f.read().split("\n\n")

def is_int(value):
    return type(value) == int

def compare(left, right):
    if is_int(left) and is_int(right):
        return left - right
    
    if is_int(left):
        left = [left]
    
    if is_int(right):
        right = [right]
    
    for i in range(len(left)):
        if i >= len(right):
            return 1

        result = compare(left[i], right[i])
        if result != 0:
            return result

    return 0 if len(right) == len(left) else -1

def puzzle1():
    sum = 0
    for i, pair in enumerate(input):
        packets = pair.splitlines()
        if compare(eval(packets[0]), eval(packets[1])) < 0:
            sum += i + 1

    print(f"Puzzle 1: {sum}")

def puzzle2():
    packets = [eval(packet) for line in input for packet in line.splitlines()]

    first_divider = [[2]]
    second_divider = [[6]]
    packets.append(first_divider)
    packets.append(second_divider)

    sorted_packets = sorted(packets, key=cmp_to_key(compare))

    first_index = sorted_packets.index(first_divider) + 1
    second_index = sorted_packets.index(second_divider) + 1

    result = first_index * second_index

    print(f"Puzzle 2: {result}")

puzzle1()
puzzle2()