using caps.Features.Agent;
using caps.Features.Agent.Service;
using caps.Features.Patient.Service;
using caps.Infrastructure.Data;
using MongoDB.Bson;
using MongoDB.Driver;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
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

builder.Services.AddAutoMapper(typeof(Program)); // Registriere Profile im selben Namespace


var client = new MongoClient("mongodb://mongodb:27017");
CapsDbContext db = CapsDbContext.Create(client.GetDatabase("sample_planets"));

builder.Services.AddSingleton(db);
builder.Services.AddTransient<IAgentService, AgentService>();
builder.Services.AddTransient<IPatientService, PatientService>();

builder.Services.AddControllers();


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
app.MapControllers();

app.Run();

