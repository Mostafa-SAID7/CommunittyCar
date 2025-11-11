using CommunityCar.Domain.Common;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CommunityCar.Domain.Entities.Community;

public class ModerationReport : BaseEntity
{
    [Required]
    public string ReporterId { get; set; } = string.Empty;

    [ForeignKey("ReporterId")]
    public virtual User Reporter { get; set; } = null!;

    [Required]
    public string ReportedUserId { get; set; } = string.Empty;

    [ForeignKey("ReportedUserId")]
    public virtual User ReportedUser { get; set; } = null!;

    [Required]
    public ReportType Type { get; set; }

    [Required]
    public ContentType ContentType { get; set; }

    [Required]
    public int ContentId { get; set; }

    [Required]
    [MaxLength(1000)]
    public string Reason { get; set; } = string.Empty;

    [MaxLength(500)]
    public string? AdditionalInfo { get; set; }

    [Required]
    public ReportStatus Status { get; set; } = ReportStatus.Pending;

    public string? ModeratorId { get; set; }

    [ForeignKey("ModeratorId")]
    public virtual User? Moderator { get; set; }

    [MaxLength(500)]
    public string? ModeratorNotes { get; set; }

    public DateTime? ResolvedAt { get; set; }

    [Required]
    public ModerationAction ActionTaken { get; set; } = ModerationAction.None;
}

public enum ReportType
{
    Spam = 1,
    Harassment = 2,
    Inappropriate = 3,
    Copyright = 4,
    Other = 5
}

public enum ContentType
{
    Post = 1,
    Comment = 2,
    Message = 3,
    User = 4,
    Group = 5
}

public enum ReportStatus
{
    Pending = 1,
    UnderReview = 2,
    Resolved = 3,
    Dismissed = 4
}

public enum ModerationAction
{
    None = 0,
    Warning = 1,
    ContentRemoved = 2,
    UserSuspended = 3,
    UserBanned = 4
}