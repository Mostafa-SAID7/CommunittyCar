using CommunityCar.Domain.Common;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CommunityCar.Domain.Entities.Community;

public class PostTag : BaseEntity
{
    [Required]
    public int PostId { get; set; }

    [ForeignKey("PostId")]
    public virtual Post Post { get; set; } = null!;

    [Required]
    public int TagId { get; set; }

    [ForeignKey("TagId")]
    public virtual Tag Tag { get; set; } = null!;
}