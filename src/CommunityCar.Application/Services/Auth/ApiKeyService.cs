using CommunityCar.Domain.Entities.Auth;
using CommunityCar.Infrastructure.Data;

namespace CommunityCar.Application.Services.Auth;

public class ApiKeyService
{
    private readonly ApplicationDbContext _context;

    public ApiKeyService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<string> GenerateApiKeyAsync(string userId, string name, string description = "")
    {
        var apiKey = new ApiKey
        {
            UserId = userId,
            Name = name,
            Description = description,
            Key = GenerateSecureApiKey(),
            CreatedAt = DateTime.UtcNow,
            ExpiresAt = DateTime.UtcNow.AddYears(1), // 1 year expiry
            IsActive = true,
            LastUsedAt = null,
            UsageCount = 0
        };

        _context.ApiKeys.Add(apiKey);
        await _context.SaveChangesAsync();

        return apiKey.Key;
    }

    public async Task<bool> ValidateApiKeyAsync(string apiKey)
    {
        var key = await _context.ApiKeys
            .FirstOrDefaultAsync(k => k.Key == apiKey && k.IsActive);

        if (key == null || key.ExpiresAt < DateTime.UtcNow)
            return false;

        // Update usage statistics
        key.LastUsedAt = DateTime.UtcNow;
        key.UsageCount++;
        await _context.SaveChangesAsync();

        return true;
    }

    public async Task<string?> GetUserIdFromApiKeyAsync(string apiKey)
    {
        var key = await _context.ApiKeys
            .FirstOrDefaultAsync(k => k.Key == apiKey && k.IsActive && k.ExpiresAt > DateTime.UtcNow);

        return key?.UserId;
    }

    public async Task<bool> RevokeApiKeyAsync(string userId, string keyId)
    {
        var key = await _context.ApiKeys
            .FirstOrDefaultAsync(k => k.Id == keyId && k.UserId == userId);

        if (key == null)
            return false;

        key.IsActive = false;
        key.RevokedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return true;
    }

    public async Task<IEnumerable<ApiKey>> GetUserApiKeysAsync(string userId)
    {
        return await _context.ApiKeys
            .Where(k => k.UserId == userId)
            .OrderByDescending(k => k.CreatedAt)
            .ToListAsync();
    }

    public async Task<bool> UpdateApiKeyAsync(string userId, string keyId, string name, string description)
    {
        var key = await _context.ApiKeys
            .FirstOrDefaultAsync(k => k.Id == keyId && k.UserId == userId);

        if (key == null)
            return false;

        key.Name = name;
        key.Description = description;
        await _context.SaveChangesAsync();

        return true;
    }

    private string GenerateSecureApiKey()
    {
        // Generate a secure API key
        var keyBytes = new byte[32];
        using var rng = System.Security.Cryptography.RandomNumberGenerator.Create();
        rng.GetBytes(keyBytes);

        // Convert to base64 and make it URL-safe
        var base64 = Convert.ToBase64String(keyBytes);
        return "ck_" + base64.Replace("+", "-").Replace("/", "_").Replace("=", "");
    }
}
