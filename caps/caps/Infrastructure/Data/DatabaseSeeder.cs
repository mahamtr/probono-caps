using caps.Features.Agent.Model;
using caps.Features.Agent.Service;
using MongoDB.Driver;

namespace caps.Infrastructure.Data;

public class DatabaseSeeder(CapsDbContext capsDbContext, IHashService hashService)
{
    public async Task SeedAsync()
    {
        await SeedAdminUser();
    }

    private async Task SeedAdminUser()
    {
        var existingAdmin = capsDbContext.Agents.FirstOrDefault(a => a.Email == "admin@caps.com");

        if (existingAdmin != null)
        {
            Console.WriteLine("Admin user already exists. Skipping creation.");
            return;
        }

        var adminPassword = Environment.GetEnvironmentVariable("ADMIN_DEFAULT_PASSWORD") ?? throw new InvalidOperationException("ADMIN_DEFAULT_PASSWORD environment variable is not set");
        var hashedPassword = hashService.GeneratePasswordHash(adminPassword);
        Console.WriteLine($"Generated admin password hash: {hashedPassword}");

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
            Password = hashedPassword,
            IsActive = true
        };

        capsDbContext.Agents.Add(admin);
        await capsDbContext.SaveChangesAsync();
        Console.WriteLine("Admin user created successfully.");
    }
}