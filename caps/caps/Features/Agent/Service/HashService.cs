using System.Security.Cryptography;

namespace caps.Features.Agent.Service;

public class HashService : IHashService
{
    private const int SaltSize = 16;
    private const int HashSize = 32;
    private const int Iterations = 999999;
    
    public string GeneratePasswordHash(string password)
    {
        var salt = RandomNumberGenerator.GetBytes(SaltSize);
        var hash = Rfc2898DeriveBytes.Pbkdf2(password, salt, Iterations, HashAlgorithmName.SHA512, HashSize);

        return $"{Convert.ToHexString(hash)}-{Convert.ToHexString(salt)}";
    }

    public bool VerifyPasswordHash(string password, string hashedPassword)
    {
        var parts = hashedPassword.Split("-");
        var hash = Convert.FromHexString(parts.First());
        var salt = Convert.FromHexString(parts.Last());

        var inputhash = Rfc2898DeriveBytes.Pbkdf2(password, salt, Iterations, HashAlgorithmName.SHA512, HashSize);

        return CryptographicOperations.FixedTimeEquals(hash, inputhash);
    }
}