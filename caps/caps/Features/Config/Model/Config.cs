using MongoDB.Bson;

namespace caps.Features.Config.Model;

public class Config
{
    [Key]
    public ObjectId Id { get; set; }

    [Required]
    public string? Name { get; set; }

    [Required]
    public string? Type { get; set; } // e.g., "Major", "Program", "Diagnosis"

    public string? Description { get; set; }

    public bool IsActive { get; set; } = true;
}