using System.ComponentModel.DataAnnotations;

namespace CommunityCar.Application.DTOs.Profile;

public class UpdateProfileRequest
{
    [StringLength(100, ErrorMessage = "Display name cannot exceed 100 characters")]
    public string? DisplayName { get; set; }

    [StringLength(500, ErrorMessage = "Bio cannot exceed 500 characters")]
    public string? Bio { get; set; }

    [Phone(ErrorMessage = "Invalid phone number format")]
    [StringLength(50)]
    public string? PhoneNumber { get; set; }

    [DataType(DataType.Date)]
    public DateTime? DateOfBirth { get; set; }

    [RegularExpression("^(Male|Female|Other|Prefer not to say)$", ErrorMessage = "Invalid gender value")]
    public string? Gender { get; set; }

    [StringLength(200)]
    public string? Address { get; set; }

    [StringLength(100)]
    public string? City { get; set; }

    [StringLength(100)]
    public string? State { get; set; }

    [StringLength(20)]
    public string? ZipCode { get; set; }

    [StringLength(100)]
    public string? Country { get; set; }

    [Url(ErrorMessage = "Invalid website URL")]
    [StringLength(200)]
    public string? Website { get; set; }

    [StringLength(100)]
    public string? Occupation { get; set; }

    [StringLength(200)]
    public string? Company { get; set; }

    public bool IsPublic { get; set; } = true;

    public bool ShowEmail { get; set; } = false;

    public bool ShowPhone { get; set; } = false;
}