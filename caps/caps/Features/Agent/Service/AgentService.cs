using caps.Features.Agent.Model;
using caps.Infrastructure.Data;
using MongoDB.Bson;
using MongoDB.Driver.Linq;

namespace caps.Features.Agent.Service;

public class AgentService(CapsDbContext dbContext, IMapper mapper) : IAgentService
{
    public async Task<IEnumerable<AgentDto>> ListAgentsAsync()
    {
        var agents =  dbContext.Agents;
        return mapper.Map<List<AgentDto>>(agents.ToList());
    }

    public async Task<bool> ResetPasswordAsync(string id, string newPassword)
    {
        try
        {
            if(string.IsNullOrWhiteSpace(id)) throw new BadHttpRequestException("Id cannot be null or empty.");
            if(string.IsNullOrWhiteSpace(newPassword)) throw new BadHttpRequestException("Password must be valid.");
            
            // TODO add validation for valid password. also hashing needs to be added
            
            var agentInDb = GetAgentInDb(id);
            agentInDb.Password = newPassword;
            return await dbContext.SaveChangesAsync() > 0;
        }
        catch (Exception e)
        {
            throw new BadHttpRequestException(e.Message);
        }

    }


    public async Task<bool> CreateAgentAsync(AgentDto agent)
    {
        try
        {
            var newAgent = new Model.Agent();
            mapper.Map(agent, newAgent);
            dbContext.Agents.Add(newAgent);
            return await dbContext.SaveChangesAsync() > 0;
        }
        catch (Exception e)
        {
            throw new BadHttpRequestException(e.Message);
        }
    }

    public async Task<bool> DeleteAgentAsync(string id)
    {
        try
        {
            if(string.IsNullOrWhiteSpace(id)) throw new BadHttpRequestException("Id cannot be null or empty.");
            var agentInDb = GetAgentInDb(id);
            dbContext.Agents.Remove(agentInDb);
            return await dbContext.SaveChangesAsync() > 0;
        }
        catch (Exception e)
        {
            throw new BadHttpRequestException(e.Message);
        }
    }

    public async Task<bool> UpdateAgentAsync(AgentDto agent)
    {
        try
        {
            if(string.IsNullOrWhiteSpace(agent.Id)) throw new BadHttpRequestException("Id cannot be null or empty.");
            var agentInDb = GetAgentInDb(agent.Id);
            mapper.Map(agent, agentInDb);
            return await dbContext.SaveChangesAsync() > 0;
        }
        catch (Exception e)
        {
            throw new BadHttpRequestException(e.Message);
        }
    }

    private Model.Agent GetAgentInDb(string id)
    {
        var agentInDb = dbContext.Agents.FirstOrDefault(a => a.Id.ToString() == id);
        if (agentInDb == null) throw new BadHttpRequestException("Agent not found");
        return agentInDb;
    }
}