using CommunityCar.Domain.Common;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CommunityCar.Domain.Entities.Community;

public class ConversationParticipant : BaseEntity
{
    [Required]
    public int ConversationId { get; set; }

    [ForeignKey("ConversationId")]
    public virtual Conversation Conversation { get; set; } = null!;

    [Required]
    public string UserId { get; set; } = string.Empty;

    [ForeignKey("UserId")]
    public virtual User User { get; set; } = null!;

    [Required]
    public ParticipantRole Role { get; set; } = ParticipantRole.Member;

    [Required]
    public ParticipantStatus Status { get; set; } = ParticipantStatus.Active;

    public DateTime? JoinedAt { get; set; }

    public DateTime? LastReadAt { get; set; }

    public int UnreadCount { get; set; } = 0;

    public bool IsMuted { get; set; } = false;
}

public enum ParticipantRole
{
    Owner = 1,
    Admin = 2,
    Member = 3
}

public enum ParticipantStatus
{
    Active = 1,
    Left = 2,
    Banned = 3
}