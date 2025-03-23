using caps.Infrastructure.Data;
using FastEndpoints;
using IMapper = AutoMapper.IMapper;

namespace caps.Features.Patient.CreatePatient;

public class CreatePatient(CapsDbContext dbContext, IMapper mapper) : Endpoint<PatientDto,bool>
{
    public override void Configure()
    {
        Post("/api/patient/createPatient");
    }
    
    public override async Task HandleAsync(PatientDto req, CancellationToken ct)
    {
        try
        {
            var newAgent = new Model.Patient();
            mapper.Map(req, newAgent);
            newAgent.Notes = req.Notes;
            newAgent.Profession = req.Profession;
            newAgent.EducationLevel = req.EducationLevel;
            dbContext.Patients.Add(newAgent);
            await SendAsync(await dbContext.SaveChangesAsync(ct) > 0, cancellation: ct);
        }
        catch (Exception e)
        {
            throw new BadHttpRequestException(e.Message);
        }    
    }
}