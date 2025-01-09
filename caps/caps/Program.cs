using System.Text;
using caps.Features.Agent.Service;
using caps.Features.Appointment.Service;
using caps.Infrastructure.Data;
using DotNetEnv;
using FastEndpoints;
using FastEndpoints.Security;
using FastEndpoints.Swagger;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using MongoDB.Driver;

var builder = WebApplication.CreateBuilder(args);
Env.Load();

builder.Services.AddAuthenticationJwtBearer(s=>
    s.SigningKey = Environment.GetEnvironmentVariable("JWT_SECRET_KEY")
    ).AddAuthorization().AddFastEndpoints().AddSwaggerDocument();


builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();


builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowOrigin",
        builder =>
        {
            builder.WithOrigins(Environment.GetEnvironmentVariable("MONGO_DATABASE_URL"))
                .AllowAnyHeader()
                .AllowAnyMethod();
        });
});

builder.Services.AddAutoMapper(typeof(Program)); 

// builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(
//     o =>
//     {
//         o.RequireHttpsMetadata = false;
//         o.TokenValidationParameters = new TokenValidationParameters();
//         o.TokenValidationParameters.IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Environment.GetEnvironmentVariable("JWT_SECRET_KEY")));
//         o.TokenValidationParameters.ValidIssuer = Environment.GetEnvironmentVariable("JWT_ISSUER");
//         o.TokenValidationParameters.ValidAudience = Environment.GetEnvironmentVariable("JWT_AUDIENCE");
//         o.TokenValidationParameters.ClockSkew = TimeSpan.Zero;
//     });

var client = new MongoClient("mongodb://mongodb:27017");
CapsDbContext db = CapsDbContext.Create(client.GetDatabase("sample_planets"));

builder.Services.AddSingleton(db);
builder.Services.AddTransient<IAgentService, AgentService>();
builder.Services.AddTransient<IPatientService, PatientService>();
builder.Services.AddTransient<IAppointmentService, AppointmentService>();
builder.Services.AddTransient<IAuthService, AuthService>();
builder.Services.AddTransient<IHashService, HashService>();

// builder.Services.AddControllers();

builder.Services.AddAuthorizationBuilder()
    // builder.Services.AddControllers();
                                         .AddPolicy("AdminOnly", x => x.RequireRole("Admin"));




var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

//app.UseHttpsRedirection();
// TODO add https support before deployment, should create docker compose override


app.UseCors("AllowOrigin");
// app.MapControllers();

app.UseAuthentication().UseAuthorization().UseFastEndpoints()
    .UseSwaggerGen(); //add this
app.Run();

