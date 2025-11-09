using CommunityCar.Application.Interfaces;
using CommunityCar.Application.Services;
using CommunityCar.Application.Validators.Auth;
using CommunityCar.Application.Validators.Profile;
using CommunityCar.Domain.Interfaces;
using CommunityCar.Infrastructure.Repositories;
using FluentValidation;
using FluentValidation.AspNetCore;
using Microsoft.Extensions.DependencyInjection;

namespace CommunityCar.Application.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services)
    {
        // Register application services
        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<ITokenService, TokenService>();
        services.AddScoped<IOtpService, OtpService>();
        services.AddScoped<IEmailService, EmailService>();
        services.AddScoped<IProfileService, ProfileService>();
        services.AddScoped<ICarService, CarService>();
        services.AddScoped<IBookingService, BookingService>();
        services.AddScoped<IAuditService, AuditService>();

        // Register FluentValidation
        services.AddFluentValidationAutoValidation();
        services.AddValidatorsFromAssemblyContaining<LoginRequestValidator>();
        services.AddValidatorsFromAssemblyContaining<RegisterRequestValidator>();
        services.AddValidatorsFromAssemblyContaining<UpdateProfileRequestValidator>();
        services.AddValidatorsFromAssemblyContaining<CreateCarRequestValidator>();
        services.AddValidatorsFromAssemblyContaining<CreateBookingRequestValidator>();

        // Register MediatR
        services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(typeof(ServiceCollectionExtensions).Assembly));

        // Register AutoMapper
        services.AddAutoMapper(typeof(ServiceCollectionExtensions).Assembly);

        return services;
    }

    public static IServiceCollection AddInfrastructureServices(this IServiceCollection services)
    {
        // Register repositories and Unit of Work
        services.AddScoped<IUnitOfWork, UnitOfWork>();
        services.AddScoped(typeof(IRepository<>), typeof(BaseRepository<>));

        // Register specific repositories if needed
        services.AddScoped<ICarRepository, CarRepository>();
        services.AddScoped<IBookingRepository, BookingRepository>();
        services.AddScoped<IAuditLogRepository, AuditLogRepository>();

        return services;
    }

    public static IServiceCollection AddApiServices(this IServiceCollection services)
    {
        // Register API-specific services
        services.AddScoped<ICurrentUserService, CurrentUserService>();
        services.AddScoped<IApiResponseService, ApiResponseService>();

        // Register background services
        services.AddHostedService<EmailBackgroundService>();
        services.AddHostedService<AuditCleanupService>();
        services.AddHostedService<ExpiredBookingCleanupService>();

        return services;
    }
}