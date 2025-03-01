using caps.Features.Agent.Model;
using caps.Infrastructure.Data;
using FastEndpoints;
using Microsoft.EntityFrameworkCore;

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
            var agentsQuery = dbContext.Agents.AsQueryable();

            if (!string.IsNullOrWhiteSpace(searchParam))
            {
                agentsQuery = agentsQuery.Where(a =>
                    a.LastName != null && a.FirstName != null && (a.FirstName.Contains(searchParam) ||
                                                                  a.LastName.Contains(searchParam)));
            }
            else
            {
                agentsQuery = agentsQuery.OrderBy(a => a.FirstName).Take(5);
            }
            var agents = await agentsQuery
                .Select(a => new AgentDto()
                {
                    FirstName = a.FirstName,
                    LastName = a.LastName,
                    Id = a.Id.ToString()
                })
                .ToListAsync(ct);
            await SendAsync(agents, cancellation: ct);
        }
        catch (Exception e)
        {
            throw new BadHttpRequestException(e.Message);
        }
    }
}