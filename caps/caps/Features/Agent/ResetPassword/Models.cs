namespace caps.Features.Agent.ResetPassword;


public class Request
{
    [Required]
    public string Id { get; set; }

    [Required]
    public string Password { get; set; }
}