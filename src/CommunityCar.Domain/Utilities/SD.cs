namespace CommunityCar.Domain.Utilities;

/// <summary>
/// Static Data - Contains all constant values and magic strings used throughout the application
/// </summary>
public static class SD
{
    // Authentication & Authorization
    public const string Bearer = "Bearer";
    public const string Authorization = "Authorization";
    public const string RefreshToken = "RefreshToken";
    public const string AccessToken = "AccessToken";

    // User Roles
    public const string AdminRole = "Admin";
    public const string UserRole = "User";
    public const string ModeratorRole = "Moderator";

    // JWT Claims
    public const string UserId = "UserId";
    public const string UserName = "UserName";
    public const string Email = "Email";
    public const string FirstName = "FirstName";
    public const string LastName = "LastName";
    public const string Role = "Role";

    // API Routes
    public const string ApiVersion = "v1";
    public const string AuthRoute = "api/auth";
    public const string ProfileRoute = "api/profile";
    public const string TestRoute = "api/test";

    // File Upload
    public const string ProfilePicturesPath = "uploads/profiles";
    public const string CoverPhotosPath = "uploads/covers";
    public const string DefaultProfilePicture = "/images/default-profile.png";
    public const string DefaultCoverPhoto = "/images/default-cover.jpg";

    // File Extensions
    public static readonly string[] AllowedImageExtensions = { ".jpg", ".jpeg", ".png", ".gif" };
    public static readonly string[] AllowedDocumentExtensions = { ".pdf", ".doc", ".docx", ".txt" };

    // Validation Messages
    public const string RequiredField = "This field is required";
    public const string InvalidEmail = "Invalid email address";
    public const string InvalidPhone = "Invalid phone number";
    public const string InvalidUrl = "Invalid URL format";
    public const string PasswordTooShort = "Password must be at least 8 characters";
    public const string PasswordRequiresDigit = "Password must contain at least one digit";
    public const string PasswordRequiresUppercase = "Password must contain at least one uppercase letter";
    public const string PasswordRequiresLowercase = "Password must contain at least one lowercase letter";
    public const string PasswordRequiresNonAlphanumeric = "Password must contain at least one special character";

    // Error Messages
    public const string UserNotFound = "User not found";
    public const string InvalidCredentials = "Invalid email or password";
    public const string AccountLocked = "Account is locked";
    public const string EmailNotConfirmed = "Email not confirmed";
    public const string TokenExpired = "Token has expired";
    public const string InvalidToken = "Invalid token";
    public const string AccessDenied = "Access denied";

    // Success Messages
    public const string LoginSuccessful = "Login successful";
    public const string RegistrationSuccessful = "Registration successful";
    public const string ProfileUpdated = "Profile updated successfully";
    public const string PasswordChanged = "Password changed successfully";
    public const string EmailSent = "Email sent successfully";

    // Email Templates
    public const string EmailVerificationSubject = "Verify Your Email - CommunityCar";
    public const string PasswordResetSubject = "Reset Your Password - CommunityCar";
    public const string OtpVerificationSubject = "Your OTP Code - CommunityCar";
    public const string WelcomeEmailSubject = "Welcome to CommunityCar!";

    // Cache Keys
    public const string UserProfileCacheKey = "UserProfile_{0}";
    public const string UserRolesCacheKey = "UserRoles_{0}";
    public const string ApplicationSettingsCacheKey = "ApplicationSettings";

    // Rate Limiting
    public const string LoginRateLimit = "Login";
    public const string RegisterRateLimit = "Register";
    public const string PasswordResetRateLimit = "PasswordReset";

    // Security
    public const int MaxLoginAttempts = 5;
    public const int LockoutDurationMinutes = 5;
    public const int OtpExpiryMinutes = 5;
    public const int PasswordResetTokenExpiryHours = 24;
    public const int EmailVerificationTokenExpiryHours = 48;

    // Pagination
    public const int DefaultPageSize = 10;
    public const int MaxPageSize = 100;

    // Database
    public const string DefaultConnection = "DefaultConnection";
    public const string SqlServerProvider = "SqlServer";
    public const string SqliteProvider = "Sqlite";

    // Logging
    public const string AuthCategory = "Authentication";
    public const string ProfileCategory = "Profile";
    public const string SecurityCategory = "Security";
    public const string EmailCategory = "Email";

    // HTTP Status Codes
    public const int Ok = 200;
    public const int Created = 201;
    public const int BadRequest = 400;
    public const int Unauthorized = 401;
    public const int Forbidden = 403;
    public const int NotFound = 404;
    public const int Conflict = 409;
    public const int InternalServerError = 500;
}