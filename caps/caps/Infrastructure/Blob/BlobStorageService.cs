using Azure.Storage.Blobs;
using Azure.Storage.Sas;

namespace caps.Infrastructure.Blob;

public class BlobStorageService : IBlobStorageService
{
    private readonly BlobContainerClient _containerClient;


    public BlobStorageService()
    {
        var blobServiceClient = new BlobServiceClient(
            Environment.GetEnvironmentVariable("BLOB_URL_CONNECTION_STRING")
            );
        _containerClient = blobServiceClient.GetBlobContainerClient(            Environment.GetEnvironmentVariable("BLOB_CONTAINER_NAME")
        );
        _containerClient.CreateIfNotExists();
    }


    public async Task UploadObjectAsync(IFormFile file, CancellationToken ct = new())
    {
        var blob = _containerClient.GetBlobClient(file.FileName);
        if (await blob.ExistsAsync(ct)) return;
        await using var data = file.OpenReadStream();
        await _containerClient.UploadBlobAsync(file.FileName, data, ct);
    }

    public async Task<string?> GetDownloadLink(string blobName, CancellationToken ct = new())
    {
        var file = _containerClient.GetBlobClient(blobName);
        string? sasUri = null;
        if (!await file.ExistsAsync(ct)) return sasUri;
        var builder = new BlobSasBuilder(BlobSasPermissions.Read, 
            //TODO configure this in env var
            DateTimeOffset.Now.AddMinutes(15));
        sasUri = file.GenerateSasUri(builder).ToString();

        return sasUri;
    }

    public async Task<bool> DeleteObjectAsync(string blobName)
    {
        return await _containerClient.DeleteBlobIfExistsAsync(blobName);
    }
}