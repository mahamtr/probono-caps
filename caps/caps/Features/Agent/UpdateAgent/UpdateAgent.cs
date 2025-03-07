using caps.Features.Agent.Model;
using caps.Features.Agent.Service;
using caps.Infrastructure.Data;
using FastEndpoints;
using IMapper = AutoMapper.IMapper;

namespace caps.Features.Agent.UpdateAgent;

public class UpdateAgent(CapsDbContext dbContext, IMapper mapper, IHashService hashService) : Endpoint<AgentDto, bool>
{
    public override void Configure()
    {
        Patch("/api/agent/update");
        Policies("AdminOnly");
        Policies("ProfessionalOnly");
    }

    public override async Task HandleAsync(AgentDto req, CancellationToken ct)
    {
        try
        {
            if(string.IsNullOrWhiteSpace(req.Id)) throw new BadHttpRequestException("Id cannot be null or empty.");
            var recordInDb = dbContext.Agents.FirstOrDefault(a=> a.Id.ToString() == req.Id);
            if (recordInDb is null) throw new BadHttpRequestException("Agent does not exists.");
            mapper.Map(req, recordInDb);
            if (!string.IsNullOrEmpty(req.Password))
            {
                recordInDb.Password = hashService.GeneratePasswordHash(req.Password);
            }
            await SendAsync(
                await dbContext.SaveChangesAsync(ct) > 0, cancellation: ct);
        }
        catch (Exception e)
        {
            throw new BadHttpRequestException(e.Message);
        }
    }
}