using CommunityCar.Application.DTOs.Notifications;
using CommunityCar.Application.Interfaces;
using CommunityCar.Domain.Entities;
using CommunityCar.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace CommunityCar.Infrastructure.Services;

public class NotificationService : INotificationService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IRepository<Notification> _notificationRepository;

    public NotificationService(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
        _notificationRepository = _unitOfWork.Repository<Notification>();
    }

    public async Task<int> CreateNotificationAsync(CreateNotificationRequest request)
    {
        var notification = new Notification
        {
            UserId = request.UserId,
            Title = request.Title,
            Message = request.Message,
            Type = request.Type,
            ActionUrl = request.ActionUrl,
            RelatedEntityType = request.RelatedEntityType,
            RelatedEntityId = request.RelatedEntityId
        };

        await _notificationRepository.AddAsync(notification);
        await _unitOfWork.SaveChangesAsync();

        return notification.Id;
    }

    public async Task MarkAsReadAsync(int notificationId, string userId)
    {
        var notification = await _notificationRepository.GetByIdAsync(notificationId);
        if (notification == null || notification.UserId != userId)
            throw new KeyNotFoundException("Notification not found or access denied");

        if (!notification.IsRead)
        {
            notification.IsRead = true;
            notification.ReadAt = DateTime.UtcNow;
            notification.UpdateTimestamp();

            _notificationRepository.Update(notification);
            await _unitOfWork.SaveChangesAsync();
        }
    }

    public async Task<IEnumerable<NotificationDto>> GetUserNotificationsAsync(string userId, bool onlyUnread = false)
    {
        var query = _notificationRepository.GetAll()
            .Where(n => n.UserId == userId && !n.IsDeleted);

        if (onlyUnread)
            query = query.Where(n => !n.IsRead);

        var notifications = await query
            .OrderByDescending(n => n.CreatedAt)
            .Select(n => new NotificationDto
            {
                Id = n.Id,
                UserId = n.UserId,
                Title = n.Title,
                Message = n.Message,
                Type = n.Type,
                IsRead = n.IsRead,
                ReadAt = n.ReadAt,
                ActionUrl = n.ActionUrl,
                RelatedEntityType = n.RelatedEntityType,
                RelatedEntityId = n.RelatedEntityId,
                CreatedAt = n.CreatedAt
            })
            .ToListAsync();

        return notifications;
    }

    public async Task<int> GetUnreadCountAsync(string userId)
    {
        return await _notificationRepository.GetAll()
            .CountAsync(n => n.UserId == userId && !n.IsRead && !n.IsDeleted);
    }

    public async Task DeleteNotificationAsync(int notificationId, string userId)
    {
        var notification = await _notificationRepository.GetByIdAsync(notificationId);
        if (notification == null || notification.UserId != userId)
            throw new KeyNotFoundException("Notification not found or access denied");

        notification.SoftDelete();
        _notificationRepository.Update(notification);
        await _unitOfWork.SaveChangesAsync();
    }
}