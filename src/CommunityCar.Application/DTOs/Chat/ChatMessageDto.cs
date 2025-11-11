using CommunityCar.Application.Mappings;
using CommunityCar.Domain.Entities;

namespace CommunityCar.Application.DTOs.Chat;

public class ChatMessageDto : IMapFrom<ChatMessage>
{
    public int Id { get; set; }
    public string SenderId { get; set; } = string.Empty;
    public string ReceiverId { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public bool IsRead { get; set; }
    public DateTime? ReadAt { get; set; }
    public string? MessageType { get; set; }
    public string? AttachmentUrl { get; set; }
    public string? ConversationId { get; set; }
    public int? ReplyToMessageId { get; set; }
    public DateTime CreatedAt { get; set; }

    public void Mapping(AutoMapper.Profile profile)
    {
        profile.CreateMap<ChatMessage, ChatMessageDto>();
    }
}