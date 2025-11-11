using System.ComponentModel.DataAnnotations;

namespace CommunityCar.Application.DTOs.Community;

public class UpdatePostRequest
{
    [Required]
    [MaxLength(300)]
    public string Title { get; set; } = string.Empty;

    [Required]
    [MaxLength(10000)]
    public string Content { get; set; } = string.Empty;

    [MaxLength(100)]
    public string? Tags { get; set; }
}