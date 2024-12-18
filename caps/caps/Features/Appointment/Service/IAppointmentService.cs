using caps.Features.Appointment.Model;

namespace caps.Features.Appointment.Service;

public interface IAppointmentService
{
    Task<IEnumerable<AppointmentDto>> ListAllAppointments();
    Task<IEnumerable<AppointmentDto>> ListMyAppointment();
    Task<bool> UpdateAppointment(AppointmentDto appointment);
    Task<bool> CreateAppointment(AppointmentDto appointment);
    Task<bool> DeleteAppointment(string id);
}