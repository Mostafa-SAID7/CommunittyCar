using CommunityCar.Application.DTOs.Email;
using CommunityCar.Application.Interfaces;
using CommunityCar.Domain.Utilities;
using Microsoft.Extensions.Configuration;
using System.Net;
using System.Net.Mail;

namespace CommunityCar.Application.Services;

public class EmailService : IEmailService
{
    private readonly IConfiguration _configuration;
    private readonly IWebHostEnvironment _environment;

    public EmailService(IConfiguration configuration, IWebHostEnvironment environment)
    {
        _configuration = configuration;
        _environment = environment;
    }

    public async Task<bool> SendEmailAsync(EmailRequest request)
    {
        try
        {
            var smtpSettings = _configuration.GetSection("Email");

            using var client = new SmtpClient
            {
                Host = smtpSettings["SmtpServer"] ?? "smtp.gmail.com",
                Port = int.Parse(smtpSettings["Port"] ?? "587"),
                EnableSsl = true,
                Credentials = new NetworkCredential(
                    smtpSettings["Username"],
                    smtpSettings["Password"]
                )
            };

            var mailMessage = new MailMessage
            {
                From = new MailAddress(
                    smtpSettings["FromEmail"] ?? "noreply@communitycar.com",
                    request.FromName ?? smtpSettings["FromName"] ?? "CommunityCar"
                ),
                Subject = request.Subject,
                Body = request.IsHtml ? request.Body : request.Body,
                IsBodyHtml = request.IsHtml
            };

            mailMessage.To.Add(request.ToEmail);

            await client.SendMailAsync(mailMessage);
            return true;
        }
        catch (Exception ex)
        {
            // Log the exception (logging service would be injected here)
            Console.WriteLine($"Email sending failed: {ex.Message}");
            return false;
        }
    }

    public async Task<bool> SendEmailVerificationAsync(string email, string firstName, string lastName, string verificationCode)
    {
        var template = await LoadEmailTemplateAsync("EmailVerificationTemplate.html");

        var placeholders = new Dictionary<string, string>
        {
            ["{{FirstName}}"] = firstName,
            ["{{LastName}}"] = lastName,
            ["{{Email}}"] = email,
            ["{{VerificationCode}}"] = verificationCode,
            ["{{VerificationUrl}}"] = $"{_configuration["App:BaseUrl"]}/verify-email?code={verificationCode}"
        };

        var body = await ProcessTemplateAsync(template, placeholders);

        var request = new EmailRequest
        {
            ToEmail = email,
            Subject = SD.EmailVerificationSubject,
            Body = body,
            IsHtml = true
        };

        return await SendEmailAsync(request);
    }

    public async Task<bool> SendPasswordResetAsync(string email, string firstName, string lastName, string resetCode)
    {
        var template = await LoadEmailTemplateAsync("PasswordResetTemplate.html");

        var placeholders = new Dictionary<string, string>
        {
            ["{{FirstName}}"] = firstName,
            ["{{LastName}}"] = lastName,
            ["{{Email}}"] = email,
            ["{{ResetCode}}"] = resetCode,
            ["{{ResetUrl}}"] = $"{_configuration["App:BaseUrl"]}/reset-password?code={resetCode}"
        };

        var body = await ProcessTemplateAsync(template, placeholders);

        var request = new EmailRequest
        {
            ToEmail = email,
            Subject = SD.PasswordResetSubject,
            Body = body,
            IsHtml = true
        };

        return await SendEmailAsync(request);
    }

    public async Task<bool> SendOtpAsync(string email, string firstName, string lastName, string otp, string purpose)
    {
        var template = await LoadEmailTemplateAsync("OtpVerificationTemplate.html");

        var placeholders = new Dictionary<string, string>
        {
            ["{{FirstName}}"] = firstName,
            ["{{LastName}}"] = lastName,
            ["{{Email}}"] = email,
            ["{{OTP}}"] = otp,
            ["{{Purpose}}"] = purpose,
            ["{{Timestamp}}"] = DateTime.UtcNow.ToString("yyyy-MM-dd HH:mm:ss UTC"),
            ["{{Digit1}}"] = otp.Length > 0 ? otp[0].ToString() : "0",
            ["{{Digit2}}"] = otp.Length > 1 ? otp[1].ToString() : "0",
            ["{{Digit3}}"] = otp.Length > 2 ? otp[2].ToString() : "0",
            ["{{Digit4}}"] = otp.Length > 3 ? otp[3].ToString() : "0",
            ["{{Digit5}}"] = otp.Length > 4 ? otp[4].ToString() : "0",
            ["{{Digit6}}"] = otp.Length > 5 ? otp[5].ToString() : "0"
        };

        var body = await ProcessTemplateAsync(template, placeholders);

        var request = new EmailRequest
        {
            ToEmail = email,
            Subject = SD.OtpVerificationSubject,
            Body = body,
            IsHtml = true
        };

        return await SendEmailAsync(request);
    }

    public async Task<bool> SendWelcomeEmailAsync(string email, string firstName, string lastName)
    {
        var subject = SD.WelcomeEmailSubject;
        var body = $@"
        <html>
        <body>
            <h1>Welcome to CommunityCar, {firstName} {lastName}!</h1>
            <p>Thank you for joining our community. Your account has been successfully created and verified.</p>
            <p>You can now:</p>
            <ul>
                <li>Access all features of our platform</li>
                <li>Create and manage your profile</li>
                <li>Connect with other community members</li>
                <li>Share your experiences and knowledge</li>
            </ul>
            <p>If you have any questions, feel free to contact our support team.</p>
            <p>Best regards,<br>The CommunityCar Team</p>
        </body>
        </html>";

        var request = new EmailRequest
        {
            ToEmail = email,
            Subject = subject,
            Body = body,
            IsHtml = true
        };

        return await SendEmailAsync(request);
    }

    public async Task<string> LoadEmailTemplateAsync(string templateName)
    {
        var templatePath = Path.Combine(_environment.ContentRootPath, "Templates", "Email", templateName);

        if (!File.Exists(templatePath))
        {
            throw new FileNotFoundException($"Email template '{templateName}' not found at {templatePath}");
        }

        return await File.ReadAllTextAsync(templatePath);
    }

    public Task<string> ProcessTemplateAsync(string template, Dictionary<string, string> placeholders)
    {
        var result = template;

        foreach (var placeholder in placeholders)
        {
            result = result.Replace(placeholder.Key, placeholder.Value);
        }

        return Task.FromResult(result);
    }
}