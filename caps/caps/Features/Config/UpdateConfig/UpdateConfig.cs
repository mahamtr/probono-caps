using caps.Features.Config.Model;
using caps.Infrastructure.Data;
using FastEndpoints;
using IMapper = AutoMapper.IMapper;

namespace caps.Features.Config.UpdateConfig;

public class UpdateConfig(CapsDbContext dbContext, IMapper mapper) : Endpoint<ConfigDto, bool>
{
    public override void Configure()
    {
        Patch("/api/config/update");
        Roles("Admin");
    }

    public override async Task HandleAsync(ConfigDto req, CancellationToken ct)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(req.Id)) throw new BadHttpRequestException("Id cannot be null or empty.");
            var recordInDb = dbContext.Configs.FirstOrDefault(c => c.Id.ToString() == req.Id);
            if (recordInDb is null) throw new BadHttpRequestException("Config does not exist.");
            mapper.Map(req, recordInDb);
            await SendAsync(await dbContext.SaveChangesAsync(ct) > 0, cancellation: ct);
        }
        catch (Exception e)
        {
            throw new BadHttpRequestException(e.Message);
        }
    }
}