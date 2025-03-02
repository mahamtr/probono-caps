using caps.Features.Appointment.Model;
using caps.Infrastructure.Data;
using FastEndpoints;

namespace caps.Features.Appointment.RescheduleAppointment;

public class RescheduleAppointment(CapsDbContext dbContext) : Endpoint<AppointmentDto, bool>
{
    public override void Configure()
    {
        Patch("/api/Appointment/reschedule");
    }
    
    public override async Task HandleAsync(AppointmentDto req, CancellationToken ct)
    {
        try
        {
            if(string.IsNullOrWhiteSpace(req.Id)) throw new BadHttpRequestException("Id cannot be null or empty.");
            var appointmentInDb = dbContext.Appointments.FirstOrDefault(a=> a.Id.ToString() == req.Id);
            if (appointmentInDb != null)
            {
                appointmentInDb.ScheduledDate = req.ScheduledDate;
                appointmentInDb.Status = "Scheduled"; //todo move this enum
            }
            await SendAsync(await dbContext.SaveChangesAsync(ct) > 0, cancellation: ct);
        }
        catch (Exception e)
        {
            throw new BadHttpRequestException(e.Message);
        }
        
       
    }
}