using CommunityCar.Application.DTOs.Notifications;
using MediatR;

namespace CommunityCar.Application.Features.Notifications.Queries;

public class GetUserNotificationsQuery : IRequest<IEnumerable<NotificationDto>>
{
    public string UserId { get; set; } = string.Empty;
    public bool OnlyUnread { get; set; } = false;
}