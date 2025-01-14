namespace caps.Features.Agent.Service;

public interface IHashService
{
    string GeneratePasswordHash(string password);
    bool VerifyPasswordHash(string password, string hashedPassword);
}