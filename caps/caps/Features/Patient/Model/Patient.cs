using System.ComponentModel.DataAnnotations.Schema;
using caps.Features.Agent.Model;
using MongoDB.Bson;

namespace caps.Features.Patient.Model;

public class Patient
{
    [Key]
    public ObjectId Id { get; set; }

    [Required]
    public string FirstName { get; set; }

    [Required]
    public string LastName { get; set; }

    [Required]
    public double IDNumber { get; set; }

    [Required]
    public DateTime DateOfBirth { get; set; }

    public string CivilStatus { get; set; }

    public string EducationLevel { get; set; }

    public GuardianShipSection GuardianShipSection { get; set; } = new();

    public StudentSection StudentSection { get; set; } = new();

    public ContactInformation ContactInformation { get; set; } = new();

    public string HouseZone { get; set; }

    [NotMapped] // Da `Age` berechnet wird
    public int Age => DateTime.Now.Year - DateOfBirth.Year;

    [EmailAddress]
    public string Email { get; set; }

    public string Program { get; set; }

    public string Referral { get; set; }

    public string Diagnostic { get; set; }

    public string SecondDiagnostic { get; set; }

    [Required]
    public string Gender { get; set; }

    public string Status { get; set; }
}

public class GuardianShipSection
{
    public string? GuardianShipName { get; set; } 

    public string GuardianShipPhone { get; set; }
}

public class StudentSection
{
    public string? Major { get; set; } 

    public int StudyYear { get; set; }
}