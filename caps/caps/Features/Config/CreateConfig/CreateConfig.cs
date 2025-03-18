using caps.Features.Config.Model;
using caps.Infrastructure.Data;
using FastEndpoints;
using IMapper = AutoMapper.IMapper;

namespace caps.Features.Config.CreateConfig;

public class CreateConfig(CapsDbContext dbContext, IMapper mapper) : Endpoint<ConfigDto, bool>
{
    public override void Configure()
    {
        Post("/api/config/create");
        Roles("Admin");
    }

    public override async Task HandleAsync(ConfigDto req, CancellationToken ct)
    {
        try
        {
            var newConfig = new Model.Config();
            mapper.Map(req, newConfig);
            dbContext.Configs.Add(newConfig);
            await SendAsync(await dbContext.SaveChangesAsync(ct) > 0, cancellation: ct);
        }
        catch (Exception e)
        {
            throw new BadHttpRequestException(e.Message);
        }
    }
}