var input = await File.ReadAllLinesAsync("input.txt");

Position GetPosition(Action<Position, Direction, int> moveAction)
{
    var position = new Position();
    foreach (var move in input)
    {
        var command = move.Split(" ");
        var direction = Enum.Parse<Direction>(command[0], ignoreCase: true);
        var value = int.Parse(command[1]);
        
        moveAction(position, direction, value);
    }

    return position;
}

void Move(Position position, Direction direction, int value)
{
    switch(direction)
    {
        case Direction.Forward:
            position.Horizontal += value;
            break;
        case Direction.Down:
            position.Depth += value;
            break;
        case Direction.Up:
            position.Depth -= value;
            break;
    }
}

void MoveWithAim(Position position, Direction direction, int value)
{
    switch(direction)
    {
        case Direction.Forward:
            position.Horizontal += value;
            position.Depth += position.Aim * value;
            break;
        case Direction.Down:
            position.Aim += value;
            break;
        case Direction.Up:
            position.Aim -= value;
            break;
    }
}

void Puzzle1()
{
    var position = GetPosition(Move);
    Console.WriteLine($"Puzzle 1: {position.Horizontal * position.Depth}");
}

void Puzzle2()
{
    var position = GetPosition(MoveWithAim);
    Console.WriteLine($"Puzzle 2: {position.Horizontal * position.Depth}");
}

Puzzle1();
Puzzle2();

public class Position
{
    public int Horizontal { get; set; }
    
    public int Depth { get; set; }
    
    public int Aim { get; set; }
}

public enum Direction
{
    Forward,
    Down,
    Up,
}