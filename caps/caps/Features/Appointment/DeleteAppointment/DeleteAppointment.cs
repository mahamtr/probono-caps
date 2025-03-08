using caps.Infrastructure.Data;
using caps.Infrastructure.Blob;
using FastEndpoints;

namespace caps.Features.Appointment.DeleteAppointment;

public class DeleteAppointment(CapsDbContext dbContext, IBlobStorageService blobStorageService)
    : EndpointWithoutRequest<bool>
{
    public override void Configure()
    {
        Delete("/api/appointment/{id}");
        Roles("Admin");
    }

    public override async Task HandleAsync(CancellationToken ct)
    {
        try
        {
            var id = Route<string>("id");
            if (string.IsNullOrWhiteSpace(id))
                throw new BadHttpRequestException("Id cannot be null or empty.");

            var recordInDb = dbContext.Appointments.FirstOrDefault(a => a.Id.ToString() == id);
            if (recordInDb is null)
                throw new Exception("Appointment Id not found");

            // Delete all associated blobs from GridFS
            if (recordInDb.BlobUrls.Count != 0)
            {
                foreach (var blobUrl in recordInDb.BlobUrls)
                {
                    await blobStorageService.DeleteObjectAsync(blobUrl);
                }
            }

            dbContext.Appointments.Remove(recordInDb);
            await SendAsync(
                await dbContext.SaveChangesAsync(ct) > 0,
                cancellation: ct);
        }
        catch (Exception e)
        {
            throw new BadHttpRequestException(e.Message);
        }
    }
}