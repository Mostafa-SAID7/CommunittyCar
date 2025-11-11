using CommunityCar.Application.DTOs.Chat;
using CommunityCar.Application.Interfaces;
using CommunityCar.Domain.Entities;
using CommunityCar.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace CommunityCar.Infrastructure.Services;

public class ChatService : IChatService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IRepository<ChatMessage> _chatMessageRepository;

    public ChatService(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
        _chatMessageRepository = _unitOfWork.Repository<ChatMessage>();
    }

    public async Task<int> SendMessageAsync(SendChatMessageRequest request)
    {
        var message = new ChatMessage
        {
            SenderId = request.SenderId,
            ReceiverId = request.ReceiverId,
            Message = request.Message,
            MessageType = request.MessageType,
            AttachmentUrl = request.AttachmentUrl,
            ConversationId = request.ConversationId ?? $"{request.SenderId}_{request.ReceiverId}",
            ReplyToMessageId = request.ReplyToMessageId
        };

        await _chatMessageRepository.AddAsync(message);
        await _unitOfWork.SaveChangesAsync();

        return message.Id;
    }

    public async Task MarkMessageAsReadAsync(int messageId, string userId)
    {
        var message = await _chatMessageRepository.GetByIdAsync(messageId);
        if (message == null || message.ReceiverId != userId)
            throw new KeyNotFoundException("Message not found or access denied");

        if (!message.IsRead)
        {
            message.IsRead = true;
            message.ReadAt = DateTime.UtcNow;
            message.UpdateTimestamp();

            _chatMessageRepository.Update(message);
            await _unitOfWork.SaveChangesAsync();
        }
    }

    public async Task<IEnumerable<ChatMessageDto>> GetConversationAsync(string userId1, string userId2)
    {
        var messages = await _chatMessageRepository.GetAll()
            .Where(m => !m.IsDeleted &&
                       ((m.SenderId == userId1 && m.ReceiverId == userId2) ||
                        (m.SenderId == userId2 && m.ReceiverId == userId1)))
            .OrderBy(m => m.CreatedAt)
            .Select(m => new ChatMessageDto
            {
                Id = m.Id,
                SenderId = m.SenderId,
                ReceiverId = m.ReceiverId,
                Message = m.Message,
                IsRead = m.IsRead,
                ReadAt = m.ReadAt,
                MessageType = m.MessageType,
                AttachmentUrl = m.AttachmentUrl,
                ConversationId = m.ConversationId,
                ReplyToMessageId = m.ReplyToMessageId,
                CreatedAt = m.CreatedAt
            })
            .ToListAsync();

        return messages;
    }

    public async Task<IEnumerable<ChatMessageDto>> GetUserMessagesAsync(string userId, bool onlyUnread = false)
    {
        var query = _chatMessageRepository.GetAll()
            .Where(m => !m.IsDeleted && m.ReceiverId == userId);

        if (onlyUnread)
            query = query.Where(m => !m.IsRead);

        var messages = await query
            .OrderByDescending(m => m.CreatedAt)
            .Select(m => new ChatMessageDto
            {
                Id = m.Id,
                SenderId = m.SenderId,
                ReceiverId = m.ReceiverId,
                Message = m.Message,
                IsRead = m.IsRead,
                ReadAt = m.ReadAt,
                MessageType = m.MessageType,
                AttachmentUrl = m.AttachmentUrl,
                ConversationId = m.ConversationId,
                ReplyToMessageId = m.ReplyToMessageId,
                CreatedAt = m.CreatedAt
            })
            .ToListAsync();

        return messages;
    }

    public async Task<int> GetUnreadCountAsync(string userId)
    {
        return await _chatMessageRepository.GetAll()
            .CountAsync(m => m.ReceiverId == userId && !m.IsRead && !m.IsDeleted);
    }
}