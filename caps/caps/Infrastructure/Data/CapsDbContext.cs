using caps.Features.Agent.Model;
using caps.Features.Appointment.Model;
using Microsoft.EntityFrameworkCore;
using MongoDB.Driver;
using MongoDB.EntityFrameworkCore.Extensions;

namespace caps.Infrastructure.Data;

public class CapsDbContext : DbContext
{
    public DbSet<Agent> Agents { get; init; }
    public DbSet<Appointment> Appointments { get; init; }
    public DbSet<Patient> Patients { get; init; }
    
    private readonly IMongoClient _mongoClient;

    
    public CapsDbContext(DbContextOptions<CapsDbContext> options, IMongoClient mongoClient)
        : base(options)
    {
        _mongoClient = mongoClient;
    }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        if (optionsBuilder.IsConfigured) return;
        var databaseName = Environment.GetEnvironmentVariable("MONGO_DATABASE_NAME");
        optionsBuilder.UseMongoDB(_mongoClient, databaseName);
    }
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.Entity<Agent>().ToCollection("Agents");
        modelBuilder.Entity<Appointment>().ToCollection("Appointments");
        modelBuilder.Entity<Patient>().ToCollection("Patients");
    }
    
}