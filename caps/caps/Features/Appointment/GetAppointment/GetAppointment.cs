using caps.Features.Appointment.Model;
using caps.Infrastructure.Data;
using FastEndpoints;
using IMapper = AutoMapper.IMapper;

namespace caps.Features.Appointment.GetAppointment;

public class GetAppointment(CapsDbContext dbContext, IMapper mapper) : EndpointWithoutRequest<AppointmentDto>
{
    public override void Configure()
    {
        Get("/api/appointment/{id}");
    }

    public override async Task HandleAsync( CancellationToken ct)
    {
        try
        {
            var id = Route<string>("id");
            var agent =  dbContext.Appointments.FirstOrDefault(a=> a.Id.ToString() == id);
            if(agent is null) ThrowError("Appointment not found.");
            await SendAsync(
                mapper.Map<AppointmentDto>(agent), cancellation: ct);
        }
        catch (Exception e)
        {
            throw new BadHttpRequestException(e.Message);
        }
    }
}