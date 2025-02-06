using caps.Features.Appointment.Model;
using caps.Infrastructure.Data;
using FastEndpoints;
using IMapper = AutoMapper.IMapper;

namespace caps.Features.Dashboard.GetLatestAppointments;

public class GetLatestAppointments(CapsDbContext dbContext, IMapper mapper)  : EndpointWithoutRequest<List<AppointmentTableDto>>
{
    public override void Configure()
    {
        Get("/api/dashboard/appointments");
    }

    public override async Task HandleAsync( CancellationToken ct)
    {
        try
        {
            var appointments = dbContext.Appointments.OrderBy(a=> a.ScheduledDate).ToList();
            var appoint = (from app in appointments.ToList()
            let patient = dbContext.Patients.First(p => p.Id == app.PatientId)
            select new AppointmentTableDto
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
            }).ToList();

            await SendAsync(
                appoint, cancellation: ct);
        }
        catch (Exception e)
        {
            throw new BadHttpRequestException(e.Message);
        }
    }
}