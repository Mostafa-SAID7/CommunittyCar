using CommunityCar.Application.Mappings;
using CommunityCar.Domain.Entities;

namespace CommunityCar.Application.DTOs.Notifications;

public class NotificationDto : IMapFrom<Notification>
{
    public int Id { get; set; }
    public string UserId { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public bool IsRead { get; set; }
    public DateTime? ReadAt { get; set; }
    public string? ActionUrl { get; set; }
    public string? RelatedEntityType { get; set; }
    public string? RelatedEntityId { get; set; }
    public DateTime CreatedAt { get; set; }

    public void Mapping(AutoMapper.Profile profile)
    {
        profile.CreateMap<Notification, NotificationDto>();
    }
}