using CommunityCar.Domain.Common;
using System.ComponentModel.DataAnnotations;

namespace CommunityCar.Domain.Entities.Community;

public class Badge : BaseEntity
{
    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(500)]
    public string? Description { get; set; }

    [MaxLength(200)]
    public string? IconUrl { get; set; }

    [Required]
    public BadgeType Type { get; set; }

    [Required]
    public BadgeRarity Rarity { get; set; } = BadgeRarity.Common;

    [Required]
    public int PointsValue { get; set; } = 0;

    [Required]
    public bool IsActive { get; set; } = true;

    // Criteria for earning the badge
    [MaxLength(1000)]
    public string? Criteria { get; set; }

    // Navigation properties
    public virtual ICollection<UserBadge> UserBadges { get; set; } = new List<UserBadge>();
}

public enum BadgeType
{
    Achievement = 1,
    Participation = 2,
    Moderation = 3,
    Special = 4
}

public enum BadgeRarity
{
    Common = 1,
    Uncommon = 2,
    Rare = 3,
    Epic = 4,
    Legendary = 5
}