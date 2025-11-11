using CommunityCar.Domain.Common;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CommunityCar.Domain.Entities;

public class ChatMessage : BaseEntity
{
    [Required]
    public string SenderId { get; set; } = string.Empty;

    [ForeignKey("SenderId")]
    public virtual User Sender { get; set; } = null!;

    [Required]
    public string ReceiverId { get; set; } = string.Empty;

    [ForeignKey("ReceiverId")]
    public virtual User Receiver { get; set; } = null!;

    [Required]
    [MaxLength(2000)]
    public string Message { get; set; } = string.Empty;

    public bool IsRead { get; set; } = false;

    public DateTime? ReadAt { get; set; }

    [MaxLength(50)]
    public string? MessageType { get; set; } = "Text"; // Text, Image, File, etc.

    [MaxLength(500)]
    public string? AttachmentUrl { get; set; }

    // For grouping messages in conversations
    [MaxLength(100)]
    public string? ConversationId { get; set; }

    // For replies
    public int? ReplyToMessageId { get; set; }

    [ForeignKey("ReplyToMessageId")]
    public virtual ChatMessage? ReplyToMessage { get; set; }
}