using System.ComponentModel.DataAnnotations;

namespace CommunityCar.Application.DTOs.Auth;

public class SocialLoginRequest
{
    [Required]
    public string Provider { get; set; } = string.Empty; // "Google", "Facebook", etc.

    [Required]
    public string AccessToken { get; set; } = string.Empty;

    public string? DeviceFingerprint { get; set; }
}