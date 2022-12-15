with open("input.txt", "r") as f:
    input = f.read().split("\n")

signals = set() # (x, y, distance to beacon)

for line in input:
    parts = line.split(" ")
    signal_x = int(parts[2][2:-1])
    signal_y = int(parts[3][2:-1])
    beacon_x = int(parts[8][2:-1])
    beacon_y = int(parts[9][2:])

    distance = abs(signal_x - beacon_x) + abs(signal_y - beacon_y)

    signals.add((signal_x, signal_y, distance))

# Because there is only one distress beacon available, it must be within distance + 1 from any signal
def find_distress_beacon():
    for signal in signals:
        x, y, distance = signal[0], signal[1], signal[2]
        for i in range(x - distance - 1, x + distance + 1):
            delta = distance - abs(x - i) + 1
            
            position_above = (i, y - delta)
            if is_valid_beacon(position_above):
                return position_above

            position_below = (i, y + delta)
            if is_valid_beacon(position_below):
                return position_below

def is_valid_beacon(position):
    MAX_COORDINATE = 4000000

    x, y = position[0], position[1]
    if x < 0 or x > MAX_COORDINATE or y < 0 or y > MAX_COORDINATE:
        return False

    for signal in signals:
        signal_x, signal_y, signal_distance = signal[0], signal[1], signal[2]
        distance = abs(signal_x - x) + abs(signal_y - y)

        if distance < signal_distance:
            return False

    return True

def puzzle1():
    RESULT_LINE = 2000000
    invalid_positions = set()

    for signal in signals:
        x, y, distance = signal[0], signal[1], signal[2]
        distance_left = distance - abs(y - RESULT_LINE)
        
        if distance_left > 0:
            for i in range(x - distance_left, x + distance_left):
                invalid_positions.add(i)

    print(f"Puzzle 1: {len(invalid_positions)}")

def puzzle2():
    distress_beacon = find_distress_beacon()
    tuning_frequency = distress_beacon[0] * 4000000 + distress_beacon[1]
    
    print(f"Puzzle 2: {tuning_frequency}")

puzzle1()
puzzle2()