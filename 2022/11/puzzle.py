from functools import reduce
from operator import mul
from collections import deque

class Monkey:
    def __init__(self):
        self.items = deque
        self.operation = None
        self.divisible = -1
        self.monkey_true = -1
        self.monkey_false = -1
        self.inspections = 0

with open("input.txt", "r") as f:
    input = f.read().split("\n\n")

def init_monkeys():
    monkeys = []
    for monkey_input in input:
        definitions = monkey_input.split("\n")

        monkey = Monkey()
        monkey.items = deque(map(int, definitions[1].split(": ")[1].split(", ")))
        monkey.operation = eval(f"lambda old: {definitions[2].split('= ')[1]}")
        monkey.divisible = int(definitions[3].split(" ")[-1])
        monkey.monkey_true = int(definitions[4].split(" ")[-1])
        monkey.monkey_false = int(definitions[5].split(" ")[-1])

        monkeys.append(monkey)

    return monkeys

def play(monkeys, rounds, factor = None):
    for _ in range(rounds):
        for monkey in monkeys:
            while len(monkey.items) > 0:
                item = monkey.items.popleft()

                worry_level = monkey.operation(item)
                if factor is None:
                    worry_level //= 3
                else:
                    worry_level %= factor # I didn't come to the solution here. Thanks to the community for helping me out :)

                throw_to = monkey.monkey_true if worry_level % monkey.divisible == 0 else monkey.monkey_false
                monkeys[throw_to].items.append(worry_level)

                monkey.inspections += 1

    inspections = sorted([m.inspections for m in monkeys])
    return inspections[-1] * inspections[-2]

def puzzle1():
    monkeys = init_monkeys()
    result = play(monkeys, 20)
    print(f"Puzzle 1: {result}")

def puzzle2():
    monkeys = init_monkeys()
    factor = reduce(mul, [m.divisible for m in monkeys])
    result = play(monkeys, 10000, factor)
    print(f"Puzzle 2: {result}")

puzzle1()
puzzle2()