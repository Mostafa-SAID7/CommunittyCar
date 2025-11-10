using CommunityCar.Application.Services;
using Microsoft.Extensions.Configuration;
using System.Net;
using System.Net.Mail;

namespace CommunityCar.Application.Services.Auth;

public class EmailService
{
    private readonly IConfiguration _configuration;

    public EmailService(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public async Task<bool> SendEmailAsync(string toEmail, string subject, string body, bool isHtml = false)
    {
        try
        {
            var smtpSettings = _configuration.GetSection("Email");

            using var client = new SmtpClient(smtpSettings["SmtpServer"], int.Parse(smtpSettings["Port"]!))
            {
                Credentials = new NetworkCredential(smtpSettings["Username"], smtpSettings["Password"]),
                EnableSsl = true
            };

            var mailMessage = new MailMessage
            {
                From = new MailAddress(smtpSettings["FromEmail"]!, smtpSettings["FromName"]),
                Subject = subject,
                Body = body,
                IsBodyHtml = isHtml
            };

            mailMessage.To.Add(toEmail);

            await client.SendMailAsync(mailMessage);
            return true;
        }
        catch (Exception)
        {
            // Log the exception in a real application
            return false;
        }
    }

    public async Task<bool> SendOtpEmailAsync(string email, string otpCode)
    {
        var subject = "Your OTP Code - CommunityCar";
        var body = $@"
            <div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;'>
                <h2 style='color: #333;'>Your One-Time Password</h2>
                <p>Hello,</p>
                <p>Your OTP code for CommunityCar is:</p>
                <div style='background-color: #f8f9fa; padding: 20px; text-align: center; margin: 20px 0;'>
                    <span style='font-size: 24px; font-weight: bold; color: #007bff;'>{otpCode}</span>
                </div>
                <p>This code will expire in 5 minutes.</p>
                <p>If you didn't request this code, please ignore this email.</p>
                <hr>
                <p style='color: #666; font-size: 12px;'>CommunityCar - Secure Authentication</p>
            </div>";

        return await SendEmailAsync(email, subject, body, true);
    }

    public async Task<bool> SendPasswordResetEmailAsync(string email, string resetToken)
    {
        var resetUrl = $"{_configuration["AppUrl"]}/reset-password?token={resetToken}";
        var subject = "Password Reset - CommunityCar";
        var body = $@"
            <div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;'>
                <h2 style='color: #333;'>Password Reset Request</h2>
                <p>Hello,</p>
                <p>You requested a password reset for your CommunityCar account.</p>
                <p>Click the button below to reset your password:</p>
                <div style='text-align: center; margin: 30px 0;'>
                    <a href='{resetUrl}' style='background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;'>Reset Password</a>
                </div>
                <p>If the button doesn't work, copy and paste this URL into your browser:</p>
                <p style='word-break: break-all; color: #666;'>{resetUrl}</p>
                <p>This link will expire in 24 hours.</p>
                <p>If you didn't request this reset, please ignore this email.</p>
                <hr>
                <p style='color: #666; font-size: 12px;'>CommunityCar - Secure Authentication</p>
            </div>";

        return await SendEmailAsync(email, subject, body, true);
    }

    public async Task<bool> SendEmailVerificationAsync(string email, string verificationToken)
    {
        var verificationUrl = $"{_configuration["AppUrl"]}/verify-email?token={verificationToken}";
        var subject = "Verify Your Email - CommunityCar";
        var body = $@"
            <div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;'>
                <h2 style='color: #333;'>Welcome to CommunityCar!</h2>
                <p>Thank you for registering. Please verify your email address to complete your registration.</p>
                <div style='text-align: center; margin: 30px 0;'>
                    <a href='{verificationUrl}' style='background-color: #28a745; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;'>Verify Email</a>
                </div>
                <p>If the button doesn't work, copy and paste this URL into your browser:</p>
                <p style='word-break: break-all; color: #666;'>{verificationUrl}</p>
                <p>This link will expire in 24 hours.</p>
                <hr>
                <p style='color: #666; font-size: 12px;'>CommunityCar - Secure Authentication</p>
            </div>";

        return await SendEmailAsync(email, subject, body, true);
    }
}