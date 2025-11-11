using CommunityCar.Domain.Common;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CommunityCar.Domain.Entities.Community;

public class Message : BaseEntity
{
    [Required]
    public string SenderId { get; set; } = string.Empty;

    [ForeignKey("SenderId")]
    public virtual User Sender { get; set; } = null!;

    [Required]
    public int ConversationId { get; set; }

    [ForeignKey("ConversationId")]
    public virtual Conversation Conversation { get; set; } = null!;

    [Required]
    [MaxLength(2000)]
    public string Content { get; set; } = string.Empty;

    [MaxLength(50)]
    public string? MessageType { get; set; } = "Text"; // Text, Image, File, etc.

    [MaxLength(500)]
    public string? AttachmentUrl { get; set; }

    public int? ReplyToMessageId { get; set; }

    [ForeignKey("ReplyToMessageId")]
    public virtual Message? ReplyToMessage { get; set; }

    public bool IsEdited { get; set; } = false;

    public DateTime? EditedAt { get; set; }

    // Moderation
    public bool IsApproved { get; set; } = true;

    public string? ModerationReason { get; set; }

    // Navigation properties
    public virtual ICollection<Message> Replies { get; set; } = new List<Message>();
}