using caps.Features.Agent.Service;
using caps.Infrastructure.Blob;
using caps.Infrastructure.Data;
using caps.Middleware;
using DotNetEnv;
using FastEndpoints;
using FastEndpoints.Security;
using FastEndpoints.Swagger;
using Microsoft.EntityFrameworkCore;
using MongoDB.Driver;

var builder = WebApplication.CreateBuilder(args);
Env.Load();

builder.Services
    .AddAuthenticationJwtBearer(s => s.SigningKey = Environment.GetEnvironmentVariable("JWT_SECRET_KEY"))
    .AddAuthorization()
    .AddFastEndpoints()
    .SwaggerDocument();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowOrigin",
        builder =>
        {
            // builder.WithOrigins("http://localhost:4200","http://client:4200")
                builder.
                    AllowAnyOrigin()
                    .AllowAnyHeader()
                .AllowAnyMethod();
            
        });
});

builder.Services.AddAutoMapper(typeof(Program));

builder.Services.AddSingleton<IMongoClient>(_ => new MongoClient(Environment.GetEnvironmentVariable("MONGO_DATABASE_URL")));

builder.Services.AddScoped<CapsDbContext>(provider =>
{
    var client = provider.GetRequiredService<IMongoClient>();
    var options = new DbContextOptionsBuilder<CapsDbContext>().Options;
    return new CapsDbContext(options, client);
});


builder.Services.AddTransient<IBlobStorageService, BlobStorageService>();
builder.Services.AddTransient<IHashService, HashService>();

builder.Services.AddAuthorizationBuilder().AddPolicy("AdminOnly", x => x.RequireRole("Admin"));

var app = builder.Build();

//app.UseHttpsRedirection();
// TODO add https support before deployment, should create docker compose override
app.UseMiddleware<LoggingMiddlware>();
app.UseCors("AllowOrigin");

app.UseAuthentication().UseAuthorization().UseFastEndpoints().UseSwaggerGen();
app.Run();