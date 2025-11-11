using CommunityCar.Application.DTOs.Chat;
using CommunityCar.Application.Features.Chat.Commands;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CommunityCar.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ChatController : ControllerBase
{
    private readonly IMediator _mediator;

    public ChatController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpPost("send")]
    public async Task<IActionResult> SendMessage([FromBody] SendChatMessageRequest request)
    {
        var command = new SendChatMessageCommand
        {
            SenderId = request.SenderId,
            ReceiverId = request.ReceiverId,
            Message = request.Message,
            MessageType = request.MessageType,
            AttachmentUrl = request.AttachmentUrl,
            ConversationId = request.ConversationId,
            ReplyToMessageId = request.ReplyToMessageId
        };

        var messageId = await _mediator.Send(command);
        return Ok(new { Id = messageId });
    }

    [HttpGet("conversation/{userId1}/{userId2}")]
    public async Task<IActionResult> GetConversation(string userId1, string userId2)
    {
        // This would need a query for conversation
        // For now, return not implemented
        return StatusCode(501, "Not implemented yet");
    }

    [HttpGet("user/{userId}")]
    public async Task<IActionResult> GetUserMessages(string userId, [FromQuery] bool onlyUnread = false)
    {
        // This would need a query for user messages
        // For now, return not implemented
        return StatusCode(501, "Not implemented yet");
    }

    [HttpPut("message/{id}/read")]
    public async Task<IActionResult> MarkMessageAsRead(int id, [FromQuery] string userId)
    {
        // This would need a command for marking message as read
        // For now, return not implemented
        return StatusCode(501, "Not implemented yet");
    }

    [HttpGet("user/{userId}/unread-count")]
    public async Task<IActionResult> GetUnreadCount(string userId)
    {
        // This would need a query for unread count
        // For now, return not implemented
        return StatusCode(501, "Not implemented yet");
    }
}