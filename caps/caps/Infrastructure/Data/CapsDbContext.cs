using caps.Features.Agent;
using caps.Features.Agent.Model;
using caps.Features.Appointment;
using caps.Features.Patient;
using Microsoft.EntityFrameworkCore;
using MongoDB.Driver;
using MongoDB.EntityFrameworkCore.Extensions;

namespace caps.Infrastructure.Data;

public class CapsDbContext : DbContext
{
    public DbSet<Agent> Agents { get; init; }
    public DbSet<Appointment> Appointments { get; init; }
    public DbSet<Patient> Patients { get; init; }
    
    public static CapsDbContext Create(IMongoDatabase database) =>
        new(new DbContextOptionsBuilder<CapsDbContext>()
            .UseMongoDB(database.Client, database.DatabaseNamespace.DatabaseName)
            .Options);

    public CapsDbContext(DbContextOptions options)
        : base(options)
    {
    }
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.Entity<Agent>().ToCollection("Agents");
        modelBuilder.Entity<Appointment>().ToCollection("Appointments");
        modelBuilder.Entity<Patient>().ToCollection("Patients");
    }
    
}