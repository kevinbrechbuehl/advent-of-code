# --- Day 21: Monkey Math ---
# https://adventofcode.com/2022/day/21

import sys
sys.path.insert(0, "..")

import utils

def part1() -> int:
    monkeys = parse_input()
    result = yell(monkeys, "root")
    return int(result)

def part2() -> int:
    monkeys = parse_input()

    # Set "humn" to None to find in which tree (left or right) the unknown value is
    monkeys["humn"] = None

    left_monkey, _, right_monkey = monkeys["root"]
    left_value = yell(monkeys, left_monkey)
    right_value = yell(monkeys, right_monkey)

    unknown_root_monkey = left_monkey if left_value is None else right_monkey
    expected_root_value = left_value if left_value is not None else right_value

    # Set "humn" to -1 and 1 to check if the final value is increasing with an 
    # increased value for "humn". It could also decrease if we calculate "/"
    # or "-" with the "humn" value.
    monkeys["humn"] = -1
    lower = yell(monkeys, unknown_root_monkey)
    monkeys["humn"] = 1
    higher = yell(monkeys, unknown_root_monkey)
    is_increasing: bool = higher > lower

    # Find "humn" value with a binary search, until the predicted value is the same
    # as the expected value from the other root tree (as the condition for the root
    # monkey is now ==)
    result = find_humn_value(monkeys, unknown_root_monkey, expected_root_value, is_increasing)
    return int(result)

def parse_input() -> dict[str, float | list[str]]:
    input = utils.get_input_by_line()
    
    monkeys: dict[str, float | list[str]] = {}
    
    for line in input:
        key, expression = line.split(": ")
        parts = expression.split(" ")
        monkeys[key] = float(parts[0]) if len(parts) == 1 else parts
    
    return monkeys

def yell(monkeys: dict[str, float | list[str]], monkey_id: str) -> float:
    monkey = monkeys[monkey_id]

    if monkey == None:
        return None

    elif isinstance(monkey, list):
        left = yell(monkeys, monkey[0])
        operator = monkey[1]
        right = yell(monkeys, monkey[2])

        if left == None or right == None:
            return None

        return calculate(left, operator, right)

    else:
        return monkey

def calculate(left: float, operator: str, right: float) -> float:
    if operator == "+": return left + right
    elif operator == "-": return left - right
    elif operator == "*": return left * right
    elif operator == "/": return left / right

def find_humn_value(monkeys: dict[str, float | list[str]], unknown_root_monkey_id: str, expected_root_value: float, is_increasing: bool) -> float:
    min = int(0)
    max = sys.maxsize

    while min < max:
        humn_value = (min + max) / 2
        monkeys["humn"] = humn_value

        value = yell(monkeys, unknown_root_monkey_id)
        difference = value - expected_root_value if is_increasing else expected_root_value - value

        if difference == 0:
            return humn_value
        elif difference > 0:
            max = humn_value
        else:
            min = humn_value

utils.execute([ part1, part2 ])

# Part 1: 38731621732448, took 15ms
# Part 2: 3848301405790, took 41ms