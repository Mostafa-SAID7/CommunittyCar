using CommunityCar.Application.DTOs.Notifications;

namespace CommunityCar.Application.Interfaces;

public interface INotificationService
{
    Task<int> CreateNotificationAsync(CreateNotificationRequest request);
    Task MarkAsReadAsync(int notificationId, string userId);
    Task<IEnumerable<NotificationDto>> GetUserNotificationsAsync(string userId, bool onlyUnread = false);
    Task<int> GetUnreadCountAsync(string userId);
    Task DeleteNotificationAsync(int notificationId, string userId);
}