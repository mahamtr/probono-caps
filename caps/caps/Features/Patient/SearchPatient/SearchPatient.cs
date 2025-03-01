using caps.Infrastructure.Data;
using FastEndpoints;
using Microsoft.EntityFrameworkCore;

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
            var patientsQuery = dbContext.Patients.AsQueryable();

            if (!string.IsNullOrWhiteSpace(searchParam))
            {
                patientsQuery = patientsQuery.Where(a =>
                    a.FirstName.Contains(searchParam) ||
                    a.LastName.Contains(searchParam));
            }
            else
            {
                patientsQuery = patientsQuery.OrderBy(a => a.FirstName).Take(5);
            }
            var patients = await patientsQuery
                .Select(a => new PatientDto
                {
                    FirstName = a.FirstName,
                    LastName = a.LastName,
                    Id = a.Id.ToString()
                })
                .ToListAsync(ct);
            await SendAsync(patients, cancellation: ct);
        }
        catch (Exception e)
        {
            throw new BadHttpRequestException(e.Message);
        }
    }
}