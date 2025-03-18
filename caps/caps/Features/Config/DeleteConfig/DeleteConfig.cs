using caps.Infrastructure.Data;
using FastEndpoints;

namespace caps.Features.Config.DeleteConfig;

public class DeleteConfig(CapsDbContext dbContext) : EndpointWithoutRequest<bool>
{
    public override void Configure()
    {
        Delete("/api/config/{id}");
        Roles("Admin");
    }

    public override async Task HandleAsync(CancellationToken ct)
    {
        try
        {
            var id = Route<string>("id");
            if (string.IsNullOrWhiteSpace(id)) throw new BadHttpRequestException("Id cannot be null or empty.");
            var recordInDb = dbContext.Configs.FirstOrDefault(c => c.Id.ToString() == id);
            if (recordInDb is null) throw new BadHttpRequestException("Error deleting config.");
            dbContext.Configs.Remove(recordInDb);
            await SendAsync(await dbContext.SaveChangesAsync(ct) > 0, cancellation: ct);
        }
        catch (Exception e)
        {
            throw new BadHttpRequestException(e.Message);
        }
    }
}