using System.ComponentModel.DataAnnotations;

namespace CommunityCar.Application.DTOs.Community;

public class CreateCommentRequest
{
    [Required]
    public int PostId { get; set; }

    public int? ParentCommentId { get; set; }

    [Required]
    [MaxLength(5000)]
    public string Content { get; set; } = string.Empty;
}