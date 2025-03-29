using caps.Infrastructure.Data;
using caps.Infrastructure.Data.Migrations;
using Microsoft.EntityFrameworkCore;
using MongoDB.Driver;

namespace caps.Configuration;

public static class MongoDbExtensions
{
    public static WebApplicationBuilder ConfigureMongoDb(this WebApplicationBuilder builder)
    {
        builder.Services.AddSingleton<IMongoClient>(_ => new MongoClient(Environment.GetEnvironmentVariable("MONGO_DATABASE_URL")));

        builder.Services.AddScoped<CapsDbContext>(provider =>
        {
            var client = provider.GetRequiredService<IMongoClient>();
            var options = new DbContextOptionsBuilder<CapsDbContext>().Options;
            return new CapsDbContext(options, client);
        });
        return builder;
    }
    
    public static async Task ApplyMigrationsAsync(this IServiceProvider serviceProvider)
    {
        using var scope = serviceProvider.CreateScope();
        var mongoClient = scope.ServiceProvider.GetRequiredService<IMongoClient>();
        var databaseName = Environment.GetEnvironmentVariable("MONGO_DATABASE_NAME");
        var database = mongoClient.GetDatabase(databaseName);

        var migrationRunner = new MigrationRunner(database);
        await migrationRunner.RunMigrationsAsync();
    }
}