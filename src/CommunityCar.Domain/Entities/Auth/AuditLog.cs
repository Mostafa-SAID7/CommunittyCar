using CommunityCar.Domain.Common;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CommunityCar.Domain.Entities.Auth;

[Table("AuditLogs")]
public class AuditLog : BaseEntity
{
    [Required]
    [MaxLength(450)]
    public string? UserId { get; set; }

    [Required]
    [MaxLength(10)]
    public string Action { get; set; } = string.Empty; // INSERT, UPDATE, DELETE

    [Required]
    [MaxLength(200)]
    public string EntityType { get; set; } = string.Empty;

    [Required]
    [MaxLength(50)]
    public string EntityId { get; set; } = string.Empty;

    public string? OldValues { get; set; } // JSON serialized

    public string? NewValues { get; set; } // JSON serialized

    public string? ChangedColumns { get; set; } // JSON serialized array

    [MaxLength(45)]
    public string? IpAddress { get; set; }

    [MaxLength(500)]
    public string? UserAgent { get; set; }

    [MaxLength(256)]
    public string? UserName { get; set; }

    public bool IsSuccessful { get; set; } = true;

    [MaxLength(1000)]
    public string? ErrorMessage { get; set; }

    [MaxLength(1000)]
    public string? ChangeReason { get; set; }

    public DateTime Timestamp { get; set; } = DateTime.UtcNow;

    // Navigation property
    public virtual User? User { get; set; }
}