using CommunityCar.Domain.Common;

namespace CommunityCar.Domain.Entities.Auth;

public class ApiKey : BaseEntity
{
    public string UserId { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Key { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public DateTime ExpiresAt { get; set; }
    public bool IsActive { get; set; } = true;
    public DateTime? LastUsedAt { get; set; }
    public int UsageCount { get; set; } = 0;
    public DateTime? RevokedAt { get; set; }
    public string? CreatedByIp { get; set; }
    public string? LastUsedByIp { get; set; }

    // Navigation properties
    public User? User { get; set; }
}