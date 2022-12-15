# --- Day 15: Beacon Exclusion Zone ---
# https://adventofcode.com/2022/day/15

import sys
sys.path.insert(0, "..")

import utils

def part1() -> int:
    RESULT_LINE = 2000000 if not utils.is_sample_input() else 10

    # Set of all x-coordinates where there is no beacon at the result line
    no_beacons: set[int] = set()

    for sensor in get_sensors():
        x, y, distance = sensor

        # Calculate the distance left between the current
        # sensor y-coordinate and the result line
        distance_left = distance - abs(y - RESULT_LINE)
        
        # If the current sensor can reach the result line, we
        # know that there is no beacon in every x-coordinate
        # which is reachable by the distance left
        if distance_left > 0:
            for i in range(x - distance_left, x + distance_left):
                no_beacons.add(i)

    return len(no_beacons)

def part2() -> int:
    sensors = get_sensors()
    distress_beacon = find_distress_beacon(sensors)
    tuning_frequency = distress_beacon[0] * 4000000 + distress_beacon[1]
    
    return tuning_frequency

# Parse input and get a set of sensors as tuple[x, y, distance to beacon]
def get_sensors() -> set[tuple[int, int, int]]:
    input = utils.get_input_by_line()
    sensors: set[tuple[int, int, int]] = set()

    for line in input:
        parts = line.split(" ")

        sensor_x = int(parts[2][2:-1])
        sensor_y = int(parts[3][2:-1])
        beacon_x = int(parts[8][2:-1])
        beacon_y = int(parts[9][2:])

        distance = abs(sensor_x - beacon_x) + abs(sensor_y - beacon_y)

        sensors.add((sensor_x, sensor_y, distance))

    return sensors

# Because there is only one distress beacon available, the
# distress beacon must be at distance + 1 from any sensor
def find_distress_beacon(sensors: set[tuple[int, int, int]]) -> tuple[int, int]:
    for sensor in sensors:
        x, y, distance = sensor

        # Loop for each x-coodinate +/- 1 within the range of the sensor
        for i in range(x - distance - 1, x + distance + 1):
            # Calculate distance left for y-coordinate
            distance_left = distance - abs(x - i) + 1
            
            position_above = (i, y - distance_left)
            if is_distress_beacon(sensors, position_above):
                return position_above

            position_below = (i, y + distance_left)
            if is_distress_beacon(sensors, position_below):
                return position_below

# Check if the given position is in reach of any other sensor
def is_distress_beacon(sensors: set[tuple[int, int, int]], position: tuple[int, int]) -> bool:
    MAX_COORDINATE = 4000000 if not utils.is_sample_input() else 20

    # Out of range
    position_x, position_y = position
    if position_x < 0 or position_x > MAX_COORDINATE or position_y < 0 or position_y > MAX_COORDINATE:
        return False

    # Position is within distance of another sensor -> can't be distress beacon
    for sensor in sensors:
        sensor_x, sensor_y, sensor_distance = sensor
        distance = abs(sensor_x - position_x) + abs(sensor_y - position_y)

        if distance < sensor_distance:
            return False

    return True

utils.execute([ part1, part2 ])

# Part 1: 5176944, took 773ms
# Part 2: 13350458933732, took 6.567s