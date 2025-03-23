using caps.Infrastructure.Data;
using FastEndpoints;
using IMapper = AutoMapper.IMapper;

namespace caps.Features.Patient.UpdatePatient;

public class UpdatePatient(CapsDbContext dbContext, IMapper mapper) : Endpoint<PatientDto,bool>
{
    public override void Configure()
    {
        Patch("/api/patient/updatePatient");
    }
    
    public override async Task HandleAsync(PatientDto req, CancellationToken ct)
    {
        try
        {
            if(string.IsNullOrWhiteSpace(req.Id)) throw new BadHttpRequestException("Id cannot be null or empty.");
            var recordInDb = dbContext.Patients.FirstOrDefault(a => a.Id.ToString() == req.Id);
            if (recordInDb == null) throw new BadHttpRequestException("Patient not found");
            mapper.Map(req, recordInDb);
            recordInDb.Notes = req.Notes;
            recordInDb.Profession = req.Profession;
            recordInDb.EducationLevel = req.EducationLevel;
            await SendAsync(await dbContext.SaveChangesAsync(ct) > 0, cancellation: ct);
        }
        catch (Exception e)
        {
            throw new BadHttpRequestException(e.Message);
        }   
    }
}