using CommunityCar.Domain.Common;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CommunityCar.Domain.Entities.Community;

public class EventAttendee : BaseEntity
{
    [Required]
    public int EventId { get; set; }

    [ForeignKey("EventId")]
    public virtual GroupEvent Event { get; set; } = null!;

    [Required]
    public string UserId { get; set; } = string.Empty;

    [ForeignKey("UserId")]
    public virtual User User { get; set; } = null!;

    [Required]
    public AttendeeStatus Status { get; set; } = AttendeeStatus.Interested;

    public DateTime? RespondedAt { get; set; }
}

public enum AttendeeStatus
{
    Interested = 1,
    Going = 2,
    NotGoing = 3,
    Maybe = 4
}