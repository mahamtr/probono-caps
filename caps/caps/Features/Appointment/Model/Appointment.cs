using System.ComponentModel.DataAnnotations.Schema;
using MongoDB.Bson;

namespace caps.Features.Appointment.Model;

public class Appointment
{
    [Key]
    public ObjectId Id { get; set; }

    [Required]
    public string Reason { get; set; } = null!;

    public string? FamilyComposition { get; set; }

    public string? Mode { get; set; }

    public string? OrganicDisease { get; set; }

    public string? DiseaseDetail { get; set; }

    public string? Medication { get; set; }

    public string? TreatingDoctor { get; set; }

    public string? HistoryOfMentalIllness { get; set; }

    public string? MentalIllnessDetail { get; set; }

    public string? InterventionOne { get; set; }

    public string? InterventionTwo { get; set; }

    public string? DetailAttention { get; set; }

    public string? TaskOne { get; set; }

    public string? TaskTwo { get; set; }

    public string? Tracing { get; set; }

    public string? RemissionApplies { get; set; }

    public string? Destination { get; set; }

    public string? DiagnosticOne { get; set; }

    public string? DiagnosticTwo { get; set; }

    public string? Status { get; set; }

    [Required]
    public DateTime ScheduledDate { get; set; }

    public DateTime? LastUpdated { get; set; }

    [ForeignKey("Patient")]
    public ObjectId PatientId { get; set; }

    public Patient.Model.Patient? Patient { get; set; }

    [ForeignKey("Agent")]
    public ObjectId AgentId { get; set; }

    public Agent.Model.Agent Agent { get; set; } = null!;

    public List<string> BlobUrls { get; set; } = [];

    public string AppointmentId { get; set; } // Human-readable ID for the appointment

    public Appointment(string idNumber, int counter)
    {
        // Format the IDNumber into "0501-1999-00492"
        var formattedIdNumber = $"{idNumber.Substring(0, 4)}-{idNumber.Substring(4, 4)}-{idNumber.Substring(8)}";

        // Combine with the counter to create the AppointmentId
        AppointmentId = $"{formattedIdNumber}.{counter:D3}";
    }

    public Appointment()
    {
        
    }
}