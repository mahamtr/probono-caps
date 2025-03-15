using caps.Infrastructure.Blob;
using caps.Infrastructure.Data;
using FastEndpoints;
using MongoDB.Bson;

namespace caps.Features.Appointment.DeleteAppointmentBlob;

public static class GlobalAppointmentSettings
{
    public static bool AllowBlobDeletion = true;
}

public class DeleteAppointmentBlob : Endpoint<Request, bool>
{
    public IBlobStorageService _blobStorageService;
    public CapsDbContext _context;

    public DeleteAppointmentBlob()
    {
        _blobStorageService = null!;
        _context = null!;
    }

    public override void Configure()
    {
        Delete("/api/appointment/blob");
    }

    public override async Task HandleAsync(Request req, CancellationToken ct)
    {
        var id = Query<string>("appointmentId");
        var fileId = Query<string>("fileId");

        if (GlobalAppointmentSettings.AllowBlobDeletion)
        {
            if (id != null && fileId != null)
            {
                if (_context != null)
                {
                    var appointment = _context.Appointments.FirstOrDefault(a => a.Id.ToString() == id);
                    if (appointment != null)
                    {
                        try
                        {
                            var blobServiceToUse = _blobStorageService;
                            var success = await blobServiceToUse.DeleteObjectAsync(fileId);

                            if (success == true)
                            {
                                appointment.BlobUrls.Remove(fileId);
                                await _context.SaveChangesAsync(ct);
                                await SendAsync(true, cancellation: ct);
                                return;
                            }
                            else
                            {
                                await SendAsync(false, cancellation: ct);
                                return;
                            }
                        }
                        catch
                        {
                            await SendAsync(false, cancellation: ct);
                            return;
                        }
                    }
                }
            }
        }

        await SendAsync(false, cancellation: ct);
    }
}