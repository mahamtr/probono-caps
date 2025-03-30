using caps.Configuration;
using caps.Features.Agent.Service;
using caps.Features.ScheduledJobs;
using caps.Infrastructure.Blob;
using caps.Middleware;
using DotNetEnv;
using FastEndpoints;
using FastEndpoints.Security;
using FastEndpoints.Swagger;
using Hangfire;
using Hangfire.MemoryStorage;

var builder = WebApplication.CreateBuilder(args);
Env.Load();


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

builder.ConfigureMongoDb();

builder.Services.AddHangfire(config => config.UseMemoryStorage());
builder.Services.AddHangfireServer();

builder.Services.AddTransient<IBlobStorageService, BlobStorageService>();
builder.Services.AddTransient<IHashService, HashService>();

var app = builder.Build();

await app.Services.ApplyMigrationsAsync();

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