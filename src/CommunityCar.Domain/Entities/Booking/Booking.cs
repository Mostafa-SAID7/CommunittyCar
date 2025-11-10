using CommunityCar.Domain.Common;
using CommunityCar.Domain.Entities.Auth;
using CommunityCar.Domain.Entities.Car;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CommunityCar.Domain.Entities.Booking
{
    [Table("Bookings")]
    public class Booking : BaseEntity
    {
        [Required]
        public string RenterId { get; set; } = string.Empty;

        [Required]
        public string CarId { get; set; } = string.Empty;

        [Required]
        public DateTime StartDate { get; set; }

        [Required]
        public DateTime EndDate { get; set; }

        [Required]
        public decimal TotalPrice { get; set; }

        [Required]
        [MaxLength(20)]
        public string Status { get; set; } = "Pending";

        [MaxLength(1000)]
        public string? Notes { get; set; }

        public DateTime? ConfirmedAt { get; set; }
        public DateTime? CancelledAt { get; set; }

        // Navigation properties
        public virtual CommunityCar.Domain.Entities.Auth.User? Renter { get; set; }
        public virtual CommunityCar.Domain.Entities.Car.Car? Car { get; set; }
    }
}
