using CommunityCar.Domain.Common;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CommunityCar.Domain.Entities.Community;

public class Conversation : BaseEntity
{
    [Required]
    [MaxLength(200)]
    public string Title { get; set; } = string.Empty;

    [MaxLength(500)]
    public string? Description { get; set; }

    [Required]
    public ConversationType Type { get; set; } = ConversationType.Direct;

    public int? GroupId { get; set; } // For group conversations

    [ForeignKey("GroupId")]
    public virtual Group? Group { get; set; }

    public bool IsActive { get; set; } = true;

    public int MessageCount { get; set; } = 0;

    public DateTime? LastMessageAt { get; set; }

    public string? LastMessagePreview { get; set; }

    // Navigation properties
    public virtual ICollection<ConversationParticipant> Participants { get; set; } = new List<ConversationParticipant>();
    public virtual ICollection<Message> Messages { get; set; } = new List<Message>();
}

public enum ConversationType
{
    Direct = 1,     // 1-on-1 conversation
    Group = 2,      // Group conversation
    Channel = 3     // Public channel
}