using AutoMapper;
using CommunityCar.Application.DTOs.Email;

namespace CommunityCar.Application.Mappings;

public class EmailMappingProfile : Profile
{
    public EmailMappingProfile()
    {
        // Email request mappings
        CreateMap<EmailRequest, EmailRequest>();
    }
}

public class EmailVerificationData
{
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string VerificationCode { get; set; } = string.Empty;
    public string VerificationUrl { get; set; } = string.Empty;
}

public class PasswordResetData
{
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string ResetCode { get; set; } = string.Empty;
    public string ResetUrl { get; set; } = string.Empty;
}

public class OtpData
{
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string OTP { get; set; } = string.Empty;
    public string Purpose { get; set; } = string.Empty;
    public string Timestamp { get; set; } = string.Empty;
    public string Digit1 { get; set; } = string.Empty;
    public string Digit2 { get; set; } = string.Empty;
    public string Digit3 { get; set; } = string.Empty;
    public string Digit4 { get; set; } = string.Empty;
    public string Digit5 { get; set; } = string.Empty;
    public string Digit6 { get; set; } = string.Empty;
}

public class WelcomeEmailData
{
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
}