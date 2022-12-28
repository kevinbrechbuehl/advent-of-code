import sys

with open("input.txt", "r") as f:
    input = f.read().split("\n")

monkeys = {}
for line in input:
    key, expression = line.split(": ")
    parts = expression.split(" ")
    monkeys[key] = int(parts[0]) if len(parts) == 1 else parts

def yell(monkey_id):
    monkey = monkeys[monkey_id]

    if monkey == None:
        return None

    elif isinstance(monkey, list):
        left = yell(monkey[0])
        operator = monkey[1]
        right = yell(monkey[2])

        if left == None or right == None:
            return None

        return calculate(left, operator, right)

    else:
        return monkey

def calculate(left, operator, right):
    if operator == "+": return left + right
    elif operator == "-": return left - right
    elif operator == "*": return left * right
    elif operator == "/": return left / right

def find_humn_value(unknown_root_monkey_id, expected_root_value, is_increasing):
    min = 0
    max = sys.maxsize

    while min < max:
        humn_value = (min + max) / 2
        monkeys["humn"] = humn_value

        value = yell(unknown_root_monkey_id)
        difference = value - expected_root_value if is_increasing else expected_root_value - value

        if difference == 0:
            return humn_value
        elif difference > 0:
            max = humn_value
        else:
            min = humn_value

def puzzle1():
    result = yell("root")
    print(f"Puzzle 1: {int(result)}")

def puzzle2():
    # Set "humn" to None to find in which tree (left or right) the unknown value is
    monkeys["humn"] = None

    left_monkey, _, right_monkey = monkeys["root"]
    left_value = yell(left_monkey)
    right_value = yell(right_monkey)

    unknown_root_monkey = left_monkey if left_value is None else right_monkey
    expected_root_value = left_value if left_value is not None else right_value

    # Set "humn" to -1 and 1 to check if the final value is increasing with an 
    # increased value for "humn". It could also decrease if we calculate "/"
    # or "-" with the "humn" value.
    monkeys["humn"] = -1
    lower = yell(unknown_root_monkey)
    monkeys["humn"] = 1
    higher = yell(unknown_root_monkey)
    is_increasing = higher > lower

    # Find "humn" value with a binary search, until the predicted value is the same
    # as the expected value from the other root tree (as the condition for the root
    # monkey is now ==)
    result = find_humn_value(unknown_root_monkey, expected_root_value, is_increasing)
    print(f"Puzzle 2: {int(result)}")

puzzle1()
puzzle2()