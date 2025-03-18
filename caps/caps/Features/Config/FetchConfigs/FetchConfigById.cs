using caps.Features.Config.Model;
using caps.Infrastructure.Data;
using FastEndpoints;
using IMapper = AutoMapper.IMapper;

namespace caps.Features.Config.FetchConfigs;

public class FetchConfigById(CapsDbContext dbContext, IMapper mapper) : EndpointWithoutRequest<ConfigDto>
{
    public override void Configure()
    {
        Get("/api/config/{id}");
        Roles("Admin");
    }

    public override async Task HandleAsync(CancellationToken ct)
    {
        try
        {
            var id = Route<string>("id");
            var config = dbContext.Configs.FirstOrDefault(a=> a.Id.ToString() == id);
            if (config == null)
            {
                await SendNotFoundAsync(ct);
                return;
            }

            var configDto = new ConfigDto();
            mapper.Map(config, configDto);
            await SendAsync(configDto, cancellation: ct);
        }
        catch (Exception e)
        {
            throw new BadHttpRequestException(e.Message);
        }
    }
}