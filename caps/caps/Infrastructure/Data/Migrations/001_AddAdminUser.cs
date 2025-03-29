using caps.Features.Agent.Model;
using caps.Features.Agent.Service;
using MongoDB.Driver;

namespace caps.Infrastructure.Data.Migrations;

public class AddAdminUserMigration : IMigration
{
    public int MigrationId => 1;
    public string Name => "Creating_Admin_User";

    public async Task Up(IMongoDatabase database)
    {
        var agentsCollection = database.GetCollection<Agent>("Agents");

        var existingAdmin = await agentsCollection.Find(a => a.Email == "admin@caps.com").FirstOrDefaultAsync();
        if (existingAdmin != null)
        {
            Console.WriteLine("Admin user already exists. Skipping creation.");
            return;
        }

        var adminPasswordHash = Environment.GetEnvironmentVariable("ADMIN_DEFAULT_PASSWORD_HASH") ?? throw new InvalidOperationException("ADMIN_DEFAULT_PASSWORD_HASH environment variable is not set");

        var admin = new Agent
        {
            FirstName = "Admin",
            LastName = "User",
            IDNumber = "0801199912345",
            Email = "admin@caps.com",
            DateOfBirth = new DateTime(1999, 1, 8),
            Privilege = "Admin",
            ContactInformation = new ContactInformation
            {
                PhoneNumber = "99887766",
                City = "Tegucigalpa",
                Address = "123 Main St",
                State = "Francisco Morazán"
            },
            Biography = "System Administrator",
            Password = adminPasswordHash,
            IsActive = true
        };

        await agentsCollection.InsertOneAsync(admin);
        Console.WriteLine("Admin user created successfully.");
    }
}