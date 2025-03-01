using System.ComponentModel.DataAnnotations.Schema;

namespace caps.Features.Appointment.Model;

public class AppointmentDto
{
    [Key]
    public string Id { get; set; }

    [Required]
    public string Reason { get; set; }

    public string FamilyComposition { get; set; }

    public string Mode { get; set; }

    public string OrganicDisease { get; set; }

    public string DiseaseDetail { get; set; }

    public string Medication { get; set; }

    public string TreatingDoctor { get; set; }

    public string HistoryOfMentalIllness { get; set; }

    public string MentalIllnessDetail { get; set; }

    public string InterventionOne { get; set; }

    public string InterventionTwo { get; set; }

    public string DetailAttention { get; set; }

    public string TaskOne { get; set; }

    public string TaskTwo { get; set; }

    public string Tracing { get; set; }

    public string RemissionApplies { get; set; }

    public string Destination { get; set; }

    public string DiagnosticOne { get; set; }

    public string DiagnosticTwo { get; set; }

    public string Status { get; set; }

    [Required]
    public DateTime ScheduledDate { get; set; }

    public DateTime LastUpdated { get; set; }

    [ForeignKey("Patient")]
    public string PatientId { get; set; }


    [ForeignKey("Agent")]
    public string AgentId { get; set; }


    public List<string> BlobUrls { get; set; }
    public PatientDto? NewPatient { get; set; }
}