import sys
import time

def get_input() -> str:
    name = "input.txt" if not is_sample_input() else "sample.txt"

    with open(name, "r") as file:
        return file.read()

def get_input_by_line() -> list[str]:
    return get_input().splitlines()

def get_input_by_group_of_lines() -> list[list[str]]:
    groups = get_input().split("\n\n")
    return [ line.splitlines() for line in groups ]

def is_sample_input() -> bool:
    return "-sample" in sys.argv

def execute(functions: list[callable]) -> None:
    for i, function in enumerate(functions):
        start = time.time()
        
        result = function()

        end = time.time()
        duration = format_duration(start, end)

        print(f"Part {i + 1}: {result}, took {duration}")

def format_duration(start: float, end: float) -> str:
    duration = end - start # in seconds
    if duration < 1:
        return "{:.0f}ms".format(duration * 1000)
    else:
        return "{:.3f}s".format(duration)