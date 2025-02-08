using caps.Infrastructure.Data;
using FastEndpoints;

namespace caps.Features.Patient.SearchPatient;

public class SearchPatient(CapsDbContext dbContext) : EndpointWithoutRequest<IEnumerable<PatientDto>>
{
    public override void Configure()
    {
        Get("/api/patient/search");
    }

    public override async Task HandleAsync(CancellationToken ct)
    {
        try
        {
            var searchParam = Query<string>("search");
            if (searchParam is null) ThrowError("Search parameter in query cannot be empty.");
            var patients = dbContext.Patients.Where(a =>
                (a.FirstName.Contains(searchParam)) ||
                (a.LastName.Contains(searchParam)) );
            await SendAsync(patients.Select(a=> new PatientDto(){FirstName = a.FirstName, LastName = a.LastName, Id = a.Id.ToString()}), cancellation: ct);
        }
        catch (Exception e)
        {
            throw new BadHttpRequestException(e.Message);
        }
    }
}