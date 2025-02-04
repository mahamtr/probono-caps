using caps.Infrastructure.Data;
using FastEndpoints;
using IMapper = AutoMapper.IMapper;

namespace caps.Features.Patient.GetPatient;

public class GetPatient(CapsDbContext dbContext, IMapper mapper) : EndpointWithoutRequest<PatientDto>
{
    public override void Configure()
    {
        Get("/api/patient/{id}");
    }
    
    public override async Task HandleAsync(CancellationToken ct)
    {
        var id = Route<string>("id");
        var patient = dbContext.Patients.FirstOrDefault(p => p.Id.ToString() == id);
        if(patient is null ) ThrowError("Patient not found");
        await SendAsync(
         mapper.Map<PatientDto>(patient), cancellation: ct);
    }
}