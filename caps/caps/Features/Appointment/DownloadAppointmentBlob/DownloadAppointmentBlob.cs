using caps.Infrastructure.Blob;
using caps.Infrastructure.Data;
using FastEndpoints;

namespace caps.Features.Appointment.DownloadAppointmentBlob;

public class DownloadAppointmentBlob(IBlobStorageService blobStorageService,CapsDbContext context): EndpointWithoutRequest<string?>
{
    public override void Configure()
    {
        Get("/api/appointment/blob/download/{name}");
    }

    public override async Task HandleAsync(CancellationToken ct)
    {
        var name = Route<string>("name");
        if(name is null) ThrowError("Please include name of the filename to download.");
        var urlString = await blobStorageService.GetDownloadLink(name,ct);
        await SendAsync(urlString, cancellation: ct);
    }

}