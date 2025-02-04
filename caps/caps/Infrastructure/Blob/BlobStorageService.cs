using Azure.Storage.Blobs;
using Azure.Storage.Sas;

namespace caps.Infrastructure.Blob;

public class BlobStorageService : IBlobStorageService
{
    private readonly BlobContainerClient _containerClient;


    public BlobStorageService()
    {
        var blobServiceClient = new BlobServiceClient(
            "DefaultEndpointsProtocol=https;AccountName=capsblob;AccountKey=4r6mjaynaSw3hOO8PC1aJ/UedcM1rCCziNyVlLSWtLCtP+vK73U3xK0I3G8i1aBK0Seo4tU1JRD/+ASt0CSCig==;EndpointSuffix=core.windows.net");
        _containerClient = blobServiceClient.GetBlobContainerClient("containername");
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