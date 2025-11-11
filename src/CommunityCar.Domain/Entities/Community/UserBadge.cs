using CommunityCar.Domain.Common;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CommunityCar.Domain.Entities.Community;

public class UserBadge : BaseEntity
{
    [Required]
    public string UserId { get; set; } = string.Empty;

    [ForeignKey("UserId")]
    public virtual User User { get; set; } = null!;

    [Required]
    public int BadgeId { get; set; }

    [ForeignKey("BadgeId")]
    public virtual Badge Badge { get; set; } = null!;

    [Required]
    public DateTime EarnedAt { get; set; } = DateTime.UtcNow;

    [MaxLength(500)]
    public string? EarnedReason { get; set; }

    public bool IsDisplayed { get; set; } = true;
}