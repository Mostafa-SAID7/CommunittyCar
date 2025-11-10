using CommunityCar.Domain.Entities.Auth;

namespace CommunityCar.Application.Interfaces.Auth;

public interface ITokenService
{
    string GenerateJwtToken(User user);
    string GenerateRefreshToken();
    Task<bool> ValidateRefreshTokenAsync(string refreshToken, string userId);
    Task RevokeRefreshTokenAsync(string userId);
}