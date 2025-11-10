using CommunityCar.Application.DTOs.Auth;
using CommunityCar.Application.Interfaces.Auth;
using CommunityCar.Application.Services;
using CommunityCar.Domain.Entities;
using Microsoft.AspNetCore.Identity;
using System.Security.Cryptography;

namespace CommunityCar.Application.Services.Auth;

public class AuthService : IAuthService
{
    private readonly UserManager<User> _userManager;
    private readonly SignInManager<User> _signInManager;
    private readonly ITokenService _tokenService;
    private readonly IEmailService _emailService;

    public AuthService(
        UserManager<User> userManager,
        SignInManager<User> signInManager,
        ITokenService tokenService,
        IEmailService emailService)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _tokenService = tokenService;
        _emailService = emailService;
    }

    public async Task<AuthResponse> LoginAsync(LoginRequest request)
    {
        var user = await _userManager.FindByEmailAsync(request.Email);
        if (user == null)
        {
            return new AuthResponse
            {
                Success = false,
                Message = "Invalid email or password",
                Errors = new[] { "User not found" }
            };
        }

        var result = await _signInManager.CheckPasswordSignInAsync(user, request.Password, false);
        if (!result.Succeeded)
        {
            return new AuthResponse
            {
                Success = false,
                Message = "Invalid email or password",
                Errors = new[] { "Invalid credentials" }
            };
        }

        // Update last login
        user.LastLoginAt = DateTime.UtcNow;
        await _userManager.UpdateAsync(user);

        var token = _tokenService.GenerateJwtToken(user);
        var refreshToken = _tokenService.GenerateRefreshToken();

        return new AuthResponse
        {
            Success = true,
            Message = "Login successful",
            Token = token,
            RefreshToken = refreshToken,
            Expiration = DateTime.UtcNow.AddHours(1)
        };
    }

    public async Task<AuthResponse> RegisterAsync(RegisterRequest request)
    {
        var user = new User
        {
            UserName = request.Email,
            Email = request.Email,
            FirstName = request.FirstName,
            LastName = request.LastName,
            EmailConfirmed = false // Email verification required
        };

        var result = await _userManager.CreateAsync(user, request.Password);
        if (!result.Succeeded)
        {
            return new AuthResponse
            {
                Success = false,
                Message = "Registration failed",
                Errors = result.Errors.Select(e => e.Description)
            };
        }

        // Generate email verification code
        var verificationCode = GenerateVerificationCode();

        // Send verification email
        await _emailService.SendEmailVerificationAsync(
            request.Email,
            request.FirstName,
            request.LastName,
            verificationCode);

        return new AuthResponse
        {
            Success = true,
            Message = "Registration successful. Please check your email to verify your account."
        };
    }

    public async Task<AuthResponse> RefreshTokenAsync(string refreshToken)
    {
        // TODO: Implement proper refresh token logic with database validation
        return new AuthResponse
        {
            Success = false,
            Message = "Refresh token functionality not implemented yet"
        };
    }

    public async Task<bool> LogoutAsync(string userId)
    {
        // TODO: Implement proper logout logic with token revocation
        return true;
    }

    public async Task<AuthResponse> ForgotPasswordAsync(ForgotPasswordRequest request)
    {
        var user = await _userManager.FindByEmailAsync(request.Email);
        if (user == null)
        {
            // Don't reveal that the user does not exist
            return new AuthResponse
            {
                Success = true,
                Message = "If an account with this email exists, a password reset link has been sent."
            };
        }

        var resetCode = GenerateVerificationCode();

        await _emailService.SendPasswordResetAsync(
            request.Email,
            user.FirstName,
            user.LastName,
            resetCode);

        return new AuthResponse
        {
            Success = true,
            Message = "If an account with this email exists, a password reset link has been sent."
        };
    }

    public async Task<AuthResponse> ResetPasswordAsync(ResetPasswordRequest request)
    {
        var user = await _userManager.FindByEmailAsync(request.Email);
        if (user == null)
        {
            return new AuthResponse
            {
                Success = false,
                Message = "Invalid reset request"
            };
        }

        var result = await _userManager.ResetPasswordAsync(user, request.ResetCode, request.NewPassword);
        if (!result.Succeeded)
        {
            return new AuthResponse
            {
                Success = false,
                Message = "Password reset failed",
                Errors = result.Errors.Select(e => e.Description)
            };
        }

        return new AuthResponse
        {
            Success = true,
            Message = "Password reset successful"
        };
    }

    public async Task<AuthResponse> VerifyEmailAsync(VerifyEmailRequest request)
    {
        var user = await _userManager.FindByEmailAsync(request.Email);
        if (user == null)
        {
            return new AuthResponse
            {
                Success = false,
                Message = "Invalid verification request"
            };
        }

        // TODO: Verify the code against a stored value in database/cache
        // For demo purposes, we'll just confirm the email
        user.EmailConfirmed = true;
        await _userManager.UpdateAsync(user);

        // Send welcome email
        await _emailService.SendWelcomeEmailAsync(
            request.Email,
            user.FirstName,
            user.LastName);

        var token = _tokenService.GenerateJwtToken(user);
        var refreshToken = _tokenService.GenerateRefreshToken();

        return new AuthResponse
        {
            Success = true,
            Message = "Email verified successfully",
            Token = token,
            RefreshToken = refreshToken,
            Expiration = DateTime.UtcNow.AddHours(1)
        };
    }

    public async Task<AuthResponse> ResendEmailVerificationAsync(string email)
    {
        var user = await _userManager.FindByEmailAsync(email);
        if (user == null)
        {
            return new AuthResponse
            {
                Success = false,
                Message = "User not found"
            };
        }

        if (user.EmailConfirmed)
        {
            return new AuthResponse
            {
                Success = false,
                Message = "Email already verified"
            };
        }

        var verificationCode = GenerateVerificationCode();

        await _emailService.SendEmailVerificationAsync(
            email,
            user.FirstName,
            user.LastName,
            verificationCode);

        return new AuthResponse
        {
            Success = true,
            Message = "Verification email sent"
        };
    }

    public async Task<string> GenerateOtpAsync(string userId, string purpose)
    {
        var otp = GenerateOtpCode();

        // TODO: Store OTP in database/cache with expiration (e.g., 5 minutes)
        // For demo purposes, we'll just return it

        var user = await _userManager.FindByIdAsync(userId);
        if (user != null)
        {
            await _emailService.SendOtpAsync(
                user.Email!,
                user.FirstName,
                user.LastName,
                otp,
                purpose);
        }

        return otp;
    }

    public async Task<AuthResponse> VerifyOtpAsync(OtpRequest request)
    {
        // TODO: Verify against stored OTP in database/cache with expiration check
        // For demo purposes, we'll accept any 6-digit code
        if (request.Otp.Length != 6 || !request.Otp.All(char.IsDigit))
        {
            return new AuthResponse
            {
                Success = false,
                Message = "Invalid OTP"
            };
        }

        return new AuthResponse
        {
            Success = true,
            Message = "OTP verified successfully"
        };
    }

    public async Task<AuthResponse> EnableTwoFactorAsync(string userId)
    {
        var user = await _userManager.FindByIdAsync(userId);
        if (user == null)
        {
            return new AuthResponse
            {
                Success = false,
                Message = "User not found"
            };
        }

        var result = await _userManager.SetTwoFactorEnabledAsync(user, true);
        if (!result.Succeeded)
        {
            return new AuthResponse
            {
                Success = false,
                Message = "Failed to enable two-factor authentication"
            };
        }

        return new AuthResponse
        {
            Success = true,
            Message = "Two-factor authentication enabled"
        };
    }

    public async Task<AuthResponse> DisableTwoFactorAsync(string userId)
    {
        var user = await _userManager.FindByIdAsync(userId);
        if (user == null)
        {
            return new AuthResponse
            {
                Success = false,
                Message = "User not found"
            };
        }

        var result = await _userManager.SetTwoFactorEnabledAsync(user, false);
        if (!result.Succeeded)
        {
            return new AuthResponse
            {
                Success = false,
                Message = "Failed to disable two-factor authentication"
            };
        }

        return new AuthResponse
        {
            Success = true,
            Message = "Two-factor authentication disabled"
        };
    }

    public async Task<AuthResponse> VerifyTwoFactorAsync(string userId, string code)
    {
        var user = await _userManager.FindByIdAsync(userId);
        if (user == null)
        {
            return new AuthResponse
            {
                Success = false,
                Message = "User not found"
            };
        }

        var result = await _userManager.VerifyTwoFactorTokenAsync(user, "Authenticator", code);
        if (!result)
        {
            return new AuthResponse
            {
                Success = false,
                Message = "Invalid two-factor code"
            };
        }

        return new AuthResponse
        {
            Success = true,
            Message = "Two-factor authentication verified"
        };
    }

    public async Task<bool> IsAccountLockedAsync(string userId)
    {
        var user = await _userManager.FindByIdAsync(userId);
        return user != null && await _userManager.IsLockedOutAsync(user);
    }

    public async Task<bool> LogSecurityEventAsync(string userId, string action, string ipAddress, string userAgent)
    {
        // TODO: Implement security event logging with audit trail
        // This would typically log to a database or external service
        return true;
    }

    public async Task<AuthResponse> SocialLoginAsync(SocialLoginRequest request)
    {
        // TODO: Implement social login with OAuth providers (Google, Facebook, etc.)
        return new AuthResponse
        {
            Success = false,
            Message = "Social login not implemented yet"
        };
    }

    private string GenerateVerificationCode()
    {
        return RandomNumberGenerator.GetInt32(100000, 999999).ToString();
    }

    private string GenerateOtpCode()
    {
        return RandomNumberGenerator.GetInt32(100000, 999999).ToString();
    }
}