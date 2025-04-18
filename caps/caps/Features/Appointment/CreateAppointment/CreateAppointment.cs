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
            Patient.Model.Patient patient;

            if (string.IsNullOrEmpty(req.PatientId) && req.NewPatient != null)
            {
                // Create new patient
                patient = new Patient.Model.Patient
                {
                    FirstName = req.NewPatient.FirstName,
                    LastName = req.NewPatient.LastName,
                    IDNumber = req.NewPatient.IDNumber,
                    Status = PatientStatus.Active.ToString() 
                };
                dbContext.Patients.Add(patient);
                await dbContext.SaveChangesAsync(ct);
            }
            else
            {
                // Fetch existing patient
                patient = dbContext.Patients.FirstOrDefault(p=>  p.Id.ToString() == req.PatientId)
                          ?? throw new BadHttpRequestException("Patient not found.");
            }
            

            // Increment the patient's appointment counter
            patient.NumberOfAppointments++;
            dbContext.Patients.Update(patient);

            await dbContext.SaveChangesAsync(ct);
            // TODO reafactor all this logic, maybe use some event for decoupling this. also remove this save changes, and allow transcations. need to move mongodb to replica


            // Create new appointment using the constructor
            var newAppointment = new Model.Appointment(patient.IDNumber, patient.NumberOfAppointments);
            mapper.Map(req, newAppointment);
            newAppointment.PatientId = patient.Id;

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