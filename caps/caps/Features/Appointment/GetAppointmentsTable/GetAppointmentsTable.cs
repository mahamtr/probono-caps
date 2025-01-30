using caps.Features.Appointment.Model;
using caps.Infrastructure.Data;
using FastEndpoints;
using IMapper = AutoMapper.IMapper;

namespace caps.Features.Appointment.GetAppointmentsTable;

public class GetAppointmentsTable(CapsDbContext dbContext, IMapper mapper) : EndpointWithoutRequest<List<AppointmentTableDto>>
{
    public override void Configure()
    {
        Get("/api/appointment/table");
    }

    public override async Task HandleAsync( CancellationToken ct)
    {
        try
        {
            
            var userId = User.Claims.FirstOrDefault(c=> c.Type == "UserId")?.Value; 
            var role = User.Claims.FirstOrDefault(c=> c.Type == "role")?.Value;
            var appointments = role == "Admin" ? dbContext.Appointments : dbContext.Appointments.Where(a=> a.AgentId.ToString()== userId);
            var appoint = new List<AppointmentTableDto>();
                
            foreach (var app in appointments)
            {
                //TODO find a way to map this with relationship, or modify mongo structure
                var patient = dbContext.Patients.First(p => p.Id == app.PatientId);
                appoint.Add(new AppointmentTableDto
                {
                    Id = app.Id.ToString(),
                    Age = patient.Age,
                    AppointmentDate = app.ScheduledDate,
                    Program = patient.Program,
                    Reason = app.Reason,
                    Status = app.Status,
                    Location = app.Destination,
                    Mode = app.Mode,
                    PatientName = patient.FirstName + ' ' + patient.LastName,

                });
            }
            
            await SendAsync(
                appoint, cancellation: ct);
        }
        catch (Exception e)
        {
            throw new BadHttpRequestException(e.Message);
        }
    }
}