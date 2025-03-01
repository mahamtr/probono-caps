using caps.Features.Appointment.Model;
using caps.Infrastructure.Data;
using FastEndpoints;
using IMapper = AutoMapper.IMapper;

namespace caps.Features.Appointment.CreateAppointment;

public class CreateAppointment(CapsDbContext dbContext, IMapper mapper) : Endpoint<AppointmentDto, string>
{
    public override void Configure()
    {
        Post("/api/appointment/create");
    }

    public override async Task HandleAsync(AppointmentDto req, CancellationToken ct)
    {
        try
        {
            var newAppointment = new Model.Appointment();
            mapper.Map(req, newAppointment);

            if (string.IsNullOrEmpty(req.PatientId) && req.NewPatient != null)
            {
                // Create new patient
                var newPatient = new Patient.Model.Patient
                {
                    FirstName = req.NewPatient.FirstName,
                    LastName = req.NewPatient.LastName,
                    IDNumber = req.NewPatient.IDNumber
                };
                dbContext.Patients.Add(newPatient);
                await dbContext.SaveChangesAsync(ct);
                newAppointment.PatientId = newPatient.Id;
            }

            dbContext.Appointments.Add(newAppointment);
            if (await dbContext.SaveChangesAsync(ct) > 0)
            {
                await SendAsync(newAppointment.Id.ToString(), cancellation: ct);
            }
            else
            {
                ThrowError("Error creating appointment.");
            }
        }
        catch (Exception e)
        {
            throw new BadHttpRequestException(e.Message);
        }
    }
}