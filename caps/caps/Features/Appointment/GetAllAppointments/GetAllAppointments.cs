using caps.Features.Appointment.Model;
using caps.Infrastructure.Data;
using FastEndpoints;
using IMapper = AutoMapper.IMapper;

namespace caps.Features.Appointment.GetAllAppointments;

public class GetAllAppointments(CapsDbContext dbContext, IMapper mapper) : EndpointWithoutRequest<IEnumerable<AppointmentDto>>
{
    public override void Configure()
    {
        Get("/api/appointment/getAll");
    }

    public override async Task HandleAsync(CancellationToken ct)
    {
        try
        {
            var appointments = dbContext.Appointments;
            await SendAsync(mapper.Map<List<AppointmentDto>>(appointments.ToList()), cancellation: ct);
        }
        catch (Exception e)
        {
            throw new BadHttpRequestException(e.Message);
        }
    }
}