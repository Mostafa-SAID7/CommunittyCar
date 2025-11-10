using Microsoft.AspNetCore.Identity;

namespace CommunityCar.Domain.Entities.Auth;

public class Role : IdentityRole<string>
{
    public string Description { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public bool IsActive { get; set; } = true;
}