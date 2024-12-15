using caps.Features.Agent.Model;
using MongoDB.Bson;

namespace caps.Features.Agent.Service;

public interface IAgentService
{
// - listAgents (adminOnly)
// - authenticate
// - resetPassword
// - createAgent (adminOnly)
// - deleteAgent (adminOnly)
// - updateAgent (adminOnly)
    
    Task<IEnumerable<AgentDto>> ListAgentsAsync();
    Task<bool> ResetPasswordAsync(string id,string newPassword);
    Task<bool> CreateAgentAsync(AgentDto agent);
    Task<bool> DeleteAgentAsync(string id);
    Task<bool> UpdateAgentAsync(AgentDto agent);

}