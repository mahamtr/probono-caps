using caps.Infrastructure.Data;
using FastEndpoints;

namespace caps.Features.Agent.DeleteAgent;

public class DeleteAgent(CapsDbContext dbContext) : Endpoint<string, bool>
{
    public override void Configure()
    {
        Delete("/api/agent/delete");
        Policies("AdminOnly");
    }

    public override async Task HandleAsync(string req, CancellationToken ct)
    {
        try
        {
            if(string.IsNullOrWhiteSpace(req)) throw new BadHttpRequestException("Id cannot be null or empty.");
            var recordInDb = dbContext.Agents.FirstOrDefault(a=> a.Id.ToString() == req);
            if (recordInDb is null) throw new BadHttpRequestException("Error deleting agent.");
            dbContext.Agents.Remove(recordInDb);
            await SendAsync(await dbContext.SaveChangesAsync(ct) > 0, cancellation: ct);
        }
        catch (Exception e)
        {
            throw new BadHttpRequestException(e.Message);
        }
    }
}