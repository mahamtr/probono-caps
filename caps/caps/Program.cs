using caps.Features.Agent.Service;
using caps.Features.ScheduledJobs;
using caps.Infrastructure.Blob;
using caps.Infrastructure.Data;
using caps.Middleware;
using DotNetEnv;
using FastEndpoints;
using FastEndpoints.Security;
using FastEndpoints.Swagger;
using Hangfire;
using Hangfire.MemoryStorage;
using Microsoft.EntityFrameworkCore;
using MongoDB.Driver;

var builder = WebApplication.CreateBuilder(args);
Env.Load();


var a = Environment.GetEnvironmentVariable("MONGO_DATABASE_URL");


builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowOrigin",
        d =>
        {
                d.
                    AllowAnyOrigin()
                    .AllowAnyHeader()
                .AllowAnyMethod();
            
        });
});

builder.Services
    .AddAuthenticationJwtBearer(s => s.SigningKey = Environment.GetEnvironmentVariable("JWT_SECRET_KEY"))
    .AddAuthorization()
    .AddFastEndpoints()
    .SwaggerDocument();

builder.Services.AddAutoMapper(typeof(Program));

builder.Services.AddSingleton<IMongoClient>(_ => new MongoClient(Environment.GetEnvironmentVariable("MONGO_DATABASE_URL")));

builder.Services.AddScoped<CapsDbContext>(provider =>
{
    var client = provider.GetRequiredService<IMongoClient>();
    var options = new DbContextOptionsBuilder<CapsDbContext>().Options;
    return new CapsDbContext(options, client);
});

builder.Services.AddHangfire(config => config.UseMemoryStorage());
builder.Services.AddHangfireServer();

builder.Services.AddTransient<IBlobStorageService, BlobStorageService>();
builder.Services.AddTransient<IHashService, HashService>();

builder.Services.AddAuthorizationBuilder().AddPolicy("AdminOnly", x => x.RequireRole("Admin"));

var app = builder.Build();
if (!app.Environment.IsDevelopment())
{
    app.UseStaticFiles();
}

app.UseHttpsRedirection();
app.UseCors("AllowOrigin");
app.UseMiddleware<LoggingMiddlware>();

if (!app.Environment.IsDevelopment())
{
    app.MapFallbackToFile("index.html");
}
app.UseHangfireServer();

// Schedule the daily job
RecurringJob.AddOrUpdate<ExpireOldAppointments>(
    "update-appointments-status",
    updater => updater.UpdateOldAppointmentsStatus(),
    Cron.Daily);

app
    .UseAuthentication().UseAuthorization()
    .UseFastEndpoints().UseSwaggerGen();
app.Run();