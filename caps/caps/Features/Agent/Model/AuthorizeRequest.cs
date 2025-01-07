
namespace caps.Features.Agent.Model;

public class AuthorizeRequest
{
    [EmailAddress]
    [Required]
    public string Email { get; set; }

    [Required]
    public string Password { get; set; }
}