using caps.Features.Appointment.Model;
using caps.Infrastructure.Data;
using FastEndpoints;
using IMapper = AutoMapper.IMapper;

namespace caps.Features.Appointment.GetAppointments;

public class GetAppointments(CapsDbContext dbContext, IMapper mapper) : EndpointWithoutRequest<IEnumerable<AppointmentDto>>
{
    public override void Configure()
    {
        Get("/api/appointment/list");
    }

    public override async Task HandleAsync(CancellationToken ct)
    {
        try
        {
            var userId = User.Claims.FirstOrDefault(c=> c.Type == "UserId")?.Value; 
            var role = User.Claims.FirstOrDefault(c=> c.Type == "role")?.Value;
            var appointments = role == "Admin" ? dbContext.Appointments : dbContext.Appointments.Where(a=> a.AgentId.ToString()== userId);
            await SendAsync(mapper.Map<List<AppointmentDto>>(appointments.ToList()), cancellation: ct);
        }
        catch (Exception e)
        {
            throw new BadHttpRequestException(e.Message);
        }
    }
}