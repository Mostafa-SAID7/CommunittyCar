using CommunityCar.Application.Services;
using CommunityCar.Domain.Entities.Auth;
using CommunityCar.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace CommunityCar.Application.Services.Auth;

public class SecurityMonitoringService
{
    private readonly ApplicationDbContext _context;
    private readonly AuditService _auditService;

    public SecurityMonitoringService(ApplicationDbContext context, AuditService auditService)
    {
        _context = context;
        _auditService = auditService;
    }

    public async Task<bool> IsSuspiciousActivityAsync(string userId, string ipAddress, string userAgent)
    {
        // Check for multiple failed login attempts
        var recentFailedLogins = await _context.AuditLogs
            .Where(a => a.UserId == userId &&
                       a.Action == "LOGIN_FAILED" &&
                       a.Timestamp > DateTime.UtcNow.AddHours(-1))
            .CountAsync();

        if (recentFailedLogins >= 3)
        {
            await _auditService.LogSuspiciousActivityAsync(
                userId, "Multiple failed login attempts", ipAddress, userAgent);
            return true;
        }

        // Check for unusual login location/time
        var userLogins = await _context.AuditLogs
            .Where(a => a.UserId == userId &&
                       a.Action == "LOGIN_SUCCESS" &&
                       a.Timestamp > DateTime.UtcNow.AddDays(-30))
            .OrderByDescending(a => a.Timestamp)
            .Take(10)
            .ToListAsync();

        // Check if IP address is different from usual locations
        var usualIPs = userLogins.Select(a => a.IpAddress).Distinct().ToList();
        if (!usualIPs.Contains(ipAddress) && usualIPs.Count > 0)
        {
            await _auditService.LogSuspiciousActivityAsync(
                userId, "Login from unusual IP address", ipAddress, userAgent);
            return true;
        }

        // Check for rapid successive logins
        var recentLogins = userLogins.Where(a => a.Timestamp > DateTime.UtcNow.AddMinutes(-5)).ToList();
        if (recentLogins.Count >= 3)
        {
            await _auditService.LogSuspiciousActivityAsync(
                userId, "Rapid successive login attempts", ipAddress, userAgent);
            return true;
        }

        return false;
    }

    public async Task<bool> IsAccountCompromisedAsync(string userId)
    {
        // Check for account lockout
        var user = await _context.Users.FindAsync(userId);
        if (user == null)
            return false;

        if (user.LockoutEndTime > DateTime.UtcNow)
            return true;

        // Check for too many failed attempts
        if (user.FailedLoginAttempts >= 5)
            return true;

        // Check for suspicious patterns in audit logs
        var suspiciousActivities = await _context.AuditLogs
            .Where(a => a.UserId == userId &&
                       !a.IsSuccessful &&
                       a.Timestamp > DateTime.UtcNow.AddHours(-24))
            .CountAsync();

        return suspiciousActivities >= 10;
    }

    public async Task ReportSuspiciousActivityAsync(string userId, string activity, string ipAddress, string userAgent)
    {
        await _auditService.LogSuspiciousActivityAsync(userId, activity, ipAddress, userAgent);

        // In a real application, you might want to:
        // - Send email alerts to administrators
        // - Temporarily lock the account
        // - Require additional verification
        // - Log to external security monitoring systems
    }

    public async Task<IEnumerable<string>> GetSecurityRecommendationsAsync(string userId)
    {
        var recommendations = new List<string>();
        var user = await _context.Users.FindAsync(userId);

        if (user == null)
            return recommendations;

        // Check password age
        if (user.LastPasswordChange < DateTime.UtcNow.AddDays(-90))
        {
            recommendations.Add("Consider changing your password - it's been over 90 days");
        }

        // Check if 2FA is enabled
        if (!user.TwoFactorEnabled)
        {
            recommendations.Add("Enable two-factor authentication for better security");
        }

        // Check if biometric is enabled
        if (!user.IsBiometricEnabled)
        {
            recommendations.Add("Consider enabling biometric authentication");
        }

        // Check recent failed login attempts
        var recentFailedLogins = await _context.AuditLogs
            .CountAsync(a => a.UserId == userId &&
                           a.Action == "LOGIN_FAILED" &&
                           a.Timestamp > DateTime.UtcNow.AddDays(-7));

        if (recentFailedLogins > 0)
        {
            recommendations.Add($"There were {recentFailedLogins} failed login attempts in the last week");
        }

        // Check account verification
        if (!user.EmailVerified)
        {
            recommendations.Add("Verify your email address for account security");
        }

        return recommendations;
    }

    public async Task<SecurityStatus> GetAccountSecurityStatusAsync(string userId)
    {
        var user = await _context.Users.FindAsync(userId);
        if (user == null)
            return new SecurityStatus { OverallScore = 0 };

        var status = new SecurityStatus();
        var score = 0;
        var maxScore = 100;

        // Password strength and age (25 points)
        if (user.LastPasswordChange > DateTime.UtcNow.AddDays(-30))
            score += 25;
        else if (user.LastPasswordChange > DateTime.UtcNow.AddDays(-90))
            score += 15;

        // Two-factor authentication (25 points)
        if (user.TwoFactorEnabled)
            score += 25;

        // Biometric authentication (15 points)
        if (user.IsBiometricEnabled)
            score += 15;

        // Email verification (10 points)
        if (user.EmailVerified)
            score += 10;

        // Account activity (25 points)
        var recentActivity = await _context.AuditLogs
            .CountAsync(a => a.UserId == userId &&
                           a.IsSuccessful &&
                           a.Timestamp > DateTime.UtcNow.AddDays(-30));

        if (recentActivity > 10)
            score += 25;
        else if (recentActivity > 5)
            score += 15;
        else if (recentActivity > 0)
            score += 5;

        status.OverallScore = Math.Min(score, maxScore);
        status.LastAssessment = DateTime.UtcNow;

        return status;
    }
}

public class SecurityStatus
{
    public int OverallScore { get; set; } // 0-100
    public DateTime LastAssessment { get; set; }
    public string RiskLevel => OverallScore >= 80 ? "Low" :
                              OverallScore >= 60 ? "Medium" : "High";
}