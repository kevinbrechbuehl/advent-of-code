import functools
import time

with open("input.txt", "r") as f:
    input = f.read().split("\n")

flows = {}
tunnels = {}

for line in input:
    parts = line.split(" ")
    valve = parts[1]
    flows[valve] =  int(parts[4][5:-1])
    tunnels[valve] = "".join(parts[9:]).split(",")

@functools.lru_cache(None)
def get_max_pressure(time_left, valve, opened, with_elephant):
    if time_left <= 0:
        # Add pressure of elephant for puzzle 2 (within the same graph)
        return 0 if not with_elephant else get_max_pressure(26, "AA", opened, False)
    
    pressure = 0

    # Open the valve, add pressure for it and go to each tunnel
    if flows[valve] > 0 and valve not in opened:
        valve_pressure = (time_left - 1) * flows[valve] 
        valve_opened = tuple(sorted(opened + (valve,)))
        for tunnel in tunnels[valve]:
            pressure = max(pressure, valve_pressure + get_max_pressure(time_left - 2, tunnel, valve_opened, with_elephant))

    # Go to each tunnel without opening the valve
    for tunnel in tunnels[valve]:
        pressure = max(pressure, get_max_pressure(time_left - 1, tunnel, opened, with_elephant))

    return pressure

def execute_with_duration(with_elephant):
    start = time.time()
    pressure = get_max_pressure(26 if with_elephant else 30, "AA", (), with_elephant)
    end = time.time()
    return (pressure, int((end - start) * 1000))

def puzzle1():
    result = execute_with_duration(False)
    print(f"Puzzle 1: {result[0]}, took {result[1]}ms") # took 936ms

def puzzle2():
    result = execute_with_duration(True)
    print(f"Puzzle 2: {result[0]}, took {result[1]}ms") # took 71'996ms

puzzle1()
puzzle2()