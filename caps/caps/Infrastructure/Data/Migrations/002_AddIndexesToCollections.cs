using MongoDB.Bson;
using MongoDB.Driver;

namespace caps.Infrastructure.Data.Migrations;

public class AddIndexesToCollections : IMigration
{
    public int MigrationId => 2;
    public string Description => "Creating_IDNumber_Email_Indexes_Agent_Patient";

    public async Task Up(IMongoDatabase database)
    {
        // Ensure Patient collection exists before creating indexes
        var collectionNames = await database.ListCollectionNamesAsync();
        var collections = await collectionNames.ToListAsync();

        if (!collections.Contains("Patients"))
        {
            await database.CreateCollectionAsync("Patients");
            Console.WriteLine("Patients collection created.");
        }

        var patientCollection = database.GetCollection<BsonDocument>("Patients");
        var patientIndexes = new List<CreateIndexModel<BsonDocument>>
        {
            new CreateIndexModel<BsonDocument>(
                Builders<BsonDocument>.IndexKeys.Ascending("IDNumber"),
                new CreateIndexOptions { Unique = true })
        };

        await patientCollection.Indexes.CreateManyAsync(patientIndexes);
        Console.WriteLine("Unique index on IDNumber created for Patients collection.");

        // Create indexes for Agent collection
        var agentCollection = database.GetCollection<BsonDocument>("Agents");
        var agentIndexes = new List<CreateIndexModel<BsonDocument>>
        {
            new CreateIndexModel<BsonDocument>(
                Builders<BsonDocument>.IndexKeys.Ascending("IDNumber"),
                new CreateIndexOptions { Unique = true }),
            new CreateIndexModel<BsonDocument>(
                Builders<BsonDocument>.IndexKeys.Ascending("Email"),
                new CreateIndexOptions { Unique = true })
        };

        await agentCollection.Indexes.CreateManyAsync(agentIndexes);
        Console.WriteLine("Unique indexes on IDNumber and Email created for Agents collection.");
    }
}