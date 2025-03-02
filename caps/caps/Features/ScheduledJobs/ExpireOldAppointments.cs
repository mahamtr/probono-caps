using caps.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace caps.Features.ScheduledJobs;

public class ExpireOldAppointments(CapsDbContext context)
{
    public async Task UpdateOldAppointmentsStatus()
    {
        var oneWeekAgo = DateTime.UtcNow.AddDays(-7);
        var oldAppointments = await context.Appointments
            .Where(a => a.Status == "Scheduled" && a.ScheduledDate < oneWeekAgo)
            .ToListAsync();

        foreach (var appointment in oldAppointments)
        {
            appointment.Status = "Canceled";
        }

        await context.SaveChangesAsync();
    }
}
