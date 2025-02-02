using caps.Infrastructure.Data;
using FastEndpoints;

namespace caps.Features.Dashboard.GetTotals;

public class GetTotals(CapsDbContext context) : EndpointWithoutRequest<TotalsDto>
{
    public override void Configure()
    {
        Get("/api/dashboard/totals");
    }

    public override async Task HandleAsync( CancellationToken ct)
    {
        try
        {
            var response = new TotalsDto();
            response.TotalAppointments = context.Appointments.Count();
            response.TotalAgents = context.Agents.Count();
            response.TotalPatients = context.Patients.Count();
            await SendAsync(response, cancellation: ct);

        }
        catch (Exception e)
        {
            throw new BadHttpRequestException(e.Message);
        }
    }
}