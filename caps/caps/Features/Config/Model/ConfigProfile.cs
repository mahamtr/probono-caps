using AutoMapper;

namespace caps.Features.Config.Model;

public class ConfigProfile : Profile
{
    public ConfigProfile()
    {
        CreateMap<Config, ConfigDto>()
            .ReverseMap()
            .ForMember(dest => dest.Id, opt => opt.Ignore());
    }
}