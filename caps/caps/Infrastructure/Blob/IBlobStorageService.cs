using MongoDB.Bson;

namespace caps.Infrastructure.Blob;

public interface IBlobStorageService
{
    Task<string> UploadObjectAsync(IFormFile file, CancellationToken ct);
    Task<byte[]> GetFileAsync(string fileId, CancellationToken ct);
    Task<bool> DeleteObjectAsync(string fileId);
    Task<string> GetFileNameAsync(string fileId, CancellationToken ct);
}