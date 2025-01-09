using System.Security.Claims;
using System.Text;
using caps.Features.Agent.Authenticate;
using caps.Features.Agent.Model;
using caps.Infrastructure.Data;
using Microsoft.IdentityModel.JsonWebTokens;
using Microsoft.IdentityModel.Tokens;
using JwtRegisteredClaimNames = System.IdentityModel.Tokens.Jwt.JwtRegisteredClaimNames;

namespace caps.Features.Agent.Service;

public class AuthService(CapsDbContext dbContext, IHashService hashService) : IAuthService
{
    public string Authenticate(Request request)
    {
        var agent = dbContext.Agents.FirstOrDefault(a => a.Email == request.Email);
        if (agent is null) throw new UnauthorizedAccessException();

        if (!hashService.VerifyPasswordHash(request.Password,agent.Password))
        {
            throw new UnauthorizedAccessException();
        }
        
        return GenerateToken(agent);
    }

    private static string GenerateToken(Model.Agent agent)
    {
        string secretKey = Environment.GetEnvironmentVariable("JWT_SECRET_KEY") ?? throw new InvalidOperationException();
        string issuer = Environment.GetEnvironmentVariable("JWT_ISSUER") ?? throw new InvalidOperationException();
        string audience = Environment.GetEnvironmentVariable("JWT_AUDIENCE") ?? throw new InvalidOperationException();
        int expireInMinute = int.Parse(Environment.GetEnvironmentVariable("JWT_EXPIRE_MINS") ?? throw new InvalidOperationException());
        var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));

        var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

        var tokenDescriptor = new SecurityTokenDescriptor()
        {
            Subject = new ClaimsIdentity([
                new Claim(JwtRegisteredClaimNames.Sub, agent.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.Email, agent.Email),
                new Claim("isAdmin", agent.Privilege),
            ]),
            Expires = DateTime.Now.AddMinutes(expireInMinute),
            SigningCredentials = credentials,
            Issuer = issuer,
            Audience = audience
        };
        
        return new JsonWebTokenHandler().CreateToken(tokenDescriptor);
    }
}