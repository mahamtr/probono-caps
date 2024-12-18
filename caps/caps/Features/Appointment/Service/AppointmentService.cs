using caps.Features.Appointment.Model;
using caps.Infrastructure.Data;

namespace caps.Features.Appointment.Service;

public class AppointmentService(CapsDbContext dbContext, IMapper mapper) : IAppointmentService
{
    public async Task<IEnumerable<AppointmentDto>> ListAllAppointments()
    {
        var appointments =  dbContext.Appointments;
        return mapper.Map<List<AppointmentDto>>(appointments.ToList());
    }

    public async Task<IEnumerable<AppointmentDto>> ListMyAppointment()
    {
        string id = "";
        //todo get id from claim from auth
        var appointments =  dbContext.Appointments.Where(a=> a.Id.ToString()== id);
        return mapper.Map<List<AppointmentDto>>(appointments.ToList());
    }

    public async Task<bool> UpdateAppointment(AppointmentDto appointment)
    {
        try
        {
            if(string.IsNullOrWhiteSpace(appointment.Id)) throw new BadHttpRequestException("Id cannot be null or empty.");
            var appointmentInDb = GetAppointmentInDb(appointment.Id);
            mapper.Map(appointment, appointmentInDb);
            return await dbContext.SaveChangesAsync() > 0;
        }
        catch (Exception e)
        {
            throw new BadHttpRequestException(e.Message);
        }
    }

    public async Task<bool> CreateAppointment(AppointmentDto appointment)
    {
        try
        {
            var newAppointment = new Model.Appointment();
            mapper.Map(appointment, newAppointment);
            dbContext.Appointments.Add(newAppointment);
            return await dbContext.SaveChangesAsync() > 0;
        }
        catch (Exception e)
        {
            throw new BadHttpRequestException(e.Message);
        }
    }

    public async Task<bool> DeleteAppointment(string id)
    {
        try
        {
            if(string.IsNullOrWhiteSpace(id)) throw new BadHttpRequestException("Id cannot be null or empty.");
            var appointmentInDb = GetAppointmentInDb(id);
            dbContext.Appointments.Remove(appointmentInDb);
            return await dbContext.SaveChangesAsync() > 0;
        }
        catch (Exception e)
        {
            throw new BadHttpRequestException(e.Message);
        }
    }
    
    private Model.Appointment GetAppointmentInDb(string id)
    {
        var agentInDb = dbContext.Appointments.FirstOrDefault(a => a.Id.ToString() == id);
        if (agentInDb == null) throw new BadHttpRequestException("Appointment not found");
        return agentInDb;
    }
}