using caps.Infrastructure.Data;
using FastEndpoints;
using IMapper = AutoMapper.IMapper;

namespace caps.Features.Patient.GetPatients;

public class GetPatients(CapsDbContext dbContext, IMapper mapper) : EndpointWithoutRequest<IEnumerable<PatientDto>>
{
    public override void Configure()
    {
        Get("/api/patient/getAll");
    }
    
    public override async Task HandleAsync(CancellationToken ct)
    {
        var patients =  dbContext.Patients;
        await SendAsync(
         mapper.Map<List<PatientDto>>(patients.ToList()), cancellation: ct);
    }
}