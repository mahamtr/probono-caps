using caps.Infrastructure.Blob;
using caps.Infrastructure.Data;
using FastEndpoints;
using MongoDB.Bson;

namespace caps.Features.Appointment.UploadAppointmentBlob;

public class UploadAppointmentBlob(IBlobStorageService blobStorageService, CapsDbContext context) : Endpoint<Request>
{
    public override void Configure()
    {
        Post("/api/appointment/{id}/blob");
        AllowFileUploads();
    }

    public override async Task HandleAsync(Request req, CancellationToken ct)
    {
        var id = Route<string>("id");
        var appointment = context.Appointments.FirstOrDefault(a=> a.Id.ToString() == id);
        if (appointment == null)
        {
            await SendNotFoundAsync(ct);
            return;
        }

        var fileId = await blobStorageService.UploadObjectAsync(req.File, ct);
        appointment.BlobUrls.Add(fileId);

        await context.SaveChangesAsync(ct);
        await SendOkAsync(ct);
    }
}