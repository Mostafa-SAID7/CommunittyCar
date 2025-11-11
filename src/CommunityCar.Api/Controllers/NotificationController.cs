using CommunityCar.Application.DTOs.Notifications;
using CommunityCar.Application.Features.Notifications.Commands;
using CommunityCar.Application.Features.Notifications.Queries;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CommunityCar.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class NotificationController : ControllerBase
{
    private readonly IMediator _mediator;

    public NotificationController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpPost]
    public async Task<IActionResult> CreateNotification([FromBody] CreateNotificationRequest request)
    {
        var command = new CreateNotificationCommand
        {
            UserId = request.UserId,
            Title = request.Title,
            Message = request.Message,
            Type = request.Type,
            ActionUrl = request.ActionUrl,
            RelatedEntityType = request.RelatedEntityType,
            RelatedEntityId = request.RelatedEntityId
        };

        var notificationId = await _mediator.Send(command);
        return Ok(new { Id = notificationId });
    }

    [HttpGet("user/{userId}")]
    public async Task<IActionResult> GetUserNotifications(string userId, [FromQuery] bool onlyUnread = false)
    {
        var query = new GetUserNotificationsQuery
        {
            UserId = userId,
            OnlyUnread = onlyUnread
        };

        var notifications = await _mediator.Send(query);
        return Ok(notifications);
    }

    [HttpPut("{id}/read")]
    public async Task<IActionResult> MarkAsRead(int id, [FromQuery] string userId)
    {
        // This would need a command for marking as read
        // For now, return not implemented
        return StatusCode(501, "Not implemented yet");
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteNotification(int id, [FromQuery] string userId)
    {
        // This would need a command for deleting
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