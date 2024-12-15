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
    public async Task<IEnumerable<AgentDto>> ListAgents()
    {
        return await agentService.ListAgentsAsync();
    }
    
    [HttpPatch]
    public async Task<bool> ResetPassword(string id, string newPassword)
    {
        return await agentService.ResetPasswordAsync(id, newPassword);
    }
    
    [HttpPost]
    public async Task<bool> CreateAgent(AgentDto agent)
    {
        return await agentService.CreateAgentAsync(agent);
    }
    
    [HttpPatch]
    public async Task<bool> UpdateAgent(AgentDto agent)
    {
        return await agentService.UpdateAgentAsync(agent);
    }
    
    [HttpDelete]
    public async Task<bool> DeleteAgent(string id)
    {
        return await agentService.DeleteAgentAsync(id);
    }
}