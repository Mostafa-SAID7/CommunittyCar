using CommunityCar.Application.DTOs.Chat;
using CommunityCar.Application.Interfaces;
using MediatR;

namespace CommunityCar.Application.Features.Chat.Commands;

public class SendChatMessageCommandHandler : IRequestHandler<SendChatMessageCommand, int>
{
    private readonly IChatService _chatService;

    public SendChatMessageCommandHandler(IChatService chatService)
    {
        _chatService = chatService;
    }

    public async Task<int> Handle(SendChatMessageCommand request, CancellationToken cancellationToken)
    {
        var sendRequest = new SendChatMessageRequest
        {
            SenderId = request.SenderId,
            ReceiverId = request.ReceiverId,
            Message = request.Message,
            MessageType = request.MessageType,
            AttachmentUrl = request.AttachmentUrl,
            ConversationId = request.ConversationId,
            ReplyToMessageId = request.ReplyToMessageId
        };

        return await _chatService.SendMessageAsync(sendRequest);
    }
}