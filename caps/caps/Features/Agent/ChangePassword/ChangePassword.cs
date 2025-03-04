using caps.Features.Agent.Service;
using caps.Infrastructure.Data;
using FastEndpoints;
using MongoDB.Driver.Linq;

namespace caps.Features.Agent.ChangePassword;

public class ChangePassword(CapsDbContext dbContext, IHashService hashService) : Endpoint<Request, bool>
{
    public override void Configure()
    {
        Post("/api/agent/changePassword");
    }

    public override async Task HandleAsync(Request req, CancellationToken ct)
    {
        var userId = User.Claims.FirstOrDefault(c => c.Type == "UserId")?.Value;
        var agent = dbContext.Agents.FirstOrDefault(a => a.Id.ToString() == userId);
        if (agent == null || !hashService.VerifyPasswordHash(req.CurrentPassword, agent.Password))
        {
            ThrowError("Invalid credentials");
            return;
        }

        agent.Password = hashService.GeneratePasswordHash(req.NewPassword);
        await dbContext.SaveChangesAsync(ct);
        await SendOkAsync(true, ct);
    }
}