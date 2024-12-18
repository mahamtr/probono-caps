using caps.Features.Patient.Model;
using caps.Infrastructure.Data;

namespace caps.Features.Patient.Service;

public class PatientService(CapsDbContext dbContext, IMapper mapper) : IPatientService
{
    public async Task<IEnumerable<PatientDto>> ListPatientsAsync()
    {
        var patients =  dbContext.Patients;
        return mapper.Map<List<PatientDto>>(patients.ToList());
    }

    public async Task<bool> CreatePatient(PatientDto patientDto)
    {
        try
        {
            var newAgent = new Model.Patient();
            mapper.Map(patientDto, newAgent);
            dbContext.Patients.Add(newAgent);
            return await dbContext.SaveChangesAsync() > 0;
        }
        catch (Exception e)
        {
            throw new BadHttpRequestException(e.Message);
        }    
    }

    public async Task<bool> UpdatePatient(PatientDto patientDto)
    {
        try
        {
            if(string.IsNullOrWhiteSpace(patientDto.Id)) throw new BadHttpRequestException("Id cannot be null or empty.");
            var patientInDb = GetPatientInDb(patientDto.Id);
            mapper.Map(patientDto, patientInDb);
            return await dbContext.SaveChangesAsync() > 0;
        }
        catch (Exception e)
        {
            throw new BadHttpRequestException(e.Message);
        }    
    }

    public async Task<bool> DeletePatient(string id)
    {
        try
        {
            if(string.IsNullOrWhiteSpace(id)) throw new BadHttpRequestException("Id cannot be null or empty.");
            var patientInDb = GetPatientInDb(id);
            dbContext.Patients.Remove(patientInDb);
            return await dbContext.SaveChangesAsync() > 0;
        }
        catch (Exception e)
        {
            throw new BadHttpRequestException(e.Message);
        }
    }
    
    private Model.Patient GetPatientInDb(string id)
    {
        var agentInDb = dbContext.Patients.FirstOrDefault(a => a.Id.ToString() == id);
        if (agentInDb == null) throw new BadHttpRequestException("Patient not found");
        return agentInDb;
    }
}