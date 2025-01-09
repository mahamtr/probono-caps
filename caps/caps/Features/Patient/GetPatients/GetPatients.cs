using FastEndpoints;

namespace caps.Features.Patient.GetPatients;

public class GetPatients(IPatientService patientService) : EndpointWithoutRequest<IEnumerable<PatientDto>>
{
    public override void Configure()
    {
        Get("/api/patient/getAll");
        Policies("AdminOnly");
    }
    
    public override async Task HandleAsync(CancellationToken ct)
    {
        await SendAsync(await patientService.ListPatientsAsync(), cancellation: ct);
    }
}