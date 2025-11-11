using CommunityCar.Domain.Common;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CommunityCar.Domain.Entities.Community;

public class GroupMember : BaseEntity
{
    [Required]
    public int GroupId { get; set; }

    [ForeignKey("GroupId")]
    public virtual Group Group { get; set; } = null!;

    [Required]
    public string UserId { get; set; } = string.Empty;

    [ForeignKey("UserId")]
    public virtual User User { get; set; } = null!;

    [Required]
    public GroupMemberRole Role { get; set; } = GroupMemberRole.Member;

    [Required]
    public GroupMemberStatus Status { get; set; } = GroupMemberStatus.Active;

    public DateTime? JoinedAt { get; set; }

    public string? InvitedById { get; set; }

    [ForeignKey("InvitedById")]
    public virtual User? InvitedBy { get; set; }
}

public enum GroupMemberRole
{
    Owner = 1,
    Admin = 2,
    Moderator = 3,
    Member = 4
}

public enum GroupMemberStatus
{
    Pending = 1,    // Waiting for approval
    Active = 2,     // Active member
    Suspended = 3,  // Temporarily suspended
    Banned = 4,     // Permanently banned
    Left = 5        // Voluntarily left
}