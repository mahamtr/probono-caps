using caps.Features.Agent.Authenticate;
using caps.Features.Agent.Model;

namespace caps.Features.Agent.Service;

public interface IAuthService
{
    string Authenticate(Request request);
}