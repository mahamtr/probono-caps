using FastEndpoints;

namespace caps.Features.Patient.DeletePatient;

public class DeletePatient(IPatientService patientService) : Endpoint<string,bool>
{
    public override void Configure()
    {
        Patch("/api/patient/deletePatient");
    }
    
    public override async Task HandleAsync(string req, CancellationToken ct)
    {
        await SendAsync(await patientService.DeletePatient(req), cancellation: ct);
    }
}