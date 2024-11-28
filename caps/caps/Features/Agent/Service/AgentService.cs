using caps.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using MongoDB.Bson;
using MongoDB.Driver.Linq;

namespace caps.Features.Agent.Service;

public class AgentService(CapsDbContext dbContext) : IAgentService
{
    private CapsDbContext DbContext { get; } = dbContext;
    
    public async Task<IEnumerable<Agent>> ListAgentsAsync()
    {
        return await EntityFrameworkQueryableExtensions.ToListAsync(DbContext.Agents);
    }

    public async Task<bool> ResetPasswordAsync(ObjectId id, string newPassword)
    {
        try
        {
            var agent = await MongoQueryable.FirstOrDefaultAsync(DbContext.Agents, a => a.Id == id);
            if (agent is null) throw new BadHttpRequestException("No Agent was found");

            agent.Password = newPassword;

            return await DbContext.SaveChangesAsync() > 1;
        }
        catch (Exception e)
        {
            throw new BadHttpRequestException(e.Message);
        }
       
    }


    public async Task<bool> CreateAgentAsync(Agent agent)
    {
        try
        {
            DbContext.Agents.Add(agent);
            return await DbContext.SaveChangesAsync() > 1;
        }
        catch (Exception e)
        {
            throw new BadHttpRequestException(e.Message);
        }
    }

    public async Task<bool> DeleteAgentAsync(ObjectId id)
    {
        try
        {
            var agent = await MongoQueryable.FirstOrDefaultAsync(DbContext.Agents, a => a.Id == id);
            if (agent is null) throw new BadHttpRequestException("No Agent was found");

            DbContext.Agents.Remove(agent);
            return await DbContext.SaveChangesAsync() > 1;
        }
        catch (Exception e)
        {
            throw new BadHttpRequestException(e.Message);
        }
    }

    public async Task<bool> UpdateAgentAsync(Agent agent)
    {
        try
        {
            DbContext.Agents.Update(agent);
            return await DbContext.SaveChangesAsync() > 1;
        }
        catch (Exception e)
        {
            throw new BadHttpRequestException(e.Message);
        }    
    }
}