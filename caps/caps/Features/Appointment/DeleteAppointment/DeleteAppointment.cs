using caps.Infrastructure.Data;
using FastEndpoints;

namespace caps.Features.Appointment.DeleteAppointment;

public class DeleteAppointment(CapsDbContext dbContext) : EndpointWithoutRequest< bool>
{
    public override void Configure()
    {
        Delete("/api/appointment/{id}");
    }

    public override async Task HandleAsync( CancellationToken ct)
    {
        try
        {
            var id = Route<string>("id");
            if(string.IsNullOrWhiteSpace(id)) throw new BadHttpRequestException("Id cannot be null or empty.");
            var recordInDb = dbContext.Appointments.FirstOrDefault(a=> a.Id.ToString() == id);
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