using System.ComponentModel.DataAnnotations;

namespace CommunityCar.Application.DTOs.Notifications;

public class CreateNotificationRequest
{
    [Required]
    public string UserId { get; set; } = string.Empty;

    [Required]
    [MaxLength(200)]
    public string Title { get; set; } = string.Empty;

    [Required]
    [MaxLength(1000)]
    public string Message { get; set; } = string.Empty;

    [Required]
    [MaxLength(50)]
    public string Type { get; set; } = "Info";

    [MaxLength(500)]
    public string? ActionUrl { get; set; }

    [MaxLength(100)]
    public string? RelatedEntityType { get; set; }

    [MaxLength(50)]
    public string? RelatedEntityId { get; set; }
}