namespace caps.Features.Config.Model;

public class ConfigDto
{
    public string? Id { get; set; }

    [Required]
    public string? Name { get; set; }

    [Required]
    public string? Type { get; set; }

    public string? Description { get; set; }

    public bool IsActive { get; set; }
}