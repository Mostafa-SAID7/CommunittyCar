using CommunityCar.Domain.Entities;
using Microsoft.AspNetCore.Identity;

namespace CommunityCar.Domain.Entities.Auth;

public class User : IdentityUser
{
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? LastLoginAt { get; set; }
    public bool IsActive { get; set; } = true;
    public bool TwoFactorEnabled { get; set; } = false;
    public string? TwoFactorSecret { get; set; }
    public string? RefreshToken { get; set; }
    public DateTime? RefreshTokenExpiryTime { get; set; }
    public string? DeviceFingerprint { get; set; }
    public DateTime? LastPasswordChange { get; set; }
    public int FailedLoginAttempts { get; set; } = 0;
    public DateTime? LockoutEndTime { get; set; }
    public bool EmailVerified { get; set; } = false;
    public string? VerificationToken { get; set; }
    public DateTime? VerificationTokenExpiry { get; set; }
    public string? PasswordResetToken { get; set; }
    public DateTime? PasswordResetTokenExpiry { get; set; }
    public string? OtpCode { get; set; }
    public DateTime? OtpExpiry { get; set; }
    public bool IsBiometricEnabled { get; set; } = false;
    public string? BiometricKey { get; set; }
    public string? SocialLoginProvider { get; set; }
    public string? SocialLoginId { get; set; }
    public string? ApiKey { get; set; }
    public DateTime? ApiKeyCreatedAt { get; set; }
    public DateTime? ApiKeyExpiresAt { get; set; }

    public string FullName => $"{FirstName} {LastName}";

    // Profile properties
    public string? Bio { get; set; }
    public string? Location { get; set; }
    public string? Website { get; set; }
    public DateTime? DateOfBirth { get; set; }
    public string? Gender { get; set; }
    public bool IsPrivate { get; set; } = false;
    public string? ProfilePictureUrl { get; set; }
    public string? CoverPhotoUrl { get; set; }

    // Navigation properties
    public virtual ICollection<Car> Cars { get; set; } = new List<Car>();
    public virtual ICollection<Booking> Bookings { get; set; } = new List<Booking>();
}