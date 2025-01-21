
namespace caps.Features.Agent.Model;

public class AgentDto
{
    public string Id { get; set; } 
    
    public string? FirstName { get; set; }

    public string? LastName { get; set; }

    public string? IDNumber { get; set; }

    [EmailAddress]
    public string? Email { get; set; }

    public DateTime? DateOfBirth { get; set; }

    public string? Privilege { get; set; }

    public ContactInformation? ContactInformation { get; set; }

    public string? Biography { get; set; }

    public bool IsActive { get; set; }
    public string? Password { get; set; }
}