using FastEndpoints;

namespace caps.Features.Patient.CreatePatient;

public class CreatePatient(IPatientService patientService) : Endpoint<PatientDto,bool>
{
    public override void Configure()
    {
        Post("/api/patient/createPatient");
    }
    
    public override async Task HandleAsync(PatientDto req, CancellationToken ct)
    {
        await SendAsync(await patientService.CreatePatient(req), cancellation: ct);
    }
}