using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using CommunityCar.Domain.Entities.Auth;

namespace CommunityCar.Domain.Common;

[Table("AuditLogs")]
public class AuditLog : BaseEntity
{
    [Required]
    [MaxLength(100)]
    public string TableName { get; set; } = string.Empty;

    [Required]
    [MaxLength(10)]
    public string Action { get; set; } = string.Empty; // INSERT, UPDATE, DELETE

    [Required]
    [MaxLength(50)]
    public string EntityId { get; set; } = string.Empty;

    [Required]
    [MaxLength(200)]
    public string EntityType { get; set; } = string.Empty;

    [MaxLength(450)]
    public string? UserId { get; set; }

    [MaxLength(256)]
    public string? UserName { get; set; }

    [MaxLength(45)]
    public string? IpAddress { get; set; }

    [MaxLength(500)]
    public string? UserAgent { get; set; }

    public string? OldValues { get; set; } // JSON serialized

    public string? NewValues { get; set; } // JSON serialized

    public string? ChangedColumns { get; set; } // JSON serialized array

    [MaxLength(1000)]
    public string? ChangeReason { get; set; }

    // Navigation property for related entity if needed
    public string? RelatedEntityId { get; set; }

    public string? RelatedEntityType { get; set; }

    // Navigation property
    public virtual User? User { get; set; }
}