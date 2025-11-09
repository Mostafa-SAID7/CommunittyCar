using CommunityCar.Application.DTOs.Email;

namespace CommunityCar.Application.Interfaces;

public interface IEmailService
{
    Task<bool> SendEmailAsync(EmailRequest request);
    Task<bool> SendEmailVerificationAsync(string email, string firstName, string lastName, string verificationCode);
    Task<bool> SendPasswordResetAsync(string email, string firstName, string lastName, string resetCode);
    Task<bool> SendOtpAsync(string email, string firstName, string lastName, string otp, string purpose);
    Task<bool> SendWelcomeEmailAsync(string email, string firstName, string lastName);
    Task<string> LoadEmailTemplateAsync(string templateName);
    Task<string> ProcessTemplateAsync(string template, Dictionary<string, string> placeholders);
}