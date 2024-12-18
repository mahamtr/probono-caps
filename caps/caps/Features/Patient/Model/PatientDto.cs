using caps.Features.Agent.Model;

namespace caps.Features.Patient.Model;

public class PatientDto
{
    // TODO add req fields
    public string Id { get; set; }
    
    [Required]
    public string FirstName { get; set; }

    [Required]
    public string LastName { get; set; }

    [Required]
    public int IDNumber { get; set; }

    [Required]
    public DateTime DateOfBirth { get; set; }

    public string CivilStatus { get; set; }

    public string EducationLevel { get; set; }

    public GuardianShipSection GuardianShipSection { get; set; } = new();

    public StudentSection StudentSection { get; set; } = new();

    public ContactInformation ContactInformation { get; set; } = new();

    public string HouseZone { get; set; }

    // [NotMapped] // Da `Age` berechnet wird
    // public int Age => DateTime.Now.Year - DateOfBirth.Year;

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