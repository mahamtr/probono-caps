namespace caps.Features.Agent.ChangePassword;

    public class Request
    {
        public string CurrentPassword { get; set; } = null!;
        public string NewPassword { get; set; } = null!;
    }
