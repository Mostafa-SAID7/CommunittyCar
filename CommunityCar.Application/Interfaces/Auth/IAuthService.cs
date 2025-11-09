using CommunityCar.Application.DTOs.Auth;

namespace CommunityCar.Application.Interfaces.Auth;

public interface IAuthService
{
    Task<AuthResponse> LoginAsync(LoginRequest request);
    Task<AuthResponse> RegisterAsync(RegisterRequest request);
    Task<AuthResponse> RefreshTokenAsync(string refreshToken);
    Task<bool> LogoutAsync(string userId);
    Task<AuthResponse> ForgotPasswordAsync(ForgotPasswordRequest request);
    Task<AuthResponse> ResetPasswordAsync(ResetPasswordRequest request);
    Task<AuthResponse> VerifyEmailAsync(VerifyEmailRequest request);
    Task<AuthResponse> ResendEmailVerificationAsync(string email);
    Task<string> GenerateOtpAsync(string userId, string purpose);
    Task<AuthResponse> VerifyOtpAsync(OtpRequest request);
    Task<AuthResponse> SocialLoginAsync(SocialLoginRequest request);
    Task<AuthResponse> EnableTwoFactorAsync(string userId);
    Task<AuthResponse> DisableTwoFactorAsync(string userId);
    Task<AuthResponse> VerifyTwoFactorAsync(string userId, string code);
    Task<bool> IsAccountLockedAsync(string userId);
    Task<bool> LogSecurityEventAsync(string userId, string action, string ipAddress, string userAgent);
}