using caps.Infrastructure.Data;
using FastEndpoints;

namespace caps.Features.Patient.DeletePatient;

public class DeletePatient(CapsDbContext dbContext) : EndpointWithoutRequest<bool>
{
    public override void Configure()
    {
        Delete("/api/patient/{id}");
        Roles("Admin","Professional");
    }
    
    public override async Task HandleAsync(CancellationToken ct)
    {
        try
        {
            var id = Route<string>("id");
            if(string.IsNullOrWhiteSpace(id)) throw new BadHttpRequestException("Id cannot be null or empty.");
            var recordInDb = dbContext.Patients.FirstOrDefault(a => a.Id.ToString() == id);
            if (recordInDb == null) throw new BadHttpRequestException("Patient not found");
            dbContext.Patients.Remove(recordInDb);
            await SendAsync(await dbContext.SaveChangesAsync(ct) > 0, cancellation: ct);
        }
        catch (Exception e)
        {
            throw new BadHttpRequestException(e.Message);
        }
    }
}