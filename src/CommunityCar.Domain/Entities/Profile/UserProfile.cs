using System.ComponentModel.DataAnnotations;

namespace CommunityCar.Domain.Entities.Profile;

public class UserProfile
{
    public int Id { get; set; }

    [Required]
    public string UserId { get; set; } = string.Empty;

    [StringLength(100)]
    public string? DisplayName { get; set; }

    [StringLength(500)]
    public string? Bio { get; set; }

    [StringLength(50)]
    public string? PhoneNumber { get; set; }

    public DateTime? DateOfBirth { get; set; }

    [StringLength(20)]
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

    [StringLength(200)]
    public string? Website { get; set; }

    [StringLength(100)]
    public string? Occupation { get; set; }

    [StringLength(200)]
    public string? Company { get; set; }

    [StringLength(500)]
    public string? ProfilePictureUrl { get; set; }

    [StringLength(500)]
    public string? CoverPhotoUrl { get; set; }

    public bool IsPublic { get; set; } = true;

    public bool ShowEmail { get; set; } = false;

    public bool ShowPhone { get; set; } = false;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Navigation property
    public virtual Auth.User? User { get; set; }

    // Computed properties
    public string FullAddress => string.Join(", ",
        new[] { Address, City, State, ZipCode, Country }
        .Where(x => !string.IsNullOrWhiteSpace(x)));

    public int Age => DateOfBirth.HasValue ?
        DateTime.UtcNow.Year - DateOfBirth.Value.Year -
        (DateTime.UtcNow.DayOfYear < DateOfBirth.Value.DayOfYear ? 1 : 0) : 0;
}