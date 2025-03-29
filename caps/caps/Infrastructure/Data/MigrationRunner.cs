using System.Reflection;
using MongoDB.Bson;
using MongoDB.Driver;

namespace caps.Infrastructure.Data;

public class MigrationRunner
{
    private readonly IMongoDatabase _database;
    private readonly IMongoCollection<BsonDocument> _migrationsCollection;

    public MigrationRunner(IMongoDatabase database)
    {
        _database = database;
        _migrationsCollection = _database.GetCollection<BsonDocument>("Migrations");
    }

    public async Task RunMigrationsAsync()
    {
        var appliedMigrations = await _migrationsCollection.Find(FilterDefinition<BsonDocument>.Empty)
            .ToListAsync();
        var appliedMigrationIds = appliedMigrations.Select(m => m["MigrationId"].AsInt32).ToHashSet();

        var migrationTypes = Assembly.GetExecutingAssembly().GetTypes()
            .Where(t => typeof(IMigration).IsAssignableFrom(t) && !t.IsInterface && !t.IsAbstract);

        var migrations = migrationTypes.Select(t => (IMigration)Activator.CreateInstance(t)!)
            .OrderBy(m => m.MigrationId); // Ensure migrations are sorted by MigrationId

        foreach (var migration in migrations)
        {
            if (appliedMigrationIds.Contains(migration.MigrationId))
                continue;

            Console.WriteLine($"Applying migration: {migration.MigrationId} - {migration.GetType().Name}");

            try
            {
                await migration.Up(_database);

                var migrationDocument = new BsonDocument
                {
                    { "MigrationId", migration.MigrationId },
                    { "AppliedAt", DateTime.UtcNow },
                    { "Name", migration.GetType().Name }, 
                    { "Description", migration.Description }
                };

                await _migrationsCollection.InsertOneAsync(migrationDocument);
                Console.WriteLine($"Migration {migration.MigrationId} applied successfully.");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Failed to apply migration {migration.MigrationId}: {ex.Message}");
                throw;
            }
        }
    }
}