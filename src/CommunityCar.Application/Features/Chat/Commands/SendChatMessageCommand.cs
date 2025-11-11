using MediatR;

namespace CommunityCar.Application.Features.Chat.Commands;

public class SendChatMessageCommand : IRequest<int>
{
    public string SenderId { get; set; } = string.Empty;
    public string ReceiverId { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public string? MessageType { get; set; } = "Text";
    public string? AttachmentUrl { get; set; }
    public string? ConversationId { get; set; }
    public int? ReplyToMessageId { get; set; }
}