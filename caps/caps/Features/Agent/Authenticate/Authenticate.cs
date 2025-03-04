using caps.Features.Agent.Service;
using caps.Infrastructure.Data;
using FastEndpoints;
using FastEndpoints.Security;

namespace caps.Features.Agent.Authenticate;

public class Authenticate(CapsDbContext dbContext, IHashService hashService) : Endpoint<Request, Response>
{
    public override void Configure()
    {
        Post("/api/agent/authenticate");
        AllowAnonymous();
    }

    public override async Task HandleAsync(Request req, CancellationToken ct)
    {
        var secretKey = Environment.GetEnvironmentVariable("JWT_SECRET_KEY") ?? throw new InvalidOperationException();
        var issuer = Environment.GetEnvironmentVariable("JWT_ISSUER") ?? throw new InvalidOperationException();
        var audience = Environment.GetEnvironmentVariable("JWT_AUDIENCE") ?? throw new InvalidOperationException();
        var expireInMinute = int.Parse(Environment.GetEnvironmentVariable("JWT_EXPIRE_MINS") ?? throw new InvalidOperationException());

        var agent = dbContext.Agents.FirstOrDefault(a => a.Email == req.Email);
        if (agent is null) ThrowError("The supplied credentials are invalid!");

        if (!hashService.VerifyPasswordHash(req.Password, agent.Password))
        {
            ThrowError("The supplied credentials are invalid!");
        }

        var jwtToken = JwtBearer.CreateToken(
            o =>
            {
                o.SigningKey = secretKey;
                o.ExpireAt = DateTime.UtcNow.AddMinutes(expireInMinute);
                o.User.Roles.Add(agent.Privilege);
                o.User.Claims.Add(("UserId", agent.Id.ToString()));
            });

        await SendAsync(new Response
        {
            AccessToken = jwtToken,
            Role = agent.Privilege
        }, cancellation: ct);
    }
}