using caps.Infrastructure.Blob;
using caps.Infrastructure.Data;
using FastEndpoints;

namespace caps.Features.Appointment.DownloadAppointmentBlob;

public class DownloadAppointmentBlob(IBlobStorageService blobStorageService, CapsDbContext context) : EndpointWithoutRequest
{
    public override void Configure()
    {
        Get("/api/appointment/blob/download/{fileId}");
    }

    public override async Task HandleAsync(CancellationToken ct)
    {
        try
        {
            var fileId = Route<string>("fileId");
            if (string.IsNullOrEmpty(fileId))
            {
                await SendNotFoundAsync(ct);
                return;
            }

            var fileContent = await blobStorageService.GetFileAsync(fileId, ct);
            var fileName = await blobStorageService.GetFileNameAsync(fileId, ct);

            if (fileContent == null || fileContent.Length == 0)
            {
                await SendNotFoundAsync(ct);
                return;
            }

            await SendBytesAsync(
                bytes: fileContent,
                fileName: fileName,
                contentType: "application/octet-stream",
                cancellation: ct
            );
        }
        catch (Exception)
        {
            await SendErrorsAsync(cancellation: ct);
        }
    }
}