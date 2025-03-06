using caps.Infrastructure.Blob;
using FastEndpoints;

namespace caps.Features.Appointment.GetFileName;

public class GetFileName(IBlobStorageService blobStorageService) : Endpoint<Request, string>
{
    public override void Configure()
    {
        Get("/api/appointment/blob/filename");
    }

    public override async Task HandleAsync(Request req, CancellationToken ct)
    {
        var fileName = await blobStorageService.GetFileNameAsync(req.FileId, ct);
        await SendAsync(fileName, cancellation: ct);
    }
}

public class Request
{
    public string FileId { get; set; }
}