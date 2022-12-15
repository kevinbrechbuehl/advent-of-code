var input = await File.ReadAllLinesAsync("input.txt");

IEnumerable<bool> GetMostCommonBits(string[] rows)
{
    for (var i = 0; i < rows[0].Length; i++)
    {
        yield return GetMostCommonBit(rows, i);
    }
}

bool GetMostCommonBit(string[] rows, int column)
{
    var count = rows.Sum(row => row[column] == '1' ? 1 : 0);
    return Math.Round((double)count / rows.Length, MidpointRounding.AwayFromZero) > 0;
}

string GetFilteredRating(string[] rows, bool invert = false)
{
    var value = string.Empty;
    while (rows.Length > 1)
    {
        var mostCommonBit = GetMostCommonBit(rows, value.Length) ^ invert;
        value += mostCommonBit ? "1" : "0";
        rows = rows.Where(row => row.StartsWith(value)).ToArray();
    }

    return rows.Single();
}

void Puzzle1()
{
    var mostCommonBits = GetMostCommonBits(input).ToArray();
    
    var gamaRate = string.Join("", mostCommonBits.Select(bit => bit ? "1" : "0"));
    var epsilonRate = string.Join("", mostCommonBits.Select(bit => bit ? "0" : "1"));
    
    Console.WriteLine($"Puzzle 1: {Convert.ToInt32(gamaRate, 2) * Convert.ToInt32(epsilonRate, 2)}");
}

void Puzzle2()
{
    var oxygenGeneratorRating = GetFilteredRating(input);
    var co2ScrubberRating = GetFilteredRating(input, invert: true);
    
    Console.WriteLine($"Puzzle 2: {Convert.ToInt32(oxygenGeneratorRating, 2) * Convert.ToInt32(co2ScrubberRating, 2)}");
}

Puzzle1();
Puzzle2();