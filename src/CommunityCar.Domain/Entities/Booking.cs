using CommunityCar.Domain.Common;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CommunityCar.Domain.Entities;

[Table("Bookings")]
public class Booking : BaseEntity
{
    [Required]
    public DateTime StartDate { get; set; }

    [Required]
    public DateTime EndDate { get; set; }

    [Required]
    public decimal TotalPrice { get; set; }

    [Required]
    [MaxLength(20)]
    public string Status { get; set; } = "Pending"; // Pending, Confirmed, Active, Completed, Cancelled

    [MaxLength(1000)]
    public string? Notes { get; set; }

    public DateTime? PickupDate { get; set; }

    public DateTime? ReturnDate { get; set; }

    // Navigation properties
    [Required]
    public string RenterId { get; set; } = string.Empty;
    public virtual User? Renter { get; set; }

    [Required]
    public int CarId { get; set; }
    public virtual Car? Car { get; set; }

    // Calculated properties
    public int TotalDays => (EndDate.Date - StartDate.Date).Days;

    public bool IsActive => Status == "Active" || Status == "Confirmed";
    public bool IsCompleted => Status == "Completed";
    public bool IsCancelled => Status == "Cancelled";
}