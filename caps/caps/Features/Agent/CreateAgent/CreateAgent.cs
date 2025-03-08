using caps.Features.Agent.Model;
using caps.Features.Agent.Service;
using caps.Infrastructure.Data;
using FastEndpoints;
using IMapper = AutoMapper.IMapper;

namespace caps.Features.Agent.CreateAgent;

public class CreateAgent(CapsDbContext dbContext, IMapper mapper, IHashService hashService) : Endpoint<AgentDto, bool>
{
    public override void Configure()
    {
        Post("/api/agent/create");
        Roles("Admin");
    }

    public override async Task HandleAsync(AgentDto req, CancellationToken ct)
    {
        try
        {
            var newAgent = new Model.Agent();
            if (dbContext.Agents.FirstOrDefault(a => a.Email == req.Email) != null)
            {
                ThrowError("Please use another email.");
            }
            mapper.Map(req, newAgent);
            if (!string.IsNullOrEmpty(req.Password))
            {
                newAgent.Password = hashService.GeneratePasswordHash(req.Password);
            }
            dbContext.Agents.Add(newAgent);
            await SendAsync(await dbContext.SaveChangesAsync(ct) > 0, cancellation: ct);
        }
        catch (Exception e)
        {
            throw new BadHttpRequestException(e.Message);
        }
    }
}