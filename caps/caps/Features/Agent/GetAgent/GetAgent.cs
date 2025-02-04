using caps.Features.Agent.Model;
using caps.Infrastructure.Data;
using FastEndpoints;
using IMapper = AutoMapper.IMapper;

namespace caps.Features.Agent.GetAgent;

public class GetAgent(CapsDbContext dbContext, IMapper mapper) : EndpointWithoutRequest<AgentDto>
{
    //TODO research mapper from fastendpoint
    public override void Configure()
    {
        Get("/api/agent/{id}");
    }

    public override async Task HandleAsync( CancellationToken ct)
    {
        try
        {
            var id = Route<string>("id");
            var agent =  dbContext.Agents.FirstOrDefault(a=> a.Id.ToString() == id);
            if(agent is null) ThrowError("Agent not found.");
            await SendAsync(
                mapper.Map<AgentDto>(agent), cancellation: ct);
        }
        catch (Exception e)
        {
            throw new BadHttpRequestException(e.Message);
        }
    }
}