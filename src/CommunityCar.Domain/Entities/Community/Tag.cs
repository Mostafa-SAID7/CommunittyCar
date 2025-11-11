using CommunityCar.Domain.Common;
using System.ComponentModel.DataAnnotations;

namespace CommunityCar.Domain.Entities.Community;

public class Tag : BaseEntity
{
    [Required]
    [MaxLength(50)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(200)]
    public string? Description { get; set; }

    [Required]
    public int UsageCount { get; set; } = 0;

    public bool IsApproved { get; set; } = true;

    // Navigation properties
    public virtual ICollection<PostTag> PostTags { get; set; } = new List<PostTag>();
}