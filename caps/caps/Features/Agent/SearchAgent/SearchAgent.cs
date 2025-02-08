using caps.Features.Agent.Model;
using caps.Infrastructure.Data;
using FastEndpoints;

namespace caps.Features.Agent.SearchAgent;

public class SearchAgent(CapsDbContext dbContext) : EndpointWithoutRequest<IEnumerable<AgentDto>>
{
    public override void Configure()
    {
        Get("/api/agent/search");
    }

    public override async Task HandleAsync(CancellationToken ct)
    {
        try
        {
            var searchParam = Query<string>("search");
            if (searchParam is null) ThrowError("Search parameter in query cannot be empty.");
            var agents = dbContext.Agents.Where(a =>
                (a.FirstName != null && a.FirstName.Contains(searchParam)) ||
                (a.LastName != null && a.LastName.Contains(searchParam)) ||
                (a.IDNumber != null && a.IDNumber.Contains(searchParam)) && a.IsActive == true);
            await SendAsync(agents.Select(a=> new AgentDto(){FirstName = a.FirstName, LastName = a.LastName, Id = a.Id.ToString()}), cancellation: ct);
        }
        catch (Exception e)
        {
            throw new BadHttpRequestException(e.Message);
        }
    }
}