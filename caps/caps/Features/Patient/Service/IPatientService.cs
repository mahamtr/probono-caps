using caps.Features.Patient.Model;

namespace caps.Features.Patient.Service;

public interface IPatientService
{
    Task<IEnumerable<PatientDto>> ListPatientsAsync();
    Task<bool> CreatePatient(PatientDto patientDto);
    Task<bool> UpdatePatient(PatientDto patientDto);
    Task<bool> DeletePatient(string id);
}