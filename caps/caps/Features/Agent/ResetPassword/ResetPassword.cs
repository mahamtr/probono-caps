using caps.Features.Agent.Service;
using caps.Infrastructure.Data;
using FastEndpoints;

namespace caps.Features.Agent.ResetPassword;

public class ResetPassword(CapsDbContext dbContext, IHashService hashService) : Endpoint<Request, bool>
{
    public override void Configure()
    {
        Patch("/api/agent/resetPassword");
        Roles("Admin");
    }

    public override async Task HandleAsync(Request req, CancellationToken ct)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(req.Id)) throw new BadHttpRequestException("Id cannot be null or empty.");
            if (string.IsNullOrWhiteSpace(req.Password)) throw new BadHttpRequestException("Password must be valid.");

            if (req.Password.Length < 8)
                throw new BadHttpRequestException("Password must be longer than 8 characters.");

            var recordInDb = dbContext.Agents.FirstOrDefault(a => a.Id.ToString() == req.Id);
            if (recordInDb is null) throw new BadHttpRequestException("Error updating password.");

            recordInDb.Password = hashService.GeneratePasswordHash(req.Password);
            await SendAsync(
                await dbContext.SaveChangesAsync(ct) > 0, cancellation: ct);
        }
        catch (Exception e)
        {
            throw new BadHttpRequestException(e.Message);
        }
    }
}