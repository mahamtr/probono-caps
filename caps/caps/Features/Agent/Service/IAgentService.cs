using caps.Features.Agent.Model;

namespace caps.Features.Agent.Service;

public interface IAgentService
{
    Task<IEnumerable<AgentDto>> ListAgentsAsync();
    Task<bool> ResetPasswordAsync(string id,string newPassword);
    Task<bool> CreateAgentAsync(AgentDto agent);
    Task<bool> DeleteAgentAsync(string id);
    Task<bool> UpdateAgentAsync(AgentDto agent);

}