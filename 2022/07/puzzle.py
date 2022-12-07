class VirtualDirectory:
    def __init__(self, name, parent = None):
        self.name = name
        self.parent = parent
        self.sub_folders = []
        self.files = []

    def get_size(self):
        total = 0
        for dir in self.sub_folders:
            total += dir.get_size()
        for file in self.files:
            total += file.size
        return total

class VirtualFile:
    def __init__(self, name, size):
        self.name = name
        self.size = size

with open("input.txt", "r") as f:
    input = f.read().split("\n")

def root_directory(dir):
    while dir.parent is not None:
        dir = dir.parent
    return dir

def parse_filesystem():
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
    
def total_size(dir):
    total = 0
    dir_size = dir.get_size()
    if (dir_size < 100000):
        total += dir_size
    for folder in dir.sub_folders:
        total += total_size(folder)
    return total

def flatten_sizes(dir):
    sizes = [dir.get_size()]
    for folder in dir.sub_folders:
        sizes += flatten_sizes(folder)
    return sizes

file_system = parse_filesystem()

def puzzle1():
    size = total_size(file_system)
    print(f"Puzzle 1: {size}")

def puzzle2():
    unused_space = 70000000 - file_system.get_size()
    required_space = 30000000 - unused_space

    directory_sizes = flatten_sizes(file_system)
    directory_sizes.sort()

    size = 0
    for dir_size in directory_sizes:
        if dir_size >= required_space:
            size = dir_size
            break

    print(f"Puzzle 2: {size}")

puzzle1()
puzzle2()