class ValueWrapper:
    def __init__(self, value):
        self.value = value

with open("input.txt", "r") as f:
    input = f.read().split("\n")

data = [ValueWrapper(int(line)) for line in input]
zero = next(wrapper for wrapper in data if wrapper.value == 0)

def mix(original, sorted, iterations = 1):
    length = len(sorted)

    for _ in range(iterations):
        for wrapper in original:
            old_index = sorted.index(wrapper)
            new_index = (old_index + wrapper.value) % (length - 1)
            new_index = length - 1 if new_index == 0 else new_index # Wrap to the end if new index is 0

            sorted.insert(new_index, sorted.pop(old_index))

    return sorted

def get_grove_coordinates(sorted):
    length = len(sorted)
    zero_index = sorted.index(zero)
    result = sum([sorted[(zero_index + v * 1000) % length].value for v in range(1, 4)])

    return result

def puzzle1():
    sorted = mix(data, list(data))
    result = get_grove_coordinates(sorted)

    print(f"Puzzle 1: {result}")

def puzzle2():
    # We directly modify the "global" data here which would also change the
    # input of puzzle 1. To make this method more independently we need to create
    # separate wrapper references for each puzzle. As we do not execute
    # puzzle 1 after puzzle 2 it should be fine for this use case here.
    for wrapper in data:
        wrapper.value *= 811589153

    sorted = mix(data, list(data), iterations = 10)
    result = get_grove_coordinates(sorted)

    print(f"Puzzle 2: {result}")

puzzle1()
puzzle2()