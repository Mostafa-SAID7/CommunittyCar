using System.ComponentModel.DataAnnotations;

namespace CommunityCar.Application.DTOs.Chat;

public class SendChatMessageRequest
{
    [Required]
    public string SenderId { get; set; } = string.Empty;

    [Required]
    public string ReceiverId { get; set; } = string.Empty;

    [Required]
    [MaxLength(2000)]
    public string Message { get; set; } = string.Empty;

    [MaxLength(50)]
    public string? MessageType { get; set; } = "Text";

    [MaxLength(500)]
    public string? AttachmentUrl { get; set; }

    [MaxLength(100)]
    public string? ConversationId { get; set; }

    public int? ReplyToMessageId { get; set; }
}