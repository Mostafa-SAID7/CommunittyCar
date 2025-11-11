using CommunityCar.Domain.Common;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CommunityCar.Domain.Entities.Community;

public class ForumCategory : BaseEntity
{
    [Required]
    public int ForumId { get; set; }

    [ForeignKey("ForumId")]
    public virtual Forum Forum { get; set; } = null!;

    [Required]
    [MaxLength(150)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(500)]
    public string? Description { get; set; }

    [Required]
    public bool IsActive { get; set; } = true;

    public int DisplayOrder { get; set; }

    // Navigation properties
    public virtual ICollection<Post> Posts { get; set; } = new List<Post>();
}