using caps.Infrastructure.Blob;
using caps.Infrastructure.Data;
using FastEndpoints;

namespace caps.Features.Appointment.DeleteAppointmentBlob;

public class DeleteAppointmentBlob(IBlobStorageService blobStorageService,CapsDbContext context) : EndpointWithoutRequest<bool>
{
    public override void Configure()
    {
        Delete("/api/appointment/blob");
    }

    public override async Task HandleAsync( CancellationToken ct)
    {
        var appointmentId = Query<string>("appointmentId");
        var name = Query<string>("blobName");
        if(name is null) ThrowError("Please include name of the filename to download.");

        await blobStorageService.DeleteObjectAsync(name);
        
        var appnt = context.Appointments.First(a => a.Id.ToString() == appointmentId);
        appnt.BlobUrls.Remove(name);
        

        //TODO publish event BlobDownload

        await SendAsync(await context.SaveChangesAsync(ct) > 0, cancellation: ct);
    }
}