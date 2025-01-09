using FastEndpoints;

namespace caps.Features.Patient.UpdatePatient;

public class UpdatePatient(IPatientService patientService) : Endpoint<PatientDto,bool>
{
    public override void Configure()
    {
        Patch("/api/patient/updatePatient");
    }
    
    public override async Task HandleAsync(PatientDto req, CancellationToken ct)
    {
        await SendAsync(await patientService.UpdatePatient(req), cancellation: ct);
    }
}