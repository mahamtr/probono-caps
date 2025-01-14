using caps.Features.Appointment.Model;
using caps.Infrastructure.Data;
using FastEndpoints;
using IMapper = AutoMapper.IMapper;

namespace caps.Features.Appointment.CreateAppointment;

public class CreateAppointment(CapsDbContext dbContext, IMapper mapper) : Endpoint<AppointmentDto, bool>
{
    public override void Configure()
    {
        Patch("/api/appointment/create");
    }

    public override async Task HandleAsync(AppointmentDto req, CancellationToken ct)
    {
        try
        {
            var newAppointment = new Model.Appointment();
            mapper.Map(req, newAppointment);
            dbContext.Appointments.Add(newAppointment);
            await SendAsync(
                await dbContext.SaveChangesAsync(ct) > 0, cancellation: ct);
        }
        catch (Exception e)
        {
            throw new BadHttpRequestException(e.Message);
        }
      
    }
}