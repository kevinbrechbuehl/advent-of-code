SNAFU = {
    '=': -2,
    '-': -1,
    '0': 0,
    '1': 1,
    '2': 2
}

with open("input.txt", "r") as f:
    input = f.read().split("\n")

def to_base10(value):
    result = 0

    for i, digit in enumerate(reversed(value)):
        result += SNAFU[digit] * 5 ** i

    return result

def to_snafu(value):
    result = ""

    while value > 0:
        # With a normal modulo, we would get numbers 3 and 4,
        # which should be treated as = (5-2) and - (5-1). So we
        # add + 2 and can retrieve the SNAFU code much easier.
        value, remainder = divmod(value + 2, 5)
        result += "=-012"[remainder]

    return result[::-1] # Reversed

def puzzle1():
    base10_sum = sum(map(to_base10, input))
    result = to_snafu(base10_sum)

    print(f"Puzzle 1: {result}")

def puzzle2():
    print(f"Puzzle 2: No part 2 :)")

puzzle1()
puzzle2()