var input = await File.ReadAllLinesAsync("input.txt");

int Total(int take)
{
    var sum = 0;
    var previous = input.Take(take).Select(int.Parse).Sum();
    for (var i = 1; i < input.Length; i++)
    {
        var current = input.Skip(i).Take(take).Select(int.Parse).Sum();
        if (current > previous)
        {
            sum++;
        }

        previous = current;
    }

    return sum;
}

void Puzzle1()
{
    Console.WriteLine($"Puzzle 1: {Total(1)}");
}

void Puzzle2()
{
    Console.WriteLine($"Puzzle 2: {Total(3)}");
}

Puzzle1();
Puzzle2();