using MongoDB.Driver;

namespace caps.Infrastructure.Data;

public interface IMigration
{
    int MigrationId { get; }
    string Name { get; }
    Task Up(IMongoDatabase database);
}