# --- Day 11: Monkey in the Middle ---
# https://adventofcode.com/2022/day/11

from collections import deque
from functools import reduce
from operator import mul

import sys
sys.path.insert(0, "..")

import utils

class Monkey:
    def __init__(self: 'Monkey'):
        self.items = deque[int]()
        self.operation = None
        self.divisible = int(-1)
        self.monkey_true = int(-1)
        self.monkey_false = int(-1)
        self.inspections = int(0)

def part1() -> int:
    monkeys = get_monkeys()
    level = play(monkeys, 20)

    return level

def part2() -> int:
    monkeys = get_monkeys()

    # We can use the least common multiple of all divisible values
    # to work around the huge number for the worry level. I didn't
    # come to this solution on my own, thanks to the community for
    # helping me out :)
    least_common_multiple: int = reduce(mul, [m.divisible for m in monkeys])

    level = play(monkeys, 10000, least_common_multiple)

    return level

def get_monkeys() -> list[Monkey]:
    input = utils.get_input_by_group_of_lines()

    monkeys: list[Monkey] = []
    for definitions in input:
        monkey = Monkey()
        monkey.items = deque(map(int, definitions[1].split(": ")[1].split(", ")))
        monkey.operation = eval(f"lambda old: {definitions[2].split('= ')[1]}")
        monkey.divisible = int(definitions[3].split(" ")[-1])
        monkey.monkey_true = int(definitions[4].split(" ")[-1])
        monkey.monkey_false = int(definitions[5].split(" ")[-1])

        monkeys.append(monkey)

    return monkeys

def play(monkeys: list[Monkey], rounds: int, least_common_multiple: int = None) -> int:
    for _ in range(rounds):
        for monkey in monkeys:
            while len(monkey.items) > 0:
                item = monkey.items.popleft()

                # Calculate worry level
                worry_level: float = monkey.operation(item)
                if least_common_multiple is None:
                    worry_level //= 3
                else:
                    worry_level %= least_common_multiple

                # Throw to next monkey
                if worry_level % monkey.divisible == 0:
                    monkeys[monkey.monkey_true].items.append(worry_level)
                else:
                    monkeys[monkey.monkey_false].items.append(worry_level)

                # Add another inspection
                monkey.inspections += 1

    inspections = sorted([m.inspections for m in monkeys])
    return inspections[-1] * inspections[-2]

utils.execute([ part1, part2 ])

# Part 1: 90294, took 11ms
# Part 2: 18170818354, took 314ms