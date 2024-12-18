using System.ComponentModel.DataAnnotations.Schema;
using MongoDB.Bson;

namespace caps.Features.Appointment.Model;

public class AppointmentProfile : Profile
{
    public AppointmentProfile()
    {
        CreateMap<AppointmentDto, Appointment>()
            .ForMember(dest => dest.Id, opt => opt.Ignore()) 
            .ForMember(dest => dest.PatientId, opt => opt.MapFrom(src => ObjectId.Parse(src.PatientId)))
            .ForMember(dest => dest.AgentId, opt => opt.MapFrom(src => ObjectId.Parse(src.AgentId)))
            .ForAllMembers(opts => opts.Condition((_, _, srcMember) => srcMember != null));


        CreateMap<Appointment, AppointmentDto>();
    }
}