using caps.Features.Patient.Model;
using caps.Features.Patient.Service;
using Microsoft.AspNetCore.Mvc;

namespace caps.Features.Patient.Controller;
[ApiController]
[Route("api/[controller]/[action]")]
public class PatientController(IPatientService patientService): ControllerBase
{
    [HttpGet]
    public Task<IEnumerable<PatientDto>> ListPatients()
    {
        return patientService.ListPatientsAsync();
    }
    
    [HttpPost]
    public Task<bool> CreatePatient(PatientDto patientDto)
    {
        return patientService.CreatePatient(patientDto);
    }
    
    [HttpPatch]
    public Task<bool> UpdatePatient(PatientDto patientDto)
    {
        return patientService.UpdatePatient(patientDto);
    }
    
    [HttpDelete]
    public Task<bool> DeletePatient(string id)
    {
        return patientService.DeletePatient(id);
    }
}