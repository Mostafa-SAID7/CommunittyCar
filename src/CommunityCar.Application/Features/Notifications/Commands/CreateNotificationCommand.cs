using MediatR;

namespace CommunityCar.Application.Features.Notifications.Commands;

public class CreateNotificationCommand : IRequest<int>
{
    public string UserId { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public string Type { get; set; } = "Info";
    public string? ActionUrl { get; set; }
    public string? RelatedEntityType { get; set; }
    public string? RelatedEntityId { get; set; }
}