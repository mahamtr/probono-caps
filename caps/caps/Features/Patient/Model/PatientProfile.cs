namespace caps.Features.Patient.Model;

public class PatientProfile : Profile
{
    public PatientProfile()
    {
        CreateMap<PatientDto, Patient>()
            .ForMember(dest => dest.Id, opt => opt.Ignore()) 
            // .ForMember(dest => dest.Password, opt => opt.Ignore())
            .ForAllMembers(opts => opts.Condition((_, _, srcMember) => srcMember != null));


        CreateMap<Patient, PatientDto>();
    }
}