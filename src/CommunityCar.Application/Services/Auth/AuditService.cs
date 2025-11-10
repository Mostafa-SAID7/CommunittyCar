using CommunityCar.Domain.Entities.Auth;
using CommunityCar.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace CommunityCar.Application.Services.Auth;

public class AuditService
{
    private readonly ApplicationDbContext _context;

    public AuditService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task LogSecurityEventAsync(
        string userId,
        string action,
        string entityType,
        string entityId,
        string ipAddress,
        string userAgent,
        bool isSuccessful = true,
        string? errorMessage = null,
        string? oldValues = null,
        string? newValues = null)
    {
        var auditLog = new AuditLog
        {
            UserId = userId,
            Action = action,
            EntityType = entityType,
            EntityId = entityId,
            IpAddress = ipAddress,
            UserAgent = userAgent,
            IsSuccessful = isSuccessful,
            ErrorMessage = errorMessage,
            OldValues = oldValues,
            NewValues = newValues,
            Timestamp = DateTime.UtcNow
        };

        _context.AuditLogs.Add(auditLog);
        await _context.SaveChangesAsync();
    }

    public async Task LogLoginAttemptAsync(string userId, string ipAddress, string userAgent, bool isSuccessful, string? errorMessage = null)
    {
        await LogSecurityEventAsync(
            userId: userId,
            action: isSuccessful ? "LOGIN_SUCCESS" : "LOGIN_FAILED",
            entityType: "User",
            entityId: userId,
            ipAddress: ipAddress,
            userAgent: userAgent,
            isSuccessful: isSuccessful,
            errorMessage: errorMessage);
    }

    public async Task LogPasswordChangeAsync(string userId, string ipAddress, string userAgent)
    {
        await LogSecurityEventAsync(
            userId: userId,
            action: "PASSWORD_CHANGED",
            entityType: "User",
            entityId: userId,
            ipAddress: ipAddress,
            userAgent: userAgent);
    }

    public async Task LogTwoFactorEnabledAsync(string userId, string ipAddress, string userAgent)
    {
        await LogSecurityEventAsync(
            userId: userId,
            action: "TWO_FACTOR_ENABLED",
            entityType: "User",
            entityId: userId,
            ipAddress: ipAddress,
            userAgent: userAgent);
    }

    public async Task LogSuspiciousActivityAsync(string userId, string activity, string ipAddress, string userAgent)
    {
        await LogSecurityEventAsync(
            userId: userId,
            action: "SUSPICIOUS_ACTIVITY",
            entityType: "Security",
            entityId: Guid.NewGuid().ToString(),
            ipAddress: ipAddress,
            userAgent: userAgent,
            isSuccessful: false,
            errorMessage: activity);
    }

    public async Task<IEnumerable<AuditLog>> GetUserActivityAsync(string userId, DateTime? fromDate = null, DateTime? toDate = null)
    {
        var query = _context.AuditLogs.Where(a => a.UserId == userId);

        if (fromDate.HasValue)
            query = query.Where(a => a.Timestamp >= fromDate.Value);

        if (toDate.HasValue)
            query = query.Where(a => a.Timestamp <= toDate.Value);

        return await query.OrderByDescending(a => a.Timestamp).ToListAsync();
    }

    public async Task<IEnumerable<AuditLog>> GetSecurityEventsAsync(DateTime? fromDate = null, DateTime? toDate = null)
    {
        var query = _context.AuditLogs.AsQueryable();

        if (fromDate.HasValue)
            query = query.Where(a => a.Timestamp >= fromDate.Value);

        if (toDate.HasValue)
            query = query.Where(a => a.Timestamp <= toDate.Value);

        return await query
            .Where(a => !a.IsSuccessful || a.Action.Contains("SUSPICIOUS"))
            .OrderByDescending(a => a.Timestamp)
            .ToListAsync();
    }
}