using caps.Infrastructure.Data;
using MongoDB.Bson;
using MongoDB.Driver.Linq;

namespace caps.Features.Agent.Service;

public class AgentService(CapsDbContext dbContext) : IAgentService
{
    private CapsDbContext DbContext { get; } = dbContext;

    public async Task<IEnumerable<Agent>> ListAgentsAsync()
    {
        return await dbContext.Agents.ToListAsync();
    }

    public async Task<bool> ResetPasswordAsync(ObjectId id, string newPassword)
    {
        try
        {
            var agent = await MongoQueryable.FirstOrDefaultAsync(DbContext.Agents, a => a.Id == id);
            if (agent is null) throw new BadHttpRequestException("No Agent was found");

            agent.Password = newPassword;

            return await DbContext.SaveChangesAsync() > 0;
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
            return await DbContext.SaveChangesAsync() > 0;
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
            var a = id.ToString();
            // TODO implement delete, don't know how to parse a json to ObjectId, should we use another self created id?
            var agent = await MongoQueryable.FirstOrDefaultAsync(DbContext.Agents, a => a.Id == id);
            if (agent is null) throw new BadHttpRequestException("No Agent was found");

            DbContext.Agents.Remove(agent);
            return await DbContext.SaveChangesAsync() > 0;
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
            var agentInDb = dbContext.Agents.FirstOrDefault(a => a.FirstName == "maai");
            if (agentInDb == null) throw new BadHttpRequestException("Agent not found");
            // DbContext.Agents.Update(agent);
            // TODO fix this with mapper, needs to be inyected.
            // Mapper.Map<Agent,Agent>(agent, agentInDb);
            agentInDb = agent;
            return await DbContext.SaveChangesAsync() > 0;
        }
        catch (Exception e)
        {
            throw new BadHttpRequestException(e.Message);
        }
    }
}