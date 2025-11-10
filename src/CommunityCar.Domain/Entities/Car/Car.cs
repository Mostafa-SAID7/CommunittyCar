using CommunityCar.Domain.Common;
using CommunityCar.Domain.Entities.Auth;
using CommunityCar.Domain.Entities.Booking;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CommunityCar.Domain.Entities.Car;

[Table("Cars")]
public class Car : BaseEntity
{
    [Required]
    [MaxLength(100)]
    public string Make { get; set; } = string.Empty;

    [Required]
    [MaxLength(100)]
    public string Model { get; set; } = string.Empty;

    [Required]
    public int Year { get; set; }

    [Required]
    [MaxLength(50)]
    public string Color { get; set; } = string.Empty;

    [Required]
    [MaxLength(20)]
    public string LicensePlate { get; set; } = string.Empty;

    [MaxLength(500)]
    public string? Description { get; set; }

    [Required]
    public decimal DailyRate { get; set; }

    [Required]
    public bool IsAvailable { get; set; } = true;

    [MaxLength(500)]
    public string? ImageUrl { get; set; }

    // Navigation properties
    public string OwnerId { get; set; } = string.Empty;
    public virtual User? Owner { get; set; }

    public virtual ICollection<CommunityCar.Domain.Entities.Booking.Booking>? Bookings { get; set; }
}