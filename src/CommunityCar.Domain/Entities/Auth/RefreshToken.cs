using CommunityCar.Domain.Common;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CommunityCar.Domain.Entities.Auth;

[Table("RefreshTokens")]
public class RefreshToken : BaseEntity
{
    [Required]
    public string TokenId { get; set; } = Guid.NewGuid().ToString();

    [Required]
    public string UserId { get; set; } = string.Empty;

    [Required]
    public string Token { get; set; } = string.Empty;

    [Required]
    public string DeviceFingerprint { get; set; } = string.Empty;

    [Required]
    public DateTime ExpiresAt { get; set; }

    public bool IsRevoked { get; set; } = false;

    public DateTime? RevokedAt { get; set; }

    public string? RevokedByIp { get; set; }

    public string? ReplacedByToken { get; set; }

    [Required]
    public string CreatedByIp { get; set; } = string.Empty;

    public bool IsExpired => DateTime.UtcNow >= ExpiresAt;

    public bool IsActive => !IsRevoked && !IsDeleted && !IsExpired;

    // Navigation property
    public virtual User? User { get; set; }
}