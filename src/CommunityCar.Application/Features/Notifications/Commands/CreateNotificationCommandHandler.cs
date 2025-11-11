using CommunityCar.Application.DTOs.Notifications;
using CommunityCar.Application.Interfaces;
using MediatR;

namespace CommunityCar.Application.Features.Notifications.Commands;

public class CreateNotificationCommandHandler : IRequestHandler<CreateNotificationCommand, int>
{
    private readonly INotificationService _notificationService;

    public CreateNotificationCommandHandler(INotificationService notificationService)
    {
        _notificationService = notificationService;
    }

    public async Task<int> Handle(CreateNotificationCommand request, CancellationToken cancellationToken)
    {
        var createRequest = new CreateNotificationRequest
        {
            UserId = request.UserId,
            Title = request.Title,
            Message = request.Message,
            Type = request.Type,
            ActionUrl = request.ActionUrl,
            RelatedEntityType = request.RelatedEntityType,
            RelatedEntityId = request.RelatedEntityId
        };

        return await _notificationService.CreateNotificationAsync(createRequest);
    }
}