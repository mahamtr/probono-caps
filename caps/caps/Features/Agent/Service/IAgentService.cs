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
    
    Task<IEnumerable<Agent>> ListAgentsAsync();
    Task<bool> ResetPasswordAsync(ObjectId id,string newPassword);
    Task<bool> CreateAgentAsync(Agent agent);
    Task<bool> DeleteAgentAsync(ObjectId id);
    Task<bool> UpdateAgentAsync(Agent agent);

}