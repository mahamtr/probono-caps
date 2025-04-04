using caps.Features.Config.Model;
using caps.Infrastructure.Data;
using FastEndpoints;
using IMapper = AutoMapper.IMapper;

namespace caps.Features.Config.FetchConfigs;

public class FetchConfigs(CapsDbContext dbContext, IMapper mapper) : EndpointWithoutRequest<IEnumerable<ConfigDto>>
{
    public override void Configure()
    {
        Get("/api/config/all");
    }

    public override async Task HandleAsync(CancellationToken ct)
    {
        try
        {
            var configs = dbContext.Configs.ToList();
            var configDtos = mapper.Map<List<ConfigDto>>(configs);
            await SendAsync(configDtos, cancellation: ct);
        }
        catch (Exception e)
        {
            throw new BadHttpRequestException(e.Message);
        }
    }
}