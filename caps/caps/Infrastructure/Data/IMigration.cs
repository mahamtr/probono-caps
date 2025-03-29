using MongoDB.Driver;

namespace caps.Infrastructure.Data;

public interface IMigration
{
    int MigrationId { get; }
    string Description { get; }
    Task Up(IMongoDatabase database);
}