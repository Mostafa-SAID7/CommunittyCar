using CommunityCar.Application.Services;
using CommunityCar.Domain.Entities.Auth;
using CommunityCar.Infrastructure.Data;

namespace CommunityCar.Application.Services.Auth;

public class SessionService
{
    private readonly ApplicationDbContext _context;

    public SessionService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<RefreshToken> CreateRefreshTokenAsync(string userId, string deviceFingerprint)
    {
        // Revoke existing tokens for this device
        var existingTokens = _context.RefreshTokens
            .Where(rt => rt.UserId == userId && rt.DeviceFingerprint == deviceFingerprint && rt.IsActive);

        foreach (var token in existingTokens)
        {
            token.IsRevoked = true;
            token.RevokedAt = DateTime.UtcNow;
        }

        // Create new refresh token
        var refreshToken = new RefreshToken
        {
            UserId = userId,
            Token = GenerateSecureToken(),
            DeviceFingerprint = deviceFingerprint,
            CreatedAt = DateTime.UtcNow,
            ExpiresAt = DateTime.UtcNow.AddDays(7), // 7 days expiry
            IsRevoked = false
        };

        _context.RefreshTokens.Add(refreshToken);
        await _context.SaveChangesAsync();

        return refreshToken;
    }

    public async Task<RefreshToken?> GetValidRefreshTokenAsync(string token, string deviceFingerprint)
    {
        return await _context.RefreshTokens
            .FirstOrDefaultAsync(rt =>
                rt.Token == token &&
                rt.DeviceFingerprint == deviceFingerprint &&
                rt.IsActive);
    }

    public async Task<bool> RevokeRefreshTokenAsync(string token, string userId, string ipAddress)
    {
        var refreshToken = await _context.RefreshTokens
            .FirstOrDefaultAsync(rt => rt.Token == token && rt.UserId == userId);

        if (refreshToken == null)
            return false;

        refreshToken.IsRevoked = true;
        refreshToken.RevokedAt = DateTime.UtcNow;
        refreshToken.RevokedByIp = ipAddress;

        await _context.SaveChangesAsync();
        return true;
    }

    public async Task RevokeAllUserTokensAsync(string userId, string exceptToken = null)
    {
        var tokensToRevoke = _context.RefreshTokens
            .Where(rt => rt.UserId == userId && rt.IsActive);

        if (!string.IsNullOrEmpty(exceptToken))
        {
            tokensToRevoke = tokensToRevoke.Where(rt => rt.Token != exceptToken);
        }

        foreach (var token in tokensToRevoke)
        {
            token.IsRevoked = true;
            token.RevokedAt = DateTime.UtcNow;
        }

        await _context.SaveChangesAsync();
    }

    public async Task<IEnumerable<RefreshToken>> GetUserActiveSessionsAsync(string userId)
    {
        return await _context.RefreshTokens
            .Where(rt => rt.UserId == userId && rt.IsActive)
            .OrderByDescending(rt => rt.CreatedAt)
            .ToListAsync();
    }

    public async Task<bool> ValidateDeviceFingerprintAsync(string userId, string deviceFingerprint)
    {
        // Check if this device has been used before by the user
        var hasUsedDevice = await _context.RefreshTokens
            .AnyAsync(rt => rt.UserId == userId && rt.DeviceFingerprint == deviceFingerprint);

        if (!hasUsedDevice)
        {
            // This is a new device - could trigger additional verification
            // For now, we'll allow it but log it
            return true;
        }

        return true;
    }

    public async Task RotateRefreshTokenAsync(string oldToken, string userId, string deviceFingerprint)
    {
        // Revoke old token
        var oldRefreshToken = await _context.RefreshTokens
            .FirstOrDefaultAsync(rt => rt.Token == oldToken && rt.UserId == userId);

        if (oldRefreshToken != null)
        {
            oldRefreshToken.IsRevoked = true;
            oldRefreshToken.RevokedAt = DateTime.UtcNow;
            oldRefreshToken.ReplacedByToken = GenerateSecureToken();
        }

        // Create new token
        var newRefreshToken = new RefreshToken
        {
            UserId = userId,
            Token = GenerateSecureToken(),
            DeviceFingerprint = deviceFingerprint,
            CreatedAt = DateTime.UtcNow,
            ExpiresAt = DateTime.UtcNow.AddDays(7),
            IsRevoked = false
        };

        _context.RefreshTokens.Add(newRefreshToken);
        await _context.SaveChangesAsync();
    }

    private string GenerateSecureToken()
    {
        return Convert.ToBase64String(Guid.NewGuid().ToByteArray()) +
               Convert.ToBase64String(Guid.NewGuid().ToByteArray());
    }
}