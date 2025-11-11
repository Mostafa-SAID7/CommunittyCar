using CommunityCar.Application.Interfaces;
using CommunityCar.Application.Interfaces.Auth;
using CommunityCar.Application.Services;
using CommunityCar.Application.Services.Auth;
using CommunityCar.Application.Validators.Auth;
using CommunityCar.Application.Validators.Profile;
using CommunityCar.Domain.Interfaces;
using CommunityCar.Infrastructure.Repositories;
using FluentValidation;
using FluentValidation.AspNetCore;
using Microsoft.Extensions.DependencyInjection;
using System.Reflection;

namespace CommunityCar.Application.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services)
    {
        // Register application services
        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<ITokenService, TokenService>();
        // services.AddScoped<IOtpService, OtpService>(); // Commented out - interface not found
        services.AddScoped<IEmailService, Services.EmailService>();
        services.AddScoped<IProfileService, ProfileService>();
        services.AddScoped<INotificationService, Infrastructure.Services.NotificationService>();
        services.AddScoped<IChatService, Infrastructure.Services.ChatService>();
        services.AddScoped<IPostService, Infrastructure.Services.PostService>();
        services.AddScoped<ICommentService, Infrastructure.Services.CommentService>();
        // services.AddScoped<ICarService, CarService>(); // Commented out - service not implemented
        // services.AddScoped<IBookingService, BookingService>(); // Commented out - service not implemented
        // services.AddScoped<IAuditService, AuditService>(); // Commented out - service not implemented

        // Register FluentValidation
        services.AddFluentValidationAutoValidation();
        services.AddValidatorsFromAssemblyContaining<LoginRequestValidator>();
        services.AddValidatorsFromAssemblyContaining<RegisterRequestValidator>();
        services.AddValidatorsFromAssemblyContaining<UpdateProfileRequestValidator>();
        services.AddValidatorsFromAssemblyContaining<global::CommunityCar.Application.Validators.Notifications.CreateNotificationRequestValidator>();
        services.AddValidatorsFromAssemblyContaining<global::CommunityCar.Application.Validators.Chat.SendChatMessageRequestValidator>();
        // services.AddValidatorsFromAssemblyContaining<CreateCarRequestValidator>(); // Commented out - validator not implemented
        // services.AddValidatorsFromAssemblyContaining<CreateBookingRequestValidator>(); // Commented out - validator not implemented

        // Register MediatR
        services.AddMediatR(cfg => cfg.RegisterServicesFromAssemblies(Assembly.GetExecutingAssembly()));

        // Register AutoMapper
        services.AddAutoMapper(typeof(ServiceCollectionExtensions));

        return services;
    }

    public static IServiceCollection AddInfrastructureServices(this IServiceCollection services)
    {
        // Register repositories and Unit of Work
        services.AddScoped<IUnitOfWork, UnitOfWork>();
        services.AddScoped(typeof(IRepository<>), typeof(BaseRepository<>));

        // Register specific repositories if needed
        // services.AddScoped<ICarRepository, CarRepository>(); // Commented out - repository not implemented
        // services.AddScoped<IBookingRepository, BookingRepository>(); // Commented out - repository not implemented
        // services.AddScoped<IAuditLogRepository, AuditLogRepository>(); // Commented out - repository not implemented

        return services;
    }

    public static IServiceCollection AddApiServices(this IServiceCollection services)
    {
        // Register API-specific services
        // services.AddScoped<ICurrentUserService, CurrentUserService>(); // Commented out - service not implemented
        // services.AddScoped<IApiResponseService, ApiResponseService>(); // Commented out - service not implemented

        // Register background services
        // services.AddHostedService<EmailBackgroundService>(); // Commented out - service not implemented
        // services.AddHostedService<AuditCleanupService>(); // Commented out - service not implemented
        // services.AddHostedService<ExpiredBookingCleanupService>(); // Commented out - service not implemented

        return services;
    }
}