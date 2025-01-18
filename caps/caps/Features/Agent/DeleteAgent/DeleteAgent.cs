using caps.Infrastructure.Data;
using FastEndpoints;

namespace caps.Features.Agent.DeleteAgent;

public class DeleteAgent(CapsDbContext dbContext) : EndpointWithoutRequest< bool>
{
    public override void Configure()
    {
        Delete("/api/agent/{id}");
        // Policies("AdminOnly");
        AllowAnonymous();
    }

    public override async Task HandleAsync( CancellationToken ct)
    {
        try
        {           
            var id = Route<string>("id");
            if(string.IsNullOrWhiteSpace(id)) throw new BadHttpRequestException("Id cannot be null or empty.");
            var recordInDb = dbContext.Agents.FirstOrDefault(a=> a.Id.ToString() == id);
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