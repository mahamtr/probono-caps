using caps.Features.Agent.Service;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;

namespace caps.Features.Agent.Controller;
[ApiController]
[Route("api/[controller]/[action]")]
public class AgentController(IAgentService agentService) : ControllerBase
{
    [HttpGet]
    public async Task<IEnumerable<Agent>> ListAgents()
    {
        return await agentService.ListAgentsAsync();
    }
    
    [HttpPost]
    public async Task<bool> ResetPassword(ObjectId id, string newPassword)
    {
        return await agentService.ResetPasswordAsync(id, newPassword);
    }
    
    [HttpPost]
    public async Task<bool> CreateAgent(Agent agent)
    {
        return await agentService.CreateAgentAsync(agent);
    }
    
    [HttpPost]
    public async Task<bool> UpdateAgent(Agent agent)
    {
        return await agentService.UpdateAgentAsync(agent);
    }
    
    [HttpPost]
    public async Task<bool> DeleteAgent(ObjectId id)
    {
        return await agentService.DeleteAgentAsync(id);
    }
}