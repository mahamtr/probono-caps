using caps.Infrastructure.Blob;
using caps.Infrastructure.Data;
using FastEndpoints;
using MongoDB.Bson;

namespace caps.Features.Appointment.DeleteAppointmentBlob;

public class DeleteAppointmentBlob(IBlobStorageService blobStorageService, CapsDbContext context) : Endpoint<Request, bool>
{
    public override void Configure()
    {
        Delete("/api/appointment/blob");
    }

    public override async Task HandleAsync(Request req, CancellationToken ct)
    {
        var id = Query<string>("appointmentId");
        var fileId = Query<string>("fileId");
        var appointment = context.Appointments.FirstOrDefault(a => a.Id.ToString() == id);
        if (appointment == null)
        {
            await SendNotFoundAsync(ct);
            return;
        }

        var success = await blobStorageService.DeleteObjectAsync(fileId);
        if (success)
        {
            appointment.BlobUrls.Remove(fileId);
            await context.SaveChangesAsync(ct);
        }

        await SendAsync(success, cancellation: ct);
    }
}