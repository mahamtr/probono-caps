using caps.Features.Appointment.Model;
using caps.Infrastructure.Data;
using FastEndpoints;
using IMapper = AutoMapper.IMapper;

namespace caps.Features.Appointment.GetMyAppointments;

public class GetAllMyAppointments(CapsDbContext dbContext, IMapper mapper) : EndpointWithoutRequest<IEnumerable<AppointmentDto>>
{
    public override void Configure()
    {
        Get("/api/appointment/getAllMy");
    }

    public override async Task HandleAsync(CancellationToken ct)
    {
        string tokenClaimUserId = string.Empty;
        // TODO fill this from a claim
        try
        {
            var appointments = dbContext.Appointments.Where(a => a.AgentId.ToString() == tokenClaimUserId);
            await SendAsync(mapper.Map<List<AppointmentDto>>(appointments.ToList()), cancellation: ct);
        }
        catch (Exception e)
        {
            throw new BadHttpRequestException(e.Message);
        }
    }
}