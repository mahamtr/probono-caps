using MongoDB.Driver;
using MongoDB.Driver.GridFS;

namespace caps.Infrastructure.Blob;

public class BlobStorageService : IBlobStorageService
{
    private readonly IGridFSBucket _gridFS;

    public BlobStorageService(IMongoClient mongoClient)
    {
        var database = mongoClient.GetDatabase(Environment.GetEnvironmentVariable("MONGO_DATABASE_NAME"));
        _gridFS = new GridFSBucket(database);
    }

    public async Task<string> UploadObjectAsync(IFormFile file, CancellationToken ct = default)
    {
        using var stream = file.OpenReadStream();
        var fileId = await _gridFS.UploadFromStreamAsync(file.FileName, stream, cancellationToken: ct);
        return fileId.ToString();
    }

    public async Task<byte[]> GetFileAsync(string fileId, CancellationToken ct = default)
    {
        var objectId = MongoDB.Bson.ObjectId.Parse(fileId);
        return await _gridFS.DownloadAsBytesAsync(objectId, cancellationToken: ct);
    }

    public async Task<bool> DeleteObjectAsync(string fileId)
    {
        try
        {
            var objectId = MongoDB.Bson.ObjectId.Parse(fileId);
            await _gridFS.DeleteAsync(objectId);
            return true;
        }
        catch (Exception e)
        {
            return false;
        }
    }

    public async Task<string> GetFileNameAsync(string fileId, CancellationToken ct = default)
    {
        var objectId = MongoDB.Bson.ObjectId.Parse(fileId);
        var filter = Builders<GridFSFileInfo>.Filter.Eq("_id", objectId);
        var fileInfo = await _gridFS.Find(filter).FirstOrDefaultAsync(ct);
        return fileInfo?.Filename ?? string.Empty;
    }
}