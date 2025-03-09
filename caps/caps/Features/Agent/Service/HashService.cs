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
        try
        {
            string[] parts = hashedPassword.Split("-");
            if (parts.Length != 2)
            {
                return false;
            }

            byte[] hash = Convert.FromHexString(parts[0]);
            byte[] salt = Convert.FromHexString(parts[1]);

            byte[] newHash = Rfc2898DeriveBytes.Pbkdf2(password, salt, Iterations, HashAlgorithmName.SHA512, HashSize);
            return CryptographicOperations.FixedTimeEquals(hash, newHash);
        }
        catch
        {
            Console.WriteLine("Error verifying password hash");
            return false;
        }
    }
}