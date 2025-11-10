using System.ComponentModel.DataAnnotations;

namespace CommunityCar.Application.DTOs.Auth;

public class ResetPasswordRequest
{
    [Required]
    public string Email { get; set; } = string.Empty;

    [Required]
    public string ResetCode { get; set; } = string.Empty;

    [Required]
    [MinLength(8)]
    public string NewPassword { get; set; } = string.Empty;

    [Required]
    [Compare("NewPassword")]
    public string ConfirmPassword { get; set; } = string.Empty;
}