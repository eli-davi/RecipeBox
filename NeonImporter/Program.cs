
using Npgsql;

string? connectionString =
    Environment.GetEnvironmentVariable("ConnectionStrings__DefaultConnection");

if (string.IsNullOrWhiteSpace(connectionString) ||
    !connectionString.Contains("neon.tech", StringComparison.OrdinalIgnoreCase))
{
    Console.WriteLine("ERROR: Neon connection is not configured.");
    return;
}

string sqlPath = Path.GetFullPath(
    Path.Combine(AppContext.BaseDirectory,
        "../../../../recipes-import.sql"));

if (!File.Exists(sqlPath))
{
    Console.WriteLine($"SQL file not found: {sqlPath}");
    return;
}

string sql = await File.ReadAllTextAsync(sqlPath);

await using var connection = new NpgsqlConnection(connectionString);
await connection.OpenAsync();

await using var countCommand =
    new NpgsqlCommand("SELECT COUNT(*) FROM \"Recipes\";", connection);

long before = (long)(await countCommand.ExecuteScalarAsync() ?? 0L);

Console.WriteLine($"Recipes currently in Neon: {before}");
Console.Write("Import recipes? Type YES to continue: ");

if (Console.ReadLine() != "YES")
{
    Console.WriteLine("Import cancelled.");
    return;
}

await using var command = new NpgsqlCommand(sql, connection);
await command.ExecuteNonQueryAsync();

long after = (long)(await countCommand.ExecuteScalarAsync() ?? 0L);

Console.WriteLine($"Recipes in Neon after import: {after}");
Console.WriteLine("Import completed.");
