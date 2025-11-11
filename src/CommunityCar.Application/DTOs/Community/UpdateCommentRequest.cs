using System.ComponentModel.DataAnnotations;

namespace CommunityCar.Application.DTOs.Community;

public class UpdateCommentRequest
{
    [Required]
    [MaxLength(5000)]
    public string Content { get; set; } = string.Empty;
}