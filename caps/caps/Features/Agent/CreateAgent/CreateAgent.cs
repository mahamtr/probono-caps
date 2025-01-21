using caps.Features.Agent.Model;
using caps.Features.Agent.ResetPassword;
using caps.Infrastructure.Data;
using FastEndpoints;
using IMapper = AutoMapper.IMapper;

namespace caps.Features.Agent.CreateAgent;

public class CreateAgent(CapsDbContext dbContext, IMapper mapper) : Endpoint<AgentDto, bool>
{
    public override void Configure()
    {
        Post("/api/agent/create");
        Policies("AdminOnly");
    }

    public override async Task HandleAsync(AgentDto req, CancellationToken ct)
    {
        try
        {
            var newAgent = new Model.Agent();
            mapper.Map(req, newAgent);
            dbContext.Agents.Add(newAgent);
            await SendAsync(await dbContext.SaveChangesAsync(ct) > 0, cancellation: ct);
        }
        catch (Exception e)
        {
            throw new BadHttpRequestException(e.Message);
        }
    }
}