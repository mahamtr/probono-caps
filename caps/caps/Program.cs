using caps.Features.Agent.Service;
using caps.Infrastructure.Data;
using DotNetEnv;
using FastEndpoints;
using FastEndpoints.Security;
using FastEndpoints.Swagger;
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
            builder.WithOrigins("http://localhost:4200")
                .AllowAnyHeader()
                .AllowAnyMethod();
        });
});

builder.Services.AddAutoMapper(typeof(Program));

var client = new MongoClient(Environment.GetEnvironmentVariable("MONGO_DATABASE_URL"));
var db = CapsDbContext.Create(client.GetDatabase(Environment.GetEnvironmentVariable("MONGO_DATABASE_NAME")));

builder.Services.AddSingleton(db);
builder.Services.AddTransient<IHashService, HashService>();

builder.Services.AddAuthorizationBuilder().AddPolicy("AdminOnly", x => x.RequireRole("Admin"));

var app = builder.Build();

//app.UseHttpsRedirection();
// TODO add https support before deployment, should create docker compose override

app.UseCors("AllowOrigin");

app.UseAuthentication().UseAuthorization().UseFastEndpoints().UseSwaggerGen();
app.Run();