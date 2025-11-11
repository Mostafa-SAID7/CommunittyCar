using CommunityCar.Domain.Common;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CommunityCar.Domain.Entities.Community;

public class Forum : BaseEntity
{
    [Required]
    [MaxLength(200)]
    public string Name { get; set; } = string.Empty;

    [Required]
    [MaxLength(1000)]
    public string Description { get; set; } = string.Empty;

    [MaxLength(500)]
    public string? IconUrl { get; set; }

    [Required]
    public bool IsActive { get; set; } = true;

    public int DisplayOrder { get; set; }

    // Navigation properties
    public virtual ICollection<Post> Posts { get; set; } = new List<Post>();
    public virtual ICollection<ForumCategory> Categories { get; set; } = new List<ForumCategory>();
}