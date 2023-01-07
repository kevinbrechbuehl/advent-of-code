# --- Day 7: No Space Left On Device ---
# https://adventofcode.com/2022/day/7

import sys
sys.path.insert(0, "..")

import utils

class VirtualDirectory:
    def __init__(self: 'VirtualDirectory', name: str, parent: 'VirtualDirectory' = None):
        self.name: str = name
        self.parent: VirtualDirectory = parent
        self.sub_folders: list[VirtualDirectory] = []
        self.files: list[VirtualFile] = []

    def get_size(self: 'VirtualDirectory') -> int:
        total = int(0)
        for dir in self.sub_folders:
            total += dir.get_size()
        for file in self.files:
            total += file.size
        return total

class VirtualFile:
    def __init__(self: 'VirtualFile', name: str, size: int):
        self.name: str = name
        self.size: int = size

def part1() -> int:
    file_system = parse_filesystem()

    return total_size(file_system)

def part2() -> int:
    file_system = parse_filesystem()

    unused_space = 70000000 - file_system.get_size()
    required_space = 30000000 - unused_space

    directory_sizes = flatten_sizes(file_system)
    directory_sizes.sort()

    size = int(0)
    for dir_size in directory_sizes:
        if dir_size >= required_space:
            size = dir_size
            break

    return size

def parse_filesystem() -> VirtualDirectory:
    input = utils.get_input_by_line()
    current_dir = VirtualDirectory("/")

    for line in input:
        if line == "$ ls":
            continue
        elif line == "$ cd ..":
            current_dir = current_dir.parent
        elif line == "$ cd /":
            current_dir = root_directory(current_dir)
        elif line.startswith("$ cd"):
            name = line[5:]
            for dir in current_dir.sub_folders:
                if dir.name == name:
                    current_dir = dir
                    break
        elif line.startswith("dir"):
            name = line[4:]
            current_dir.sub_folders.append(VirtualDirectory(name, current_dir))
        else:
            size, name = line.split(" ")
            current_dir.files.append(VirtualFile(name, int(size)))

    return root_directory(current_dir)

def root_directory(dir: VirtualDirectory) -> VirtualDirectory:
    while dir.parent is not None:
        dir = dir.parent
    return dir
    
def total_size(dir: VirtualDirectory) -> int:
    total = int(0)
    dir_size = dir.get_size()
    if (dir_size < 100000):
        total += dir_size
    for folder in dir.sub_folders:
        total += total_size(folder)
    return total

def flatten_sizes(dir: VirtualDirectory) -> list[int]:
    sizes = [ dir.get_size() ]
    for folder in dir.sub_folders:
        sizes += flatten_sizes(folder)
    return sizes

utils.execute([ part1, part2 ])

# Part 1: 1667443, took 14ms
# Part 2: 8998590, took 14ms