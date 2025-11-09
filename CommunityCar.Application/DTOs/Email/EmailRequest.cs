using System.ComponentModel.DataAnnotations;

namespace CommunityCar.Application.DTOs.Email;

public class EmailRequest
{
    [Required]
    [EmailAddress]
    public string ToEmail { get; set; } = string.Empty;

    [Required]
    public string Subject { get; set; } = string.Empty;

    [Required]
    public string Body { get; set; } = string.Empty;

    public string? FromName { get; set; }

    public bool IsHtml { get; set; } = true;

    public Dictionary<string, string>? Placeholders { get; set; }
}