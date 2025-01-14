using caps.Features.Appointment.Model;
using caps.Infrastructure.Data;
using FastEndpoints;
using IMapper = AutoMapper.IMapper;

namespace caps.Features.Appointment.UpdateAppointment;

public class UpdateAppointment(CapsDbContext dbContext, IMapper mapper) : Endpoint<AppointmentDto, bool>
{
    public override void Configure()
    {
        Patch("/api/Appointment/update");
    }

    public override async Task HandleAsync(AppointmentDto req, CancellationToken ct)
    {
        try
        {
            if(string.IsNullOrWhiteSpace(req.Id)) throw new BadHttpRequestException("Id cannot be null or empty.");
            var appointmentInDb = dbContext.Appointments.FirstOrDefault(a=> a.Id.ToString() == req.Id);
            mapper.Map(req, appointmentInDb);
            await SendAsync(await dbContext.SaveChangesAsync(ct) > 0, cancellation: ct);
        }
        catch (Exception e)
        {
            throw new BadHttpRequestException(e.Message);
        }
        
       
    }
}