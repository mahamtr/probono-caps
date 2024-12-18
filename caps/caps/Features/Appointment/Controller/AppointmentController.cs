using caps.Features.Appointment.Model;
using caps.Features.Appointment.Service;
using Microsoft.AspNetCore.Mvc;

namespace caps.Features.Appointment.Controller;
[ApiController]
[Route("api/[controller]/[action]")]
public class AppointmentController(IAppointmentService appointmentService): ControllerBase
{
    [HttpGet]
    // todo add adminOnly
    public Task<IEnumerable<AppointmentDto>> ListAllAppointments()
    {
        return appointmentService.ListAllAppointments();
    }
    
    [HttpGet]
    public Task<IEnumerable<AppointmentDto>> ListMyAppointments()
    {
        return appointmentService.ListMyAppointment();
    }
    
    [HttpPost]
    public Task<bool> UpdateAppointment(AppointmentDto appointmentDto)
    {
        return appointmentService.UpdateAppointment(appointmentDto);
    }
    
    [HttpPatch]
    public Task<bool> CreateAppointment(AppointmentDto patientDto)
    {
        return appointmentService.CreateAppointment(patientDto);
    }
    
    [HttpDelete]
    public Task<bool> DeletePatient(string id)
    {
        return appointmentService.DeleteAppointment(id);
    }
}