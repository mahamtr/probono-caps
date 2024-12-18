using caps.Features.Agent.Model;
using caps.Features.Agent.Service;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;

namespace caps.Features.Agent.Controller;
[ApiController]
[Route("api/[controller]/[action]")]
public class AgentController(IAgentService agentService) : ControllerBase
{
    [HttpGet]
    //TODO add adminOnly auth
    public Task<IEnumerable<AgentDto>> ListAgents()
    {
        return agentService.ListAgentsAsync();
    }
    
    [HttpPatch]
    public Task<bool> ResetPassword(string id, string newPassword)
    {
        return agentService.ResetPasswordAsync(id, newPassword);
    }
    
    [HttpPost]
    //TODO add adminOnly auth
    public Task<bool> CreateAgent(AgentDto agent)
    {
        return agentService.CreateAgentAsync(agent);
    }
    
    [HttpPatch]
    //TODO add adminOnly auth
    public Task<bool> UpdateAgent(AgentDto agent)
    {
        return agentService.UpdateAgentAsync(agent);
    }
    
    [HttpDelete]
    //TODO add adminOnly auth
    public Task<bool> DeleteAgent(string id)
    {
        return agentService.DeleteAgentAsync(id);
    }
}