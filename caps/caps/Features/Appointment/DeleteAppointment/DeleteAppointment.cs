using caps.Infrastructure.Data;
using FastEndpoints;

namespace caps.Features.Appointment.DeleteAppointment;

public class DeleteAppointment(CapsDbContext dbContext) : Endpoint<string, bool>
{
    public override void Configure()
    {
        Delete("/api/appointment/delete");
    }

    public override async Task HandleAsync(string req, CancellationToken ct)
    {
        try
        {
            if(string.IsNullOrWhiteSpace(req)) throw new BadHttpRequestException("Id cannot be null or empty.");
            var recordInDb = dbContext.Appointments.FirstOrDefault(a=> a.Id.ToString() == req);
            if (recordInDb is null) throw new Exception("Appointment Id not found");
            dbContext.Appointments.Remove(recordInDb);
            await SendAsync(
                await dbContext.SaveChangesAsync(ct) > 0, cancellation: ct);
        }
        catch (Exception e)
        {
            throw new BadHttpRequestException(e.Message);
        }
     
    }
}