using CommunityCar.Domain.Common;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CommunityCar.Domain.Entities;

public class Notification : BaseEntity
{
    [Required]
    public string UserId { get; set; } = string.Empty;

    [ForeignKey("UserId")]
    public virtual User User { get; set; } = null!;

    [Required]
    [MaxLength(200)]
    public string Title { get; set; } = string.Empty;

    [Required]
    [MaxLength(1000)]
    public string Message { get; set; } = string.Empty;

    [Required]
    [MaxLength(50)]
    public string Type { get; set; } = string.Empty; // e.g., "Info", "Warning", "Error", "Success"

    public bool IsRead { get; set; } = false;

    public DateTime? ReadAt { get; set; }

    [MaxLength(500)]
    public string? ActionUrl { get; set; }

    [MaxLength(100)]
    public string? RelatedEntityType { get; set; } // e.g., "Booking", "Car", "User"

    [MaxLength(50)]
    public string? RelatedEntityId { get; set; }
}