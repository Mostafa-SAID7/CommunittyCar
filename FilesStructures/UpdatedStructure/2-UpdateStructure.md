src/
# - part 1 
    /CommunityCar.Api
        /Controllers
            Auth/
                AuthController.cs   
            Profile/
                ProfileController.cs
            BookingsController.cs
            CarsController.cs
        /Middleware
            ExceptionHandlingMiddleware.cs
            RateLimitingMiddleware.cs
            LoggingMiddleware.cs
            SecurityHeadersMiddleware.cs
        /Extensions
            ServiceCollectionExtensions.cs
        /Templates
            /Email
                EmailVerificationTemplate.html
                OtpVerificationTemplate.html
                PasswordResetTemplate.html
   Program.cs
   GlobalUsings.cs
   appsettings.json
   appsettings.Development.json

# - part 2 

/CommunityCar.Application
   /DTOs             ← Data Transfer Objects (request/response)
       /Auth
            AuthResponse.cs
            ForgotPasswordRequest.cs
            LoginRequest.cs
            OtpRequest.cs
            RegisterRequest.cs
            ResetPasswordRequest.cs
            SocialLoginRequest.cs
            VerifyEmailRequest.cs
        /Email
            EmailRequest.cs
        /Profile
            UpdateProfileRequest.cs
            UserProfileDto.cs
    /Extensions
        ServiceCollectionExtensions.cs
    /Interfaces
        Auth/
            IAuthService.cs
            ITokenService.cs
        IEmailService.cs
        IProfileService.cs
   /Commands         ← CQRS-style commands
   /Queries          ← Queries
   /Handlers         ← Handlers for above commands/queries (MediatR)
   /Validators       ← FluentValidation validators
       /Auth
            LoginRequestValidator.cs
            OtpRequestValidator.cs
            RegisterRequestValidator.cs
        /Profile
            UpdateProfileRequestValidator.cs
   /Mappings         ← AutoMapper profiles
       AuthMappingProfile.cs
       EmailMappingProfile.cs
       MappingProfile.cs
   /Services         ← Application services (if needed)
        /Auth
            ApiKeyService.cs
            AuditService.cs
            AuthService.cs
            BiometricService.cs
            EmailService.cs
            OtpService.cs
            SecurityMonitoringService.cs
            SessionService.cs
            SocialAuthService.cs
            TokenService.cs
        /Profile
            ProfileService.cs
        EmailService.cs
GlobalUsings.cs

# - part 3 

/CommunityCar.Domain
    /Common
        AuditEntry.cs
        AuditLog.cs
        BaseEntity.cs
    /Entities
        /Auth
            ApiKey.cs
            RefreshToken.cs
            Role.cs
            User.cs
        /Profile
            UserProfile.cs
        /Car
            Car.cs
    /Exceptions
        BadRequestException.cs
        NotFoundException.cs
        UnauthorizedException.cs
        ValidationException.cs
    /Interfaces
        IRepository.cs
        IUnitOfWork.cs
    /Utilities
        SD.cs
GlobalUsings.cs

# - part 4

/CommunityCar.Infrastructure
    /Configurations
        /Auth
            IdentityConfiguration.cs
    /Data
        ApplicationDbContext.cs
    /Repositories
        BaseRepository.cs
        UnitOfWork.cs
    GlobalUsings.cs

# - part 5

/CommunityCar.Tests
    /Auth
        AuthServiceTests.cs
        ProfileServiceTests.cs
    GlobalUsings.cs
    xunit.runner.json