using caps.Infrastructure.Blob;
using caps.Infrastructure.Data;
using FastEndpoints;

namespace caps.Features.Appointment.UploadAppointmentBlob;

public class UploadAppointmentBlob(IBlobStorageService blobStorageService,CapsDbContext context): Endpoint<Request>
{
    public override void Configure()
    {
        Post("/api/appointment/{id}/blob");
        AllowFileUploads();
    }

    public override async Task HandleAsync(Request req, CancellationToken ct)
    {
        var appointmentId = Route<string>("id");

        var file = req.File;

        await blobStorageService.UploadObjectAsync(file,ct);

        var appnt = context.Appointments.First(a => a.Id.ToString() == appointmentId);
        if (appnt.BlobUrls.Contains(file.FileName)) return;
        appnt.BlobUrls.Add(file.FileName);
        await context.SaveChangesAsync(ct);


        await SendNoContentAsync(ct);
    }
}