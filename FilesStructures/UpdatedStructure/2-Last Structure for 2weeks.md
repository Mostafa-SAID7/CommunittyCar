# CommunityCar - Complete Clean Architecture Structure

```
CommunityCar/
│
├── src/
│   │
│   ├── CommunityCar.Api/                                    # 🎯 Presentation Layer
│   │   ├── Controllers/
│   │   │   ├── Auth/
│   │   │   │   ├── AuthController.cs
│   │   │   │   ├── TokenController.cs
│   │   │   │   └── SocialAuthController.cs
│   │   │   ├── Profile/
│   │   │   │   ├── ProfileController.cs
│   │   │   │   └── PreferencesController.cs
│   │   │   ├── Cars/
│   │   │   │   ├── CarsController.cs
│   │   │   │   ├── CarReviewsController.cs
│   │   │   │   └── CarAvailabilityController.cs
│   │   │   ├── Bookings/
│   │   │   │   ├── BookingsController.cs
│   │   │   │   ├── BookingPaymentsController.cs
│   │   │   │   └── BookingHistoryController.cs
│   │   │   ├── Chat/
│   │   │   │   └── ChatController.cs
│   │   │   ├── Notifications/
│   │   │   │   └── NotificationsController.cs
│   │   │   ├── Admin/
│   │   │   │   ├── AdminController.cs
│   │   │   │   ├── UsersManagementController.cs
│   │   │   │   ├── CarsManagementController.cs
│   │   │   │   └── AnalyticsController.cs
│   │   │   └── Health/
│   │   │       └── HealthController.cs
│   │   │
│   │   ├── Hubs/                                            # SignalR Hubs
│   │   │   ├── ChatHub.cs
│   │   │   └── NotificationHub.cs
│   │   │
│   │   ├── Middleware/
│   │   │   ├── ExceptionHandlingMiddleware.cs
│   │   │   ├── RateLimitingMiddleware.cs
│   │   │   ├── LoggingMiddleware.cs
│   │   │   ├── SecurityHeadersMiddleware.cs
│   │   │   ├── RequestResponseLoggingMiddleware.cs
│   │   │   ├── CorrelationIdMiddleware.cs
│   │   │   ├── AuthenticationMiddleware.cs
│   │   │   └── RequestValidationMiddleware.cs
│   │   │
│   │   ├── Filters/
│   │   │   ├── ValidateModelAttribute.cs
│   │   │   ├── AuthorizeAttribute.cs
│   │   │   ├── RateLimitAttribute.cs
│   │   │   ├── ApiKeyAuthorizationFilter.cs
│   │   │   └── AuditActionFilter.cs
│   │   │
│   │   ├── Extensions/
│   │   │   ├── ServiceCollectionExtensions.cs
│   │   │   ├── ApplicationBuilderExtensions.cs
│   │   │   ├── SwaggerExtensions.cs
│   │   │   ├── AuthenticationExtensions.cs
│   │   │   └── HealthCheckExtensions.cs
│   │   │
│   │   ├── Templates/
│   │   │   └── Email/
│   │   │       ├── EmailVerificationTemplate.html
│   │   │       ├── OtpVerificationTemplate.html
│   │   │       ├── PasswordResetTemplate.html
│   │   │       ├── WelcomeEmailTemplate.html
│   │   │       ├── BookingConfirmationTemplate.html
│   │   │       ├── BookingReminderTemplate.html
│   │   │       └── BookingCancellationTemplate.html
│   │   │
│   │   ├── BackgroundJobs/
│   │   │   ├── EmailBackgroundService.cs
│   │   │   └── CleanupBackgroundService.cs
│   │   │
│   │   ├── HostedServices/
│   │   │   ├── DatabaseMigrationHostedService.cs
│   │   │   ├── BookingReminderHostedService.cs
│   │   │   └── CacheWarmupHostedService.cs
│   │   │
│   │   ├── HealthChecks/
│   │   │   ├── DatabaseHealthCheck.cs
│   │   │   ├── RedisHealthCheck.cs
│   │   │   └── ExternalServiceHealthCheck.cs
│   │   │
│   │   ├── Attributes/
│   │   │   ├── ApiKeyAttribute.cs
│   │   │   └── CacheAttribute.cs
│   │   │
│   │   ├── Program.cs
│   │   ├── Startup.cs
│   │   ├── GlobalUsings.cs
│   │   ├── appsettings.json
│   │   ├── appsettings.Development.json
│   │   ├── appsettings.Production.json
│   │   ├── appsettings.Staging.json
│   │   ├── Dockerfile
│   │   └── Properties/
│   │       └── launchSettings.json
│   │
│   ├── CommunityCar.Application/                            # 🎯 Application Layer
│   │   ├── Features/
│   │   │   ├── Auth/
│   │   │   │   ├── Commands/
│   │   │   │   │   ├── LoginCommand.cs
│   │   │   │   │   ├── RegisterCommand.cs
│   │   │   │   │   ├── RefreshTokenCommand.cs
│   │   │   │   │   ├── ForgotPasswordCommand.cs
│   │   │   │   │   ├── ResetPasswordCommand.cs
│   │   │   │   │   ├── VerifyEmailCommand.cs
│   │   │   │   │   ├── SocialLoginCommand.cs
│   │   │   │   │   ├── LogoutCommand.cs
│   │   │   │   │   ├── ChangePasswordCommand.cs
│   │   │   │   │   └── RevokeTokenCommand.cs
│   │   │   │   ├── Queries/
│   │   │   │   │   ├── GetUserQuery.cs
│   │   │   │   │   ├── ValidateTokenQuery.cs
│   │   │   │   │   └── GetUserSessionsQuery.cs
│   │   │   │   ├── Handlers/
│   │   │   │   │   ├── LoginCommandHandler.cs
│   │   │   │   │   ├── RegisterCommandHandler.cs
│   │   │   │   │   ├── RefreshTokenCommandHandler.cs
│   │   │   │   │   ├── ForgotPasswordCommandHandler.cs
│   │   │   │   │   ├── ResetPasswordCommandHandler.cs
│   │   │   │   │   ├── VerifyEmailCommandHandler.cs
│   │   │   │   │   ├── GetUserQueryHandler.cs
│   │   │   │   │   └── ValidateTokenQueryHandler.cs
│   │   │   │   └── Validators/
│   │   │   │       ├── LoginCommandValidator.cs
│   │   │   │       ├── RegisterCommandValidator.cs
│   │   │   │       ├── ForgotPasswordCommandValidator.cs
│   │   │   │       ├── ResetPasswordCommandValidator.cs
│   │   │   │       └── ChangePasswordCommandValidator.cs
│   │   │   │
│   │   │   ├── Profile/
│   │   │   │   ├── Commands/
│   │   │   │   │   ├── UpdateProfileCommand.cs
│   │   │   │   │   ├── ChangePasswordCommand.cs
│   │   │   │   │   ├── UploadProfileImageCommand.cs
│   │   │   │   │   └── UpdatePreferencesCommand.cs
│   │   │   │   ├── Queries/
│   │   │   │   │   ├── GetProfileQuery.cs
│   │   │   │   │   ├── GetUserBookingsQuery.cs
│   │   │   │   │   └── GetUserPreferencesQuery.cs
│   │   │   │   ├── Handlers/
│   │   │   │   │   ├── UpdateProfileCommandHandler.cs
│   │   │   │   │   ├── UploadProfileImageCommandHandler.cs
│   │   │   │   │   ├── GetProfileQueryHandler.cs
│   │   │   │   │   └── GetUserBookingsQueryHandler.cs
│   │   │   │   └── Validators/
│   │   │   │       ├── UpdateProfileCommandValidator.cs
│   │   │   │       └── UploadProfileImageCommandValidator.cs
│   │   │   │
│   │   │   ├── Cars/
│   │   │   │   ├── Commands/
│   │   │   │   │   ├── CreateCarCommand.cs
│   │   │   │   │   ├── UpdateCarCommand.cs
│   │   │   │   │   ├── DeleteCarCommand.cs
│   │   │   │   │   ├── AddCarImageCommand.cs
│   │   │   │   │   ├── UpdateCarAvailabilityCommand.cs
│   │   │   │   │   └── CreateCarReviewCommand.cs
│   │   │   │   ├── Queries/
│   │   │   │   │   ├── GetCarsQuery.cs
│   │   │   │   │   ├── GetCarByIdQuery.cs
│   │   │   │   │   ├── SearchCarsQuery.cs
│   │   │   │   │   ├── GetCarAvailabilityQuery.cs
│   │   │   │   │   └── GetCarReviewsQuery.cs
│   │   │   │   ├── Handlers/
│   │   │   │   │   ├── CreateCarCommandHandler.cs
│   │   │   │   │   ├── UpdateCarCommandHandler.cs
│   │   │   │   │   ├── DeleteCarCommandHandler.cs
│   │   │   │   │   ├── GetCarsQueryHandler.cs
│   │   │   │   │   ├── GetCarByIdQueryHandler.cs
│   │   │   │   │   └── SearchCarsQueryHandler.cs
│   │   │   │   └── Validators/
│   │   │   │       ├── CreateCarCommandValidator.cs
│   │   │   │       ├── UpdateCarCommandValidator.cs
│   │   │   │       └── CreateCarReviewCommandValidator.cs
│   │   │   │
│   │   │   ├── Bookings/
│   │   │   │   ├── Commands/
│   │   │   │   │   ├── CreateBookingCommand.cs
│   │   │   │   │   ├── UpdateBookingCommand.cs
│   │   │   │   │   ├── CancelBookingCommand.cs
│   │   │   │   │   ├── ConfirmBookingCommand.cs
│   │   │   │   │   └── ProcessPaymentCommand.cs
│   │   │   │   ├── Queries/
│   │   │   │   │   ├── GetBookingsQuery.cs
│   │   │   │   │   ├── GetBookingByIdQuery.cs
│   │   │   │   │   ├── GetBookingAvailabilityQuery.cs
│   │   │   │   │   └── GetBookingHistoryQuery.cs
│   │   │   │   ├── Handlers/
│   │   │   │   │   ├── CreateBookingCommandHandler.cs
│   │   │   │   │   ├── UpdateBookingCommandHandler.cs
│   │   │   │   │   ├── CancelBookingCommandHandler.cs
│   │   │   │   │   ├── GetBookingsQueryHandler.cs
│   │   │   │   │   └── GetBookingByIdQueryHandler.cs
│   │   │   │   └── Validators/
│   │   │   │       ├── CreateBookingCommandValidator.cs
│   │   │   │       ├── UpdateBookingCommandValidator.cs
│   │   │   │       └── CancelBookingCommandValidator.cs
│   │   │   │
│   │   │   ├── Chat/
│   │   │   │   ├── Commands/
│   │   │   │   │   ├── SendMessageCommand.cs
│   │   │   │   │   ├── CreateChatRoomCommand.cs
│   │   │   │   │   ├── JoinChatRoomCommand.cs
│   │   │   │   │   └── LeaveChatRoomCommand.cs
│   │   │   │   ├── Queries/
│   │   │   │   │   ├── GetChatHistoryQuery.cs
│   │   │   │   │   ├── GetChatRoomsQuery.cs
│   │   │   │   │   └── GetUnreadMessagesCountQuery.cs
│   │   │   │   ├── Handlers/
│   │   │   │   │   ├── SendMessageCommandHandler.cs
│   │   │   │   │   ├── CreateChatRoomCommandHandler.cs
│   │   │   │   │   ├── GetChatHistoryQueryHandler.cs
│   │   │   │   │   └── GetChatRoomsQueryHandler.cs
│   │   │   │   └── Validators/
│   │   │   │       ├── SendMessageCommandValidator.cs
│   │   │   │       └── CreateChatRoomCommandValidator.cs
│   │   │   │
│   │   │   └── Notifications/
│   │   │       ├── Commands/
│   │   │       │   ├── SendNotificationCommand.cs
│   │   │       │   └── MarkNotificationAsReadCommand.cs
│   │   │       ├── Queries/
│   │   │       │   ├── GetNotificationsQuery.cs
│   │   │       │   └── GetUnreadNotificationsCountQuery.cs
│   │   │       ├── Handlers/
│   │   │       │   ├── SendNotificationCommandHandler.cs
│   │   │       │   ├── MarkNotificationAsReadCommandHandler.cs
│   │   │       │   ├── GetNotificationsQueryHandler.cs
│   │   │       │   └── GetUnreadNotificationsCountQueryHandler.cs
│   │   │       └── Validators/
│   │   │           └── SendNotificationCommandValidator.cs
│   │   │
│   │   ├── DTOs/
│   │   │   ├── Auth/
│   │   │   │   ├── AuthResponse.cs
│   │   │   │   ├── LoginRequest.cs
│   │   │   │   ├── RegisterRequest.cs
│   │   │   │   ├── ForgotPasswordRequest.cs
│   │   │   │   ├── ResetPasswordRequest.cs
│   │   │   │   ├── VerifyEmailRequest.cs
│   │   │   │   ├── OtpRequest.cs
│   │   │   │   ├── RefreshTokenRequest.cs
│   │   │   │   ├── SocialLoginRequest.cs
│   │   │   │   └── ChangePasswordRequest.cs
│   │   │   ├── Profile/
│   │   │   │   ├── UserProfileDto.cs
│   │   │   │   ├── UpdateProfileRequest.cs
│   │   │   │   ├── ProfilePictureRequest.cs
│   │   │   │   └── UserPreferencesDto.cs
│   │   │   ├── Car/
│   │   │   │   ├── CarDto.cs
│   │   │   │   ├── CreateCarRequest.cs
│   │   │   │   ├── UpdateCarRequest.cs
│   │   │   │   ├── CarAvailabilityDto.cs
│   │   │   │   ├── CarSearchRequest.cs
│   │   │   │   ├── CarReviewDto.cs
│   │   │   │   └── CreateCarReviewRequest.cs
│   │   │   ├── Booking/
│   │   │   │   ├── BookingDto.cs
│   │   │   │   ├── CreateBookingRequest.cs
│   │   │   │   ├── UpdateBookingRequest.cs
│   │   │   │   ├── CancelBookingRequest.cs
│   │   │   │   ├── BookingPaymentDto.cs
│   │   │   │   └── BookingHistoryDto.cs
│   │   │   ├── Chat/
│   │   │   │   ├── ChatMessageDto.cs
│   │   │   │   ├── ChatRoomDto.cs
│   │   │   │   ├── SendMessageRequest.cs
│   │   │   │   └── CreateChatRoomRequest.cs
│   │   │   ├── Notification/
│   │   │   │   ├── NotificationDto.cs
│   │   │   │   └── SendNotificationRequest.cs
│   │   │   └── Common/
│   │   │       ├── PagedResult.cs
│   │   │       ├── PaginatedRequest.cs
│   │   │       ├── PaginatedResponse.cs
│   │   │       ├── ApiResponse.cs
│   │   │       ├── ErrorResponse.cs
│   │   │       └── FileUploadRequest.cs
│   │   │
│   │   ├── Common/
│   │   │   ├── Behaviors/
│   │   │   │   ├── ValidationBehavior.cs
│   │   │   │   ├── LoggingBehavior.cs
│   │   │   │   ├── PerformanceBehavior.cs
│   │   │   │   ├── CachingBehavior.cs
│   │   │   │   └── TransactionBehavior.cs
│   │   │   ├── Interfaces/
│   │   │   │   ├── ICurrentUserService.cs
│   │   │   │   ├── IDateTimeService.cs
│   │   │   │   └── IEmailTemplateService.cs
│   │   │   └── Models/
│   │   │       ├── PaginatedList.cs
│   │   │       ├── Result.cs
│   │   │       └── PagedRequest.cs
│   │   │
│   │   ├── Services/
│   │   │   ├── Auth/
│   │   │   │   ├── IAuthService.cs
│   │   │   │   ├── AuthService.cs
│   │   │   │   ├── ITokenService.cs
│   │   │   │   ├── TokenService.cs
│   │   │   │   ├── IOtpService.cs
│   │   │   │   ├── OtpService.cs
│   │   │   │   ├── ISocialAuthService.cs
│   │   │   │   ├── SocialAuthService.cs
│   │   │   │   ├── ISessionService.cs
│   │   │   │   ├── SessionService.cs
│   │   │   │   ├── IBiometricService.cs
│   │   │   │   └── BiometricService.cs
│   │   │   ├── Email/
│   │   │   │   ├── IEmailService.cs
│   │   │   │   ├── EmailService.cs
│   │   │   │   ├── IEmailTemplateService.cs
│   │   │   │   └── EmailTemplateService.cs
│   │   │   ├── Storage/
│   │   │   │   ├── IFileStorageService.cs
│   │   │   │   ├── LocalFileStorageService.cs
│   │   │   │   └── CloudStorageService.cs
│   │   │   ├── Chat/
│   │   │   │   ├── IChatService.cs
│   │   │   │   └── ChatService.cs
│   │   │   ├── Payment/
│   │   │   │   ├── IPaymentService.cs
│   │   │   │   └── StripePaymentService.cs
│   │   │   └── Notification/
│   │   │       ├── INotificationService.cs
│   │   │       ├── NotificationService.cs
│   │   │       ├── IPushNotificationService.cs
│   │   │       ├── PushNotificationService.cs
│   │   │       ├── ISmsNotificationService.cs
│   │   │       └── SmsNotificationService.cs
│   │   │
│   │   ├── Mappings/
│   │   │   ├── AuthMappingProfile.cs
│   │   │   ├── ProfileMappingProfile.cs
│   │   │   ├── CarMappingProfile.cs
│   │   │   ├── BookingMappingProfile.cs
│   │   │   ├── ChatMappingProfile.cs
│   │   │   ├── NotificationMappingProfile.cs
│   │   │   └── GlobalMappingProfile.cs
│   │   │
│   │   ├── Specifications/
│   │   │   ├── CarAvailableSpecification.cs
│   │   │   ├── UserWithProfileSpecification.cs
│   │   │   └── BookingActiveSpecification.cs
│   │   │
│   │   ├── Extensions/
│   │   │   ├── ServiceCollectionExtensions.cs
│   │   │   ├── MediatrExtensions.cs
│   │   │   └── QueryableExtensions.cs
│   │   │
│   │   └── GlobalUsings.cs
│   │
│   ├── CommunityCar.Domain/                                 # 🎯 Domain Layer
│   │   ├── Common/
│   │   │   ├── BaseEntity.cs
│   │   │   ├── BaseAuditableEntity.cs
│   │   │   ├── AuditEntry.cs
│   │   │   ├── AuditLog.cs
│   │   │   ├── DomainEvent.cs
│   │   │   ├── ValueObject.cs
│   │   │   ├── IEntity.cs
│   │   │   └── Enums/
│   │   │       ├── UserStatus.cs
│   │   │       ├── UserRole.cs
│   │   │       ├── CarStatus.cs
│   │   │       ├── BookingStatus.cs
│   │   │       ├── PaymentStatus.cs
│   │   │       ├── NotificationType.cs
│   │   │       └── VerificationStatus.cs
│   │   │
│   │   ├── ValueObjects/
│   │   │   ├── Address.cs
│   │   │   ├── Location.cs
│   │   │   ├── Email.cs
│   │   │   ├── PhoneNumber.cs
│   │   │   ├── Money.cs
│   │   │   ├── TimeRange.cs
│   │   │   ├── DateRange.cs
│   │   │   ├── Coordinates.cs
│   │   │   └── Rating.cs
│   │   │
│   │   ├── Entities/
│   │   │   ├── Auth/
│   │   │   │   ├── User.cs
│   │   │   │   ├── Role.cs
│   │   │   │   ├── Permission.cs
│   │   │   │   ├── RefreshToken.cs
│   │   │   │   ├── ApiKey.cs
│   │   │   │   ├── UserLogin.cs
│   │   │   │   ├── UserSession.cs
│   │   │   │   ├── LoginHistory.cs
│   │   │   │   ├── OtpCode.cs
│   │   │   │   └── UserClaim.cs
│   │   │   ├── Profile/
│   │   │   │   ├── UserProfile.cs
│   │   │   │   ├── UserPreferences.cs
│   │   │   │   ├── DriverLicense.cs
│   │   │   │   ├── PaymentMethod.cs
│   │   │   │   ├── UserDocument.cs
│   │   │   │   └── UserVerification.cs
│   │   │   ├── Car/
│   │   │   │   ├── Car.cs
│   │   │   │   ├── CarImage.cs
│   │   │   │   ├── CarFeature.cs
│   │   │   │   ├── CarReview.cs
│   │   │   │   ├── CarMaintenance.cs
│   │   │   │   ├── CarAvailability.cs
│   │   │   │   ├── CarCategory.cs
│   │   │   │   └── CarLocation.cs
│   │   │   ├── Booking/
│   │   │   │   ├── Booking.cs
│   │   │   │   ├── BookingStatus.cs
│   │   │   │   ├── BookingTransaction.cs
│   │   │   │   ├── BookingPayment.cs
│   │   │   │   ├── BookingCancellation.cs
│   │   │   │   ├── BookingExtension.cs
│   │   │   │   └── Insurance.cs
│   │   │   ├── Chat/
│   │   │   │   ├── ChatRoom.cs
│   │   │   │   ├── ChatMessage.cs
│   │   │   │   └── UserChatRoom.cs
│   │   │   ├── Notification/
│   │   │   │   ├── Notification.cs
│   │   │   │   ├── UserNotification.cs
│   │   │   │   └── UserNotificationPreference.cs
│   │   │   └── Payment/
│   │   │       ├── Payment.cs
│   │   │       ├── PaymentMethod.cs
│   │   │       ├── Transaction.cs
│   │   │       └── Refund.cs
│   │   │
│   │   ├── Events/
│   │   │   ├── Auth/
│   │   │   │   ├── UserRegisteredEvent.cs
│   │   │   │   ├── UserLoggedInEvent.cs
│   │   │   │   └── PasswordResetRequestedEvent.cs
│   │   │   ├── Car/
│   │   │   │   ├── CarCreatedEvent.cs
│   │   │   │   ├── CarUpdatedEvent.cs
│   │   │   │   ├── CarDeletedEvent.cs
│   │   │   │   └── CarStatusChangedEvent.cs
│   │   │   ├── Booking/
│   │   │   │   ├── BookingCreatedEvent.cs
│   │   │   │   ├── BookingConfirmedEvent.cs
│   │   │   │   ├── BookingCancelledEvent.cs
│   │   │   │   └── BookingCompletedEvent.cs
│   │   │   ├── Chat/
│   │   │   │   ├── MessageSentEvent.cs
│   │   │   │   └── ChatRoomCreatedEvent.cs
│   │   │   ├── Payment/
│   │   │   │   ├── PaymentProcessedEvent.cs
│   │   │   │   └── RefundProcessedEvent.cs
│   │   │   └── Notification/
│   │   │       └── NotificationCreatedEvent.cs
│   │   │
│   │   ├── Exceptions/
│   │   │   ├── DomainException.cs
│   │   │   ├── BadRequestException.cs
│   │   │   ├── NotFoundException.cs
│   │   │   ├── UnauthorizedException.cs
│   │   │   ├── ForbiddenException.cs
│   │   │   ├── ValidationException.cs
│   │   │   ├── ConflictException.cs
│   │   │   └── BusinessRuleException.cs
│   │   │
│   │   ├── Interfaces/
│   │   │   ├── Repositories/
│   │   │   │   ├── IRepository.cs
│   │   │   │   ├── IUserRepository.cs
│   │   │   │   ├── ICarRepository.cs
│   │   │   │   ├── IBookingRepository.cs
│   │   │   │   ├── IChatRepository.cs
│   │   │   │   ├── INotificationRepository.cs
│   │   │   │   ├── IPaymentRepository.cs
│   │   │   │   └── IUnitOfWork.cs
│   │   │   ├── Services/
│   │   │   │   └── IDomainEventService.cs
│   │   │   ├── IDomainEventDispatcher.cs
│   │   │   ├── IAggregateRoot.cs
│   │   │   └── ISpecification.cs
│   │   │
│   │   ├── Specifications/
│   │   │   ├── ISpecification.cs
│   │   │   ├── BaseSpecification.cs
│   │   │   ├── CompositeSpecification.cs
│   │   │   ├── CarAvailableSpecification.cs
│   │   │   └── UserWithProfileSpecification.cs
│   │   │
│   │   ├── Utilities/
│   │   │   ├── SD.cs
│   │   │   ├── PasswordHasher.cs
│   │   │   ├── CryptoHelper.cs
│   │   │   └── DateTimeHelper.cs
│   │   │
│   │   └── GlobalUsings.cs
│   │
│   ├── CommunityCar.Infrastructure/                         # 🎯 Infrastructure Layer
│   │   ├── Data/
│   │   │   ├── ApplicationDbContext.cs
│   │   │   ├── ApplicationDbContextSeed.cs
│   │   │   ├── DbContextFactory.cs
│   │   │   ├── Configurations/
│   │   │   │   ├── Auth/
│   │   │   │   │   ├── UserConfiguration.cs
│   │   │   │   │   ├── RoleConfiguration.cs
│   │   │   │   │   ├── PermissionConfiguration.cs
│   │   │   │   │   ├── RefreshTokenConfiguration.cs
│   │   │   │   │   ├── ApiKeyConfiguration.cs
│   │   │   │   │   ├── UserSessionConfiguration.cs
│   │   │   │   │   └── IdentityConfiguration.cs
│   │   │   │   ├── Profile/
│   │   │   │   │   ├── UserProfileConfiguration.cs
│   │   │   │   │   ├── UserPreferencesConfiguration.cs
│   │   │   │   │   └── DriverLicenseConfiguration.cs
│   │   │   │   ├── Car/
│   │   │   │   │   ├── CarConfiguration.cs
│   │   │   │   │   ├── CarImageConfiguration.cs
│   │   │   │   │   ├── CarFeatureConfiguration.cs
│   │   │   │   │   ├── CarReviewConfiguration.cs
│   │   │   │   │   ├── CarAvailabilityConfiguration.cs
│   │   │   │   │   └── CarMaintenanceConfiguration.cs
│   │   │   │   ├── Booking/
│   │   │   │   │   ├── BookingConfiguration.cs
│   │   │   │   │   ├── BookingTransactionConfiguration.cs
│   │   │   │   │   ├── BookingPaymentConfiguration.cs
│   │   │   │   │   └── InsuranceConfiguration.cs
│   │   │   │   ├── Chat/
│   │   │   │   │   ├── ChatRoomConfiguration.cs
│   │   │   │   │   ├── ChatMessageConfiguration.cs
│   │   │   │   │   └── UserChatRoomConfiguration.cs
│   │   │   │   ├── Notification/
│   │   │   │   │   ├── NotificationConfiguration.cs
│   │   │   │   │   └── UserNotificationConfiguration.cs
│   │   │   │   └── Payment/
│   │   │   │       ├── PaymentConfiguration.cs
│   │   │   │       └── TransactionConfiguration.cs
│   │   │   └── Migrations/
│   │   │       └── (EF Core Generated Migrations)
│   │   │
│   │   ├── Repositories/
│   │   │   ├── BaseRepository.cs
│   │   │   ├── UnitOfWork.cs
│   │   │   └── Specific/
│   │   │       ├── UserRepository.cs
│   │   │       ├── CarRepository.cs
│   │   │       ├── BookingRepository.cs
│   │   │       ├── ChatRoomRepository.cs
│   │   │       ├── ChatMessageRepository.cs
│   │   │       ├── NotificationRepository.cs
│   │   │       └── PaymentRepository.cs
│   │   │
│   │   ├── Identity/
│   │   │   ├── ApplicationUser.cs
│   │   │   ├── ApplicationRole.cs
│   │   │   ├── UserClaimsPrincipalFactory.cs
│   │   │   └── JwtTokenGenerator.cs
│   │   │
│   │   ├── Services/
│   │   │   ├── Auth/
│   │   │   │   ├── JwtTokenService.cs
│   │   │   │   ├── BiometricService.cs
│   │   │   │   └── SessionService.cs
│   │   │   ├── External/
│   │   │   │   ├── GoogleAuthService.cs
│   │   │   │   ├── FacebookAuthService.cs
│   │   │   │   ├── GoogleMapsService.cs
│   │   │   │   ├── TwilioSmsService.cs
│   │   │   │   └── SendGridEmailService.cs
│   │   │   ├── Storage/
│   │   │   │   ├── AzureBlobStorageService.cs
│   │   │   │   ├── AWSS3StorageService.cs
│   │   │   │   └── LocalFileStorageService.cs
│   │   │   ├── Payment/
│   │   │   │   ├── StripePaymentService.cs
│   │   │   │   └── PayPalPaymentService.cs
│   │   │   ├── Caching/
│   │   │   │   ├── RedisCacheService.cs
│   │   │   │   └── MemoryCacheService.cs
│   │   │   ├── BackgroundJobs/
│   │   │   │   ├── HangfireService.cs
│   │   │   │   ├── BookingReminderJob.cs
│   │   │   │   ├── ExpiredBookingCleanupJob.cs
│   │   │   │   └── NotificationProcessorJob.cs
│   │   │   ├── Chat/
│   │   │   │   └── ChatService.cs
│   │   │   └── Notifications/
│   │   │       ├── NotificationService.cs
│   │   │       ├── PushNotificationService.cs
│   │   │       └── SmsNotificationService.cs
│   │   │
│   │   ├── MessageBus/
│   │   │   ├── IMessageBus.cs
│   │   │   ├── AzureServiceBus.cs
│   │   │   └── RabbitMQService.cs
│   │   │
│   │   ├── Logging/
│   │   │   ├── SerilogConfiguration.cs
│   │   │   └── DatabaseLogger.cs
│   │   │
│   │   ├── HealthChecks/
│   │   │   ├── DatabaseHealthCheck.cs
│   │   │   ├── RedisHealthCheck.cs
│   │   │   └── ExternalServiceHealthCheck.cs
│   │   │
│   │   ├── Security/
│   │   │   ├── DataProtectionService.cs
│   │   │   └── EncryptionService.cs
│   │   │
│   │   ├── Persistence/
│   │   │   ├── Interceptors/
│   │   │   │   ├── AuditInterceptor.cs
│   │   │   │   ├── SoftDeleteInterceptor.cs
│   │   │   │   └── DomainEventInterceptor.cs
│   │   │   └── Extensions/
│   │   │       ├── ModelBuilderExtensions.cs
│   │   │       └── QueryableExtensions.cs
│   │   │
│   │   ├── Extensions/
│   │   │   └── ServiceCollectionExtensions.cs
│   │   │
│   │   └── GlobalUsings.cs
│   │
│   ├── CommunityCar.Shared/                                 # 🎯 Shared/Common Layer
│   │   ├── DTOs/
│   │   │   ├── Common/
│   │   │   │   ├── PaginatedRequest.cs
│   │   │   │   ├── PaginatedResponse.cs
│   │   │   │   └── FileUploadRequest.cs
│   │   │   └── Notifications/
│   │   │       ├── NotificationDto.cs
│   │   │       ├── SmsRequest.cs
│   │   │       └── PushNotificationRequest.cs
│   │   │
│   │   ├── Utilities/
│   │   │   ├── DateTimeExtensions.cs
│   │   │   ├── StringExtensions.cs
│   │   │   ├── EnumExtensions.cs
│   │   │   └── CollectionExtensions.cs
│   │   │
│   │   ├── Constants/
│   │   │   ├── AppConstants.cs
│   │   │   ├── ErrorMessages.cs
│   │   │   ├── SuccessMessages.cs
│   │   │   └── ValidationMessages.cs
│   │   │
│   │   ├── Results/
│   │   │   ├── Result.cs
│   │   │   ├── Result{T}.cs
│   │   │   ├── PagedResult.cs
│   │   │   └── ErrorResult.cs
│   │   │
│   │   └── GlobalUsings.cs
│   │
│   └── CommunityCar.Messaging/                              # 🎯 Messaging Layer
│       ├── Contracts/
│       │   ├── UserRegisteredEvent.cs
│       │   ├── BookingCreatedEvent.cs
│       │   ├── PaymentProcessedEvent.cs
│       │   └── NotificationEvent.cs
│       │
│       ├── Consumers/
│       │   ├── UserRegisteredConsumer.cs
│       │   ├── BookingCreatedConsumer.cs
│       │   └── PaymentProcessedConsumer.cs
│       │
│       ├── Producers/
│       │   ├── EventProducer.cs
│       │   └── NotificationProducer.cs
│       │
│       └── GlobalUsings.cs
│
├── tests/
│   ├── CommunityCar.Tests.Unit/                             # 🧪 Unit Tests
│   │   ├── Application/
│   │   │   ├── Auth/
│   │   │   │   ├── AuthServiceTests.cs
│   │   │   │   ├── TokenServiceTests.cs
│   │   │   │   ├── OtpServiceTests.cs
│   │   │   │   ├── LoginCommandValidatorTests.cs
│   │   │   │   ├── RegisterCommandHandlerTests.cs
│   │   │   │   └── LoginCommandHandlerTests.cs
│   │   │   ├── Profile/
│   │   │   │   ├── ProfileServiceTests.cs
│   │   │   │   ├── UpdateProfileCommandTests.cs
│   │   │   │   └── GetProfileQueryHandlerTests.cs
│   │   │   ├── Cars/
│   │   │   │   ├── CarServiceTests.cs
│   │   │   │   ├── CreateCarCommandTests.cs
│   │   │   │   ├── CarAvailabilityServiceTests.cs
│   │   │   │   └── SearchCarsQueryHandlerTests.cs
│   │   │   ├── Bookings/
│   │   │   │   ├── BookingServiceTests.cs
│   │   │   │   ├── CreateBookingCommandTests.cs
│   │   │   │   ├── PaymentServiceTests.cs
│   │   │   │   └── BookingAvailabilityTests.cs
│   │   │   ├── Chat/
│   │   │   │   ├── ChatServiceTests.cs
│   │   │   │   └── SendMessageCommandHandlerTests.cs
│   │   │   └── Validators/
│   │   │       ├── RegisterRequestValidatorTests.cs
│   │   │       ├── CreateCarRequestValidatorTests.cs
│   │   │       └── CreateBookingRequestValidatorTests.cs
│   │   │
│   │   ├── Domain/
│   │   │   ├── Entities/
│   │   │   │   ├── UserTests.cs
│   │   │   │   ├── CarTests.cs
│   │   │   │   ├── BookingTests.cs
│   │   │   │   ├── ChatRoomTests.cs
│   │   │   │   └── NotificationTests.cs
│   │   │   ├── ValueObjects/
│   │   │   │   ├── EmailTests.cs
│   │   │   │   ├── MoneyTests.cs
│   │   │   │   ├── AddressTests.cs
│   │   │   │   └── LocationTests.cs
│   │   │   ├── Specifications/
│   │   │   │   ├── CarSpecificationsTests.cs
│   │   │   │   └── BookingSpecificationsTests.cs
│   │   │   └── Events/
│   │   │       ├── UserRegisteredEventTests.cs
│   │   │       └── BookingCreatedEventTests.cs
│   │   │
│   │   └── Infrastructure/
│   │       ├── Repositories/
│   │       │   ├── UserRepositoryTests.cs
│   │       │   ├── CarRepositoryTests.cs
│   │       │   ├── BookingRepositoryTests.cs
│   │       │   └── ChatRepositoryTests.cs
│   │       └── Services/
│   │           ├── EmailServiceTests.cs
│   │           ├── PaymentServiceTests.cs
│   │           └── CacheServiceTests.cs
│   │
│   ├── CommunityCar.Tests.Integration/                      # 🧪 Integration Tests
│   │   ├── Api/
│   │   │   ├── AuthControllerTests.cs
│   │   │   ├── CarsControllerTests.cs
│   │   │   ├── BookingsControllerTests.cs
│   │   │   ├── ProfileControllerTests.cs
│   │   │   └── ChatControllerTests.cs
│   │   │
│   │   ├── Database/
│   │   │   ├── UserRepositoryIntegrationTests.cs
│   │   │   ├── CarRepositoryIntegrationTests.cs
│   │   │   ├── BookingRepositoryIntegrationTests.cs
│   │   │   └── ChatRepositoryIntegrationTests.cs
│   │   │
│   │   └── Services/
│   │       ├── EmailServiceIntegrationTests.cs
│   │       ├── PaymentServiceIntegrationTests.cs
│   │       └── StorageServiceIntegrationTests.cs
│   │
│   ├── CommunityCar.Tests.Functional/                       # 🧪 E2E/Functional Tests
│   │   ├── AuthFlowTests.cs
│   │   ├── BookingFlowTests.cs
│   │   ├── ProfileManagementTests.cs
│   │   ├── CarManagementFlowTests.cs
│   │   └── ChatFlowTests.cs
│   │
│   └── CommunityCar.Tests.Shared/                           # 🧪 Test Utilities
│       ├── Fixtures/
│       │   ├── DatabaseFixture.cs
│       │   ├── WebApplicationFactoryFixture.cs
│       │   └── TestDataBuilder.cs
│       │
│       ├── Helpers/
│       │   ├── TestAuthHelper.cs
│       │   ├── MockDataGenerator.cs
│       │   ├── AssertionHelper.cs
│       │   └── TestDbContextFactory.cs
│       │
│       ├── Mocks/
│       │   ├── MockServices.cs
│       │   ├── MockEmailService.cs
│       │   ├── MockPaymentService.cs
│       │   └── MockStorageService.cs
│       │
│       ├── TestBase.cs
│       ├── ApiWebApplicationFactory.cs
│       ├── GlobalUsings.cs
│       ├── testsettings.json
│       ├── xunit.runner.json
│       └── docker-compose.test.yml
│
├── docs/                                                    # 📚 Documentation
│   ├── architecture/
│   │   ├── overview.md
│   │   ├── clean-architecture.md
│   │   ├── domain-driven-design.md
│   │   └── cqrs-pattern.md
│   │
│   ├── api/
│   │   ├── authentication.md
│   │   ├── endpoints.md
│   │   └── swagger.md
│   │
│   ├── database/
│   │   ├── schema.md
│   │   └── migrations.md
│   │
│   └── deployment/
│       ├── docker.md
│       ├── kubernetes.md
│       └── azure.md
│
├── scripts/                                                 # 🛠️ Scripts
│   ├── database/
│   │   ├── seed-data.sql
│   │   └── backup.sh
│   │
│   ├── deployment/
│   │   ├── deploy-dev.sh
│   │   ├── deploy-staging.sh
│   │   └── deploy-prod.sh
│   │
│   └── maintenance/
│       ├── cleanup-logs.sh
│       └── optimize-db.sh
│
├── .github/                                                 # 🔄 CI/CD
│   └── workflows/
│       ├── ci.yml
│       ├── cd-dev.yml
│       ├── cd-staging.yml
│       ├── cd-production.yml
│       └── pr-checks.yml
│
├── .docker/                                                 # 🐳 Docker Files
│   ├── api/
│   │   └── Dockerfile
│   ├── database/
│   │   └── Dockerfile
│   └── nginx/
│       ├── Dockerfile
│       └── nginx.conf
│
├── kubernetes/                                              # ☸️ Kubernetes
│   ├── base/
│   │   ├── deployment.yaml
│   │   ├── service.yaml
│   │   └── ingress.yaml
│   │
│   ├── dev/
│   │   └── kustomization.yaml
│   │
│   ├── staging/
│   │   └── kustomization.yaml
│   │
│   └── production/
│       └── kustomization.yaml
│
├── .gitignore
├── .editorconfig
├── .dockerignore
├── Directory.Build.props
├── Directory.Build.targets
├── global.json
├── nuget.config
├── docker-compose.yml
├── docker-compose.override.yml
├── docker-compose.prod.yml
├── CommunityCar.sln
├── README.md
├── LICENSE
├── CONTRIBUTING.md
├── CHANGELOG.md
└── CODE_OF_CONDUCT.md
```

---

## 📋 Project Statistics

### Layer Breakdown
- **API Layer**: ~50 files
- **Application Layer**: ~180 files
- **Domain Layer**: ~80 files
- **Infrastructure Layer**: ~70 files
- **Shared Layer**: ~20 files
- **Messaging Layer**: ~10 files
- **Tests**: ~60 files

**Total Project Files**: ~470+ files

---

## 🎯 Key Features Implemented

### 1. **Authentication & Authorization**
- JWT Token-based authentication
- Refresh token mechanism
- Social login (Google, Facebook)
- OTP verification
- Biometric authentication
- Session management
- Role-based access control (RBAC)
- API key management

### 2. **User Management**
- User registration & email verification
- Profile management
- Password reset flow
- User preferences
- Driver license verification
- Payment methods

### 3. **Car Management**
- CRUD operations for cars
- Car images & features
- Car reviews & ratings
- Availability management
- Car maintenance tracking
- Car categories & locations
- Advanced search & filtering

### 4. **Booking System**
- Create, update, cancel bookings
- Booking availability check
- Payment processing (Stripe, PayPal)
- Insurance options
- Booking history
- Transaction tracking

### 5. **Real-time Communication**
- SignalR hubs for real-time updates
- Chat rooms & messages
- Instant notifications
- Online/offline status

### 6. **Notification System**
- Push notifications
- SMS notifications
- Email notifications
- In-app notifications
- User notification preferences

### 7. **Background Jobs**
- Email sending service
- Booking reminders
- Data cleanup tasks
- Cache refresh
- Report generation

### 8. **External Integrations**
- Google Maps API
- Social auth providers
- Payment gateways
- SMS services (Twilio)
- Email services (SendGrid)

### 9. **Infrastructure Services**
- Redis caching
- Azure Blob / AWS S3 storage
- Message bus (RabbitMQ/Azure Service Bus)
- Logging (Serilog)
- Health checks

### 10. **Testing**
- Unit tests
- Integration tests
- Functional/E2E tests
- Test fixtures & helpers
- Mock services

---

## 🏗️ Architecture Patterns

### Clean Architecture Layers
```
┌─────────────────────────────────────┐
│         Presentation Layer          │
│          (CommunityCar.Api)         │
└─────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────┐
│        Application Layer            │
│    (CommunityCar.Application)       │
│  ├── Features (CQRS)                │
│  ├── DTOs                           │
│  ├── Services                       │
│  └── Mappings                       │
└─────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────┐
│          Domain Layer               │
│       (CommunityCar.Domain)         │
│  ├── Entities                       │
│  ├── Value Objects                  │
│  ├── Domain Events                  │
│  ├── Specifications                 │
│  └── Interfaces                     │
└─────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────┐
│      Infrastructure Layer           │
│   (CommunityCar.Infrastructure)     │
│  ├── Data (EF Core)                 │
│  ├── Repositories                   │
│  ├── External Services              │
│  └── Implementations                │
└─────────────────────────────────────┘
```

### Patterns Implemented
- ✅ **Clean Architecture**
- ✅ **Domain-Driven Design (DDD)**
- ✅ **CQRS (Command Query Responsibility Segregation)**
- ✅ **Repository Pattern**
- ✅ **Unit of Work Pattern**
- ✅ **Specification Pattern**
- ✅ **Mediator Pattern** (MediatR)
- ✅ **Factory Pattern**
- ✅ **Strategy Pattern**
- ✅ **Dependency Injection**
- ✅ **Event-Driven Architecture**

---

## 🔧 Technologies & Packages

### Core Framework
- .NET 8
- ASP.NET Core Web API
- Entity Framework Core
- ASP.NET Core Identity

### Libraries & Packages
- **MediatR** - CQRS implementation
- **AutoMapper** - Object mapping
- **FluentValidation** - Input validation
- **Serilog** - Logging
- **Hangfire** - Background jobs
- **SignalR** - Real-time communication
- **Swashbuckle** - Swagger/OpenAPI
- **Redis** - Distributed caching
- **Polly** - Resilience & transient-fault-handling
- **Stripe.NET** - Payment processing
- **Twilio** - SMS services
- **SendGrid** - Email services
- **xUnit** - Testing framework
- **Moq** - Mocking framework
- **FluentAssertions** - Test assertions

---

## 📦 NuGet Package Requirements

```xml
<!-- Core Packages -->
<PackageReference Include="Microsoft.AspNetCore.Authentication.JwtBearer" />
<PackageReference Include="Microsoft.EntityFrameworkCore" />
<PackageReference Include="Microsoft.EntityFrameworkCore.SqlServer" />
<PackageReference Include="Microsoft.AspNetCore.Identity.EntityFrameworkCore" />

<!-- CQRS & Validation -->
<PackageReference Include="MediatR" />
<PackageReference Include="FluentValidation.AspNetCore" />
<PackageReference Include="AutoMapper.Extensions.Microsoft.DependencyInjection" />

<!-- SignalR -->
<PackageReference Include="Microsoft.AspNetCore.SignalR" />

<!-- Caching -->
<PackageReference Include="StackExchange.Redis" />
<PackageReference Include="Microsoft.Extensions.Caching.StackExchangeRedis" />

<!-- Background Jobs -->
<PackageReference Include="Hangfire.AspNetCore" />
<PackageReference Include="Hangfire.SqlServer" />

<!-- Logging -->
<PackageReference Include="Serilog.AspNetCore" />
<PackageReference Include="Serilog.Sinks.Console" />
<PackageReference Include="Serilog.Sinks.File" />

<!-- Swagger -->
<PackageReference Include="Swashbuckle.AspNetCore" />

<!-- External Services -->
<PackageReference Include="Stripe.net" />
<PackageReference Include="Twilio" />
<PackageReference Include="SendGrid" />
<PackageReference Include="Google.Apis.Auth" />

<!-- Testing -->
<PackageReference Include="xunit" />
<PackageReference Include="Moq" />
<PackageReference Include="FluentAssertions" />
<PackageReference Include="Microsoft.AspNetCore.Mvc.Testing" />
```

---

## 🚀 Getting Started

### Prerequisites
- .NET 8 SDK
- SQL Server
- Redis (optional for caching)
- Docker (optional)

### Setup Commands
```bash
# Clone repository
git clone https://github.com/yourorg/community-car.git

# Restore packages
dotnet restore

# Update database
dotnet ef database update --project src/CommunityCar.Infrastructure

# Run application
dotnet run --project src/CommunityCar.Api

# Run tests
dotnet test
```

---

## 📝 Notes

This structure provides:
- **Scalability**: Easy to add new features
- **Maintainability**: Clear separation of concerns
- **Testability**: Comprehensive test coverage
- **Performance**: Caching, async operations
- **Security**: JWT, rate limiting, API keys
- **Real-time**: SignalR for live updates
- **Reliability**: Background jobs, health checks
- **Flexibility**: Multiple payment providers, storage options