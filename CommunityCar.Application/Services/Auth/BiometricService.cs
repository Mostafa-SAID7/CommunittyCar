using CommunityCar.Application.Services;
using CommunityCar.Domain.Entities.Auth;
using CommunityCar.Infrastructure.Data;

namespace CommunityCar.Application.Services.Auth;

public class BiometricService
{
    private readonly ApplicationDbContext _context;

    public BiometricService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<bool> RegisterBiometricAsync(string userId, string biometricKey, string deviceInfo)
    {
        var user = await _context.Users.FindAsync(userId);
        if (user == null)
            return false;

        user.IsBiometricEnabled = true;
        user.BiometricKey = HashBiometricKey(biometricKey);
        user.LastPasswordChange = DateTime.UtcNow; // Update last activity

        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> VerifyBiometricAsync(string userId, string biometricKey)
    {
        var user = await _context.Users.FindAsync(userId);
        if (user == null || !user.IsBiometricEnabled)
            return false;

        var hashedKey = HashBiometricKey(biometricKey);
        return user.BiometricKey == hashedKey;
    }

    public async Task<bool> DisableBiometricAsync(string userId)
    {
        var user = await _context.Users.FindAsync(userId);
        if (user == null)
            return false;

        user.IsBiometricEnabled = false;
        user.BiometricKey = null;

        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> IsBiometricEnabledAsync(string userId)
    {
        var user = await _context.Users.FindAsync(userId);
        return user?.IsBiometricEnabled ?? false;
    }

    public async Task UpdateBiometricKeyAsync(string userId, string newBiometricKey)
    {
        var user = await _context.Users.FindAsync(userId);
        if (user != null && user.IsBiometricEnabled)
        {
            user.BiometricKey = HashBiometricKey(newBiometricKey);
            user.LastPasswordChange = DateTime.UtcNow;
            await _context.SaveChangesAsync();
        }
    }

    private string HashBiometricKey(string biometricKey)
    {
        // In a real application, use a proper hashing algorithm
        // For demo purposes, we'll use a simple hash
        using var sha256 = System.Security.Cryptography.SHA256.Create();
        var bytes = System.Text.Encoding.UTF8.GetBytes(biometricKey);
        var hash = sha256.ComputeHash(bytes);
        return Convert.ToBase64String(hash);
    }
}