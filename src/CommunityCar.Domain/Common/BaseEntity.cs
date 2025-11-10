using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CommunityCar.Domain.Common;

public abstract class BaseEntity
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    [Required]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime? UpdatedAt { get; set; }

    public bool IsDeleted { get; set; } = false;

    public DateTime? DeletedAt { get; set; }

    public string? DeletedBy { get; set; }

    // Soft delete method
    public void SoftDelete(string? deletedBy = null)
    {
        IsDeleted = true;
        DeletedAt = DateTime.UtcNow;
        DeletedBy = deletedBy;
        UpdatedAt = DateTime.UtcNow;
    }

    // Restore from soft delete
    public void Restore()
    {
        IsDeleted = false;
        DeletedAt = null;
        DeletedBy = null;
        UpdatedAt = DateTime.UtcNow;
    }

    // Update timestamp
    public void UpdateTimestamp()
    {
        UpdatedAt = DateTime.UtcNow;
    }

    // Check if entity is active (not soft deleted)
    public bool IsActive => !IsDeleted;
}