using CommunityCar.Domain.Common;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CommunityCar.Domain.Entities.Community;

public class Group : BaseEntity
{
    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(500)]
    public string? Description { get; set; }

    [Required]
    public string OwnerId { get; set; } = string.Empty;

    [ForeignKey("OwnerId")]
    public virtual User Owner { get; set; } = null!;

    [MaxLength(500)]
    public string? CoverImageUrl { get; set; }

    [Required]
    public GroupPrivacy Privacy { get; set; } = GroupPrivacy.Public;

    [Required]
    public bool IsActive { get; set; } = true;

    public int MemberCount { get; set; } = 1; // Owner is first member

    public int PostCount { get; set; } = 0;

    public DateTime? LastActivityAt { get; set; }

    // Navigation properties
    public virtual ICollection<GroupMember> Members { get; set; } = new List<GroupMember>();
    public virtual ICollection<Post> Posts { get; set; } = new List<Post>();
    public virtual ICollection<GroupEvent> Events { get; set; } = new List<GroupEvent>();
}

public enum GroupPrivacy
{
    Public = 1,
    Private = 2,
    InviteOnly = 3
}