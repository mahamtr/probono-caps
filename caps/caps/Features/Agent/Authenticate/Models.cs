
namespace caps.Features.Agent.Authenticate;

public class Request
{
    [EmailAddress]
    [Required]
    public string Email { get; set; }

    [Required]
    public string Password { get; set; }
}