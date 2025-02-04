using System.ComponentModel.DataAnnotations.Schema;
using MongoDB.Bson;

namespace caps.Features.Appointment.Model;

public class AppointmentTableDto
{
    [Key]
    public string Id { get; set; }

    [Required]
    public string Reason { get; set; }

    public string PatientName { get; set; }

    public int Age { get; set; }

    public string Program { get; set; }

    public DateTime AppointmentDate { get; set; }

    public string? Mode { get; set; }

    public string? Location { get; set; }

    public string? Status { get; set; }

   
}