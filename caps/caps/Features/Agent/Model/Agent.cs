using System.ComponentModel.DataAnnotations;
using MongoDB.Bson;

namespace caps.Features.Agent.Model;

public class Agent
{
    [Key]
    public ObjectId Id { get; set; } // MongoDB verwendet häufig einen string?-Id-Typ.

    [Required]
    public string? FirstName { get; set; }

    [Required]
    public string? LastName { get; set; }

    [Required]
    public string? IDNumber { get; set; }

    [Required]
    [EmailAddress]
    public string? Email { get; set; }

    [Required]
    public DateTime? DateOfBirth { get; set; }

    [Required] public string? Privilege { get; set; } = "agent"; // TODO add const agent | admin

    public ContactInformation? ContactInformation { get; set; }

    public string? Biography { get; set; }

    [Required]
    public string? Password { get; set; }

    public bool IsActive { get; set; }
}

public class ContactInformation
{
    [Required]
    public long PhoneNumber { get; set; }

    [Required]
    public string? City { get; set; }

    [Required]
    public string? Address { get; set; }

    [Required]
    public string? State { get; set; }
}