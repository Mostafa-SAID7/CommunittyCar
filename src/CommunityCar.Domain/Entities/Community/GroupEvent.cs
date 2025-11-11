using CommunityCar.Domain.Common;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CommunityCar.Domain.Entities.Community;

public class GroupEvent : BaseEntity
{
    [Required]
    public int GroupId { get; set; }

    [ForeignKey("GroupId")]
    public virtual Group Group { get; set; } = null!;

    [Required]
    [MaxLength(200)]
    public string Title { get; set; } = string.Empty;

    [MaxLength(1000)]
    public string? Description { get; set; }

    [Required]
    public string OrganizerId { get; set; } = string.Empty;

    [ForeignKey("OrganizerId")]
    public virtual User Organizer { get; set; } = null!;

    [Required]
    public DateTime StartDate { get; set; }

    [Required]
    public DateTime EndDate { get; set; }

    [MaxLength(200)]
    public string? Location { get; set; }

    public bool IsVirtual { get; set; } = false;

    [MaxLength(500)]
    public string? VirtualLink { get; set; }

    [Required]
    public int MaxAttendees { get; set; } = 50;

    public int CurrentAttendees { get; set; } = 0;

    [Required]
    public EventStatus Status { get; set; } = EventStatus.Draft;

    // Navigation properties
    public virtual ICollection<EventAttendee> Attendees { get; set; } = new List<EventAttendee>();
}

public enum EventStatus
{
    Draft = 1,
    Published = 2,
    Cancelled = 3,
    Completed = 4
}