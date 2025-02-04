namespace caps.Infrastructure.Blob;

public interface IBlobStorageService
{
    Task UploadObjectAsync(IFormFile file, CancellationToken ct);
    Task<string?> GetDownloadLink(string blobName, CancellationToken ct);
    Task<bool> DeleteObjectAsync( string blobName);
}