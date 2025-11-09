using CommunityCar.Application.DTOs.Auth;

namespace CommunityCar.Application.Interfaces.Auth;

public interface IAuthService
{
    Task<AuthResponse> LoginAsync(LoginRequest request);
    Task<AuthResponse> RegisterAsync(RegisterRequest request);
    Task<AuthResponse> RefreshTokenAsync(string refreshToken);
    Task<bool> LogoutAsync(string userId);
    Task<AuthResponse> GenerateOtpAsync(string email);
    Task<AuthResponse> VerifyOtpAsync(OtpRequest request);
    Task<AuthResponse> SocialLoginAsync(SocialLoginRequest request);
    Task<AuthResponse> EnableTwoFactorAsync(string userId);
    Task<AuthResponse> DisableTwoFactorAsync(string userId);
    Task<AuthResponse> VerifyTwoFactorAsync(string userId, string code);
    Task<AuthResponse> ResetPasswordAsync(string email);
    Task<AuthResponse> ConfirmResetPasswordAsync(string token, string newPassword);
    Task<AuthResponse> VerifyEmailAsync(string token);
    Task<bool> IsAccountLockedAsync(string userId);
    Task<bool> LogSecurityEventAsync(string userId, string action, string ipAddress, string userAgent);
}