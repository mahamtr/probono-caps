using caps.Features.Agent.Model;
using caps.Infrastructure.Data;
using FastEndpoints;
using IMapper = AutoMapper.IMapper;

namespace caps.Features.Agent.ListAgents;

public class ListAgents(CapsDbContext dbContext, IMapper mapper) : EndpointWithoutRequest<IEnumerable<AgentDto>>
{
    public override void Configure()
    {
        Get("/api/agent/AllAgent");
        AllowAnonymous();
    }

    public override async Task HandleAsync(CancellationToken ct)
    {
        try
        {
            var agents =  dbContext.Agents;
            await SendAsync(
                mapper.Map<List<AgentDto>>(agents.ToList()), cancellation: ct);
        }
        catch (Exception e)
        {
            throw new BadHttpRequestException(e.Message);
        }
    }
}