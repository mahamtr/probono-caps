using caps.Features.Appointment.Model;
using caps.Infrastructure.Data;
using FastEndpoints;
using IMapper = AutoMapper.IMapper;

namespace caps.Features.Appointment.GetCalendarAppointments;

public class GetCalendarAppointments(CapsDbContext dbContext, IMapper mapper) : EndpointWithoutRequest<IEnumerable<AppointmentDto>>
{
    public override void Configure()
    {
        Get("/api/appointment/calendar");
    }

    public override async Task HandleAsync(CancellationToken ct)
    {
        try
        {
            var startDate = Query<DateTime>("startDate");
            var endDate = Query<DateTime>("endDate");

            
            var userId = User.Claims.FirstOrDefault(c=> c.Type == "UserId")?.Value; 
            var role = User.Claims.FirstOrDefault(c=> c.Type == "role")?.Value;
            var appointments = role == "Admin" ? dbContext.Appointments : dbContext.Appointments.Where(a=> a.AgentId.ToString()== userId);

            appointments = appointments.Where(a => a.ScheduledDate >= startDate && a.ScheduledDate <= endDate);
            await SendAsync(mapper.Map<List<AppointmentDto>>(appointments.ToList()), cancellation: ct);
        }
        catch (Exception e)
        {
            throw new BadHttpRequestException(e.Message);
        }
    }
}