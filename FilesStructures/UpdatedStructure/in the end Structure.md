src/
├── CommunityCar.Api/
│   ├── Controllers/
│   │   ├── Auth/
│   │   │   ├── AuthController.cs
│   │   │   └── SocialAuthController.cs
│   │   ├── Profile/
│   │   │   └── ProfileController.cs
│   │   ├── Bookings/
│   │   │   └── BookingsController.cs
│   │   ├── Cars/
│   │   │   ├── CarsController.cs
│   │   │   └── CarReviewsController.cs
│   │   ├── Community/
│   │   │   ├── DashboardController.cs
│   │   │   ├── PostsController.cs
│   │   │   ├── QuestionsController.cs
│   │   │   ├── AnswersController.cs
│   │   │   ├── CommentsController.cs
│   │   │   ├── VotesController.cs
│   │   │   ├── TagsController.cs
│   │   │   ├── CategoriesController.cs
│   │   │   └── ModerationController.cs
│   │   ├── Chat/
│   │   │   └── ChatController.cs
│   │   ├── Admin/
│   │   │   ├── AdminController.cs
│   │   │   └── UsersManagementController.cs
│   │   └── HealthController.cs
│   ├── Hubs/
│   │   ├── ChatHub.cs
│   │   ├── NotificationHub.cs
│   │   ├── CommunityHub.cs
│   │   └── DashboardHub.cs
│   ├── Middleware/
│   │   ├── ExceptionHandlingMiddleware.cs
│   │   ├── RateLimitingMiddleware.cs
│   │   ├── LoggingMiddleware.cs
│   │   ├── SecurityHeadersMiddleware.cs
│   │   ├── RequestResponseLoggingMiddleware.cs
│   │   ├── CorrelationIdMiddleware.cs
│   │   └── CommunityModerationMiddleware.cs
│   ├── Filters/
│   │   ├── ValidateModelAttribute.cs
│   │   ├── AuthorizeAttribute.cs
│   │   ├── RateLimitAttribute.cs
│   │   ├── CommunityModerationAttribute.cs
│   │   └── SpamProtectionAttribute.cs
│   ├── Extensions/
│   │   ├── ServiceCollectionExtensions.cs
│   │   ├── ApplicationBuilderExtensions.cs
│   │   ├── SwaggerExtensions.cs
│   │   └── CommunityExtensions.cs
│   ├── Templates/
│   │   ├── Email/
│   │   │   ├── EmailVerificationTemplate.html
│   │   │   ├── OtpVerificationTemplate.html
│   │   │   ├── PasswordResetTemplate.html
│   │   │   ├── WelcomeEmailTemplate.html
│   │   │   ├── BookingConfirmationTemplate.html
│   │   │   └── CommunityNotificationTemplate.html
│   │   └── Community/
│   │       ├── QuestionPostedTemplate.html
│   │       ├── AnswerReceivedTemplate.html
│   │       ├── CommentNotificationTemplate.html
│   │       └── ModerationActionTemplate.html
│   ├── BackgroundJobs/
│   │   ├── EmailBackgroundService.cs
│   │   ├── CleanupBackgroundService.cs
│   │   ├── CommunityDigestService.cs
│   │   ├── TrendingCalculatorService.cs
│   │   └── SpamDetectionService.cs
│   ├── HostedServices/
│   │   ├── DatabaseMigrationHostedService.cs
│   │   └── CommunityStatsHostedService.cs
│   ├── HealthChecks/
│   │   ├── DatabaseHealthCheck.cs
│   │   ├── RedisHealthCheck.cs
│   │   └── CommunityHealthCheck.cs
│   ├── Services/
│   │   ├── ICommunitySearchService.cs
│   │   ├── CommunitySearchService.cs
│   │   ├── ITrendingService.cs
│   │   └── TrendingService.cs
│   ├── Program.cs
│   ├── Startup.cs
│   ├── GlobalUsings.cs
│   ├── appsettings.json
│   ├── appsettings.Development.json
│   └── appsettings.Production.json
│
├── CommunityCar.Application/
│   ├── Features/
│   │   ├── Auth/ [Previous structure remains]
│   │   ├── Profile/ [Previous structure remains]
│   │   ├── Cars/ [Previous structure remains]
│   │   ├── Bookings/ [Previous structure remains]
│   │   ├── Chat/ [Previous structure remains]
│   │   ├── Notifications/ [Previous structure remains]
│   │   ├── Community/
│   │   │   ├── Dashboard/
│   │   │   │   ├── Queries/
│   │   │   │   │   ├── GetDashboardStatsQuery.cs
│   │   │   │   │   ├── GetUserActivityQuery.cs
│   │   │   │   │   ├── GetTrendingContentQuery.cs
│   │   │   │   │   └── GetCommunityInsightsQuery.cs
│   │   │   │   └── Handlers/
│   │   │   │       └── [Query Handlers]
│   │   │   ├── Posts/
│   │   │   │   ├── Commands/
│   │   │   │   │   ├── CreatePostCommand.cs
│   │   │   │   │   ├── UpdatePostCommand.cs
│   │   │   │   │   ├── DeletePostCommand.cs
│   │   │   │   │   ├── PinPostCommand.cs
│   │   │   │   │   └── ReportPostCommand.cs
│   │   │   │   ├── Queries/
│   │   │   │   │   ├── GetPostsQuery.cs
│   │   │   │   │   ├── GetPostByIdQuery.cs
│   │   │   │   │   ├── GetUserPostsQuery.cs
│   │   │   │   │   └── SearchPostsQuery.cs
│   │   │   │   ├── Handlers/
│   │   │   │   │   └── [Command/Query Handlers]
│   │   │   │   └── Validators/
│   │   │   │       └── [Validators]
│   │   │   ├── Questions/
│   │   │   │   ├── Commands/
│   │   │   │   │   ├── CreateQuestionCommand.cs
│   │   │   │   │   ├── UpdateQuestionCommand.cs
│   │   │   │   │   ├── DeleteQuestionCommand.cs
│   │   │   │   │   ├── CloseQuestionCommand.cs
│   │   │   │   │   ├── ReopenQuestionCommand.cs
│   │   │   │   │   └── MarkSolutionCommand.cs
│   │   │   │   ├── Queries/
│   │   │   │   │   ├── GetQuestionsQuery.cs
│   │   │   │   │   ├── GetQuestionByIdQuery.cs
│   │   │   │   │   ├── GetUnansweredQuestionsQuery.cs
│   │   │   │   │   ├── GetQuestionsByTagQuery.cs
│   │   │   │   │   └── SearchQuestionsQuery.cs
│   │   │   │   ├── Handlers/
│   │   │   │   │   └── [Command/Query Handlers]
│   │   │   │   └── Validators/
│   │   │   │       └── [Validators]
│   │   │   ├── Answers/
│   │   │   │   ├── Commands/
│   │   │   │   │   ├── CreateAnswerCommand.cs
│   │   │   │   │   ├── UpdateAnswerCommand.cs
│   │   │   │   │   ├── DeleteAnswerCommand.cs
│   │   │   │   │   └── AcceptAnswerCommand.cs
│   │   │   │   ├── Queries/
│   │   │   │   │   ├── GetAnswersQuery.cs
│   │   │   │   │   ├── GetAnswerByIdQuery.cs
│   │   │   │   │   └── GetQuestionAnswersQuery.cs
│   │   │   │   ├── Handlers/
│   │   │   │   │   └── [Command/Query Handlers]
│   │   │   │   └── Validators/
│   │   │   │       └── [Validators]
│   │   │   ├── Comments/
│   │   │   │   ├── Commands/
│   │   │   │   │   ├── CreateCommentCommand.cs
│   │   │   │   │   ├── UpdateCommentCommand.cs
│   │   │   │   │   ├── DeleteCommentCommand.cs
│   │   │   │   │   └── ReportCommentCommand.cs
│   │   │   │   ├── Queries/
│   │   │   │   │   ├── GetCommentsQuery.cs
│   │   │   │   │   └── GetCommentRepliesQuery.cs
│   │   │   │   ├── Handlers/
│   │   │   │   │   └── [Command/Query Handlers]
│   │   │   │   └── Validators/
│   │   │   │       └── [Validators]
│   │   │   ├── Votes/
│   │   │   │   ├── Commands/
│   │   │   │   │   ├── UpvoteCommand.cs
│   │   │   │   │   ├── DownvoteCommand.cs
│   │   │   │   │   └── RemoveVoteCommand.cs
│   │   │   │   ├── Queries/
│   │   │   │   │   ├── GetVotesQuery.cs
│   │   │   │   │   └── GetUserVotesQuery.cs
│   │   │   │   ├── Handlers/
│   │   │   │   │   └── [Command/Query Handlers]
│   │   │   │   └── Validators/
│   │   │   │       └── [Validators]
│   │   │   ├── Tags/
│   │   │   │   ├── Commands/
│   │   │   │   │   ├── CreateTagCommand.cs
│   │   │   │   │   ├── UpdateTagCommand.cs
│   │   │   │   │   └── DeleteTagCommand.cs
│   │   │   │   ├── Queries/
│   │   │   │   │   ├── GetTagsQuery.cs
│   │   │   │   │   ├── GetPopularTagsQuery.cs
│   │   │   │   │   └── SearchTagsQuery.cs
│   │   │   │   ├── Handlers/
│   │   │   │   │   └── [Command/Query Handlers]
│   │   │   │   └── Validators/
│   │   │   │       └── [Validators]
│   │   │   └── Moderation/
│   │   │       ├── Commands/
│   │   │       │   ├── ModerateContentCommand.cs
│   │   │       │   ├── BanUserCommand.cs
│   │   │       │   ├── WarnUserCommand.cs
│   │   │       │   └── RemoveContentCommand.cs
│   │   │       ├── Queries/
│   │   │       │   ├── GetReportedContentQuery.cs
│   │   │       │   ├── GetModerationLogsQuery.cs
│   │   │       │   └── GetUserModerationHistoryQuery.cs
│   │   │       ├── Handlers/
│   │   │       │   └── [Command/Query Handlers]
│   │   │       └── Validators/
│   │   │           └── [Validators]
│   ├── Common/
│   │   ├── Behaviors/
│   │   │   ├── ValidationBehavior.cs
│   │   │   ├── LoggingBehavior.cs
│   │   │   ├── PerformanceBehavior.cs
│   │   │   └── CommunityModerationBehavior.cs
│   │   ├── Interfaces/
│   │   │   ├── ICurrentUserService.cs
│   │   │   ├── IDateTimeService.cs
│   │   │   ├── IEmailTemplateService.cs
│   │   │   ├── ICommunityService.cs
│   │   │   ├── IReputationService.cs
│   │   │   └── IContentModerationService.cs
│   │   └── Models/
│   │       ├── PaginatedList.cs
│   │       ├── Result.cs
│   │       ├── PagedRequest.cs
│   │       ├── VoteResult.cs
│   │       ├── ReputationChange.cs
│   │       └── ModerationAction.cs
│   ├── Services/
│   │   ├── Auth/ [Previous services]
│   │   ├── Email/ [Previous services]
│   │   ├── Storage/ [Previous services]
│   │   ├── Chat/ [Previous services]
│   │   ├── Payment/ [Previous services]
│   │   ├── Notification/ [Previous services]
│   │   ├── Community/
│   │   │   ├── ICommunityService.cs
│   │   │   ├── CommunityService.cs
│   │   │   ├── IReputationService.cs
│   │   │   ├── ReputationService.cs
│   │   │   ├── IContentModerationService.cs
│   │   │   ├── ContentModerationService.cs
│   │   │   ├── ISpamDetectionService.cs
│   │   │   ├── SpamDetectionService.cs
│   │   │   ├── ITrendingService.cs
│   │   │   └── TrendingService.cs
│   │   └── Dashboard/
│   │       ├── IDashboardService.cs
│   │       └── DashboardService.cs
│   ├── Mappings/
│   │   ├── AuthMappingProfile.cs
│   │   ├── ProfileMappingProfile.cs
│   │   ├── CarMappingProfile.cs
│   │   ├── BookingMappingProfile.cs
│   │   ├── ChatMappingProfile.cs
│   │   ├── NotificationMappingProfile.cs
│   │   ├── CommunityMappingProfile.cs
│   │   ├── DashboardMappingProfile.cs
│   │   └── GlobalMappingProfile.cs
│   ├── Extensions/
│   │   ├── ServiceCollectionExtensions.cs
│   │   ├── MediatrExtensions.cs
│   │   └── CommunityServiceExtensions.cs
│   └── GlobalUsings.cs
│
├── CommunityCar.Domain/
│   ├── Common/
│   │   ├── Enums/
│   │   │   ├── UserStatus.cs
│   │   │   ├── CarStatus.cs
│   │   │   ├── BookingStatus.cs
│   │   │   ├── PaymentStatus.cs
│   │   │   ├── NotificationType.cs
│   │   │   ├── ContentType.cs
│   │   │   ├── VoteType.cs
│   │   │   ├── PostType.cs
│   │   │   ├── QuestionStatus.cs
│   │   │   ├── ModerationActionType.cs
│   │   │   ├── ReportReason.cs
│   │   │   └── ReputationAction.cs
│   │   ├── ValueObjects/
│   │   │   ├── Address.cs
│   │   │   ├── Location.cs
│   │   │   ├── Money.cs
│   │   │   ├── TimeRange.cs
│   │   │   ├── ContentScore.cs
│   │   │   ├── ReputationScore.cs
│   │   │   └── ModerationContext.cs
│   │   ├── AuditEntry.cs
│   │   ├── AuditLog.cs
│   │   ├── BaseEntity.cs
│   │   ├── BaseAuditableEntity.cs
│   │   ├── DomainEvent.cs
│   │   └── AggregateRoot.cs
│   ├── Entities/
│   │   ├── Auth/ [Previous entities]
│   │   ├── Profile/ [Previous entities]
│   │   ├── Car/ [Previous entities]
│   │   ├── Chat/ [Previous entities]
│   │   ├── Booking/ [Previous entities]
│   │   ├── Notification/ [Previous entities]
│   │   ├── Community/
│   │   │   ├── Post.cs
│   │   │   ├── Question.cs
│   │   │   ├── Answer.cs
│   │   │   ├── Comment.cs
│   │   │   ├── Vote.cs
│   │   │   ├── Tag.cs
│   │   │   ├── Category.cs
│   │   │   ├── PostTag.cs
│   │   │   ├── QuestionTag.cs
│   │   │   ├── UserReputation.cs
│   │   │   ├── Bookmark.cs
│   │   │   ├── Report.cs
│   │   │   ├── ModerationLog.cs
│   │   │   └── Badge.cs
│   │   └── Dashboard/
│   │       ├── UserActivity.cs
│   │       ├── CommunityStats.cs
│   │       └── TrendingContent.cs
│   ├── Events/
│   │   ├── UserRegisteredEvent.cs
│   │   ├── BookingCreatedEvent.cs
│   │   ├── CarStatusChangedEvent.cs
│   │   ├── CommunityEvents/
│   │   │   ├── QuestionPostedEvent.cs
│   │   │   ├── AnswerAcceptedEvent.cs
│   │   │   ├── PostCreatedEvent.cs
│   │   │   ├── CommentAddedEvent.cs
│   │   │   ├── VoteCastEvent.cs
│   │   │   ├── ReputationChangedEvent.cs
│   │   │   └── ContentModeratedEvent.cs
│   │   └── DashboardEvents/
│   │       ├── DashboardUpdatedEvent.cs
│   │       └── StatsChangedEvent.cs
│   ├── Exceptions/
│   │   ├── DomainException.cs
│   │   ├── BadRequestException.cs
│   │   ├── NotFoundException.cs
│   │   ├── UnauthorizedException.cs
│   │   ├── ValidationException.cs
│   │   ├── ConflictException.cs
│   │   ├── CommunityException.cs
│   │   ├── InsufficientReputationException.cs
│   │   └── ContentModeratedException.cs
│   ├── Interfaces/
│   │   ├── IRepository.cs
│   │   ├── IUnitOfWork.cs
│   │   ├── IDomainEventDispatcher.cs
│   │   ├── IAggregateRoot.cs
│   │   ├── IContentModeratable.cs
│   │   ├── IVotable.cs
│   │   └── ICommentable.cs
│   ├── Services/
│   │   ├── IDomainEventService.cs
│   │   ├── IReputationCalculator.cs
│   │   ├── IContentScorer.cs
│   │   └── IModerationPolicy.cs
│   ├── Specifications/
│   │   ├── BaseSpecification.cs
│   │   ├── CarAvailableSpecification.cs
│   │   ├── UserWithProfileSpecification.cs
│   │   ├── CommunitySpecifications/
│   │   │   ├── PopularPostsSpecification.cs
│   │   │   ├── UnansweredQuestionsSpecification.cs
│   │   │   ├── TrendingContentSpecification.cs
│   │   │   └── ReportedContentSpecification.cs
│   │   └── DashboardSpecifications/
│   │       ├── ActiveUsersSpecification.cs
│   │       └── CommunityGrowthSpecification.cs
│   ├── Utilities/
│   │   ├── SD.cs
│   │   ├── PasswordHasher.cs
│   │   ├── CryptoHelper.cs
│   │   ├── DateTimeHelper.cs
│   │   ├── ReputationCalculator.cs
│   │   ├── ContentScorer.cs
│   │   └── ModerationPolicies/
│   │       ├── IModerationPolicy.cs
│   │       ├── SpamDetectionPolicy.cs
│   │       ├── ProfanityFilterPolicy.cs
│   │       └── CommunityGuidelinesPolicy.cs
│   └── GlobalUsings.cs
│
├── CommunityCar.Infrastructure/
│   ├── Data/
│   │   ├── ApplicationDbContext.cs
│   │   ├── ApplicationDbContextSeed.cs
│   │   ├── Configurations/
│   │   │   ├── Auth/ [Previous configurations]
│   │   │   ├── Profile/ [Previous configurations]
│   │   │   ├── Car/ [Previous configurations]
│   │   │   ├── Chat/ [Previous configurations]
│   │   │   ├── Booking/ [Previous configurations]
│   │   │   ├── Notification/ [Previous configurations]
│   │   │   ├── Community/
│   │   │   │   ├── PostConfiguration.cs
│   │   │   │   ├── QuestionConfiguration.cs
│   │   │   │   ├── AnswerConfiguration.cs
│   │   │   │   ├── CommentConfiguration.cs
│   │   │   │   ├── VoteConfiguration.cs
│   │   │   │   ├── TagConfiguration.cs
│   │   │   │   ├── CategoryConfiguration.cs
│   │   │   │   ├── UserReputationConfiguration.cs
│   │   │   │   ├── BookmarkConfiguration.cs
│   │   │   │   └── ModerationLogConfiguration.cs
│   │   │   └── Dashboard/
│   │   │       ├── UserActivityConfiguration.cs
│   │   │       ├── CommunityStatsConfiguration.cs
│   │   │       └── TrendingContentConfiguration.cs
│   │   └── Migrations/
│   │       └── [Migration Files]
│   ├── Repositories/
│   │   ├── BaseRepository.cs
│   │   ├── UnitOfWork.cs
│   │   └── Specific/
│   │       ├── Auth/ [Previous repositories]
│   │       ├── Profile/ [Previous repositories]
│   │       ├── Car/ [Previous repositories]
│   │       ├── Chat/ [Previous repositories]
│   │       ├── Booking/ [Previous repositories]
│   │       ├── Notification/ [Previous repositories]
│   │       ├── Community/
│   │       │   ├── PostRepository.cs
│   │       │   ├── QuestionRepository.cs
│   │       │   ├── AnswerRepository.cs
│   │       │   ├── CommentRepository.cs
│   │       │   ├── VoteRepository.cs
│   │       │   ├── TagRepository.cs
│   │       │   ├── UserReputationRepository.cs
│   │       │   └── ModerationLogRepository.cs
│   │       └── Dashboard/
│   │           ├── UserActivityRepository.cs
│   │           ├── CommunityStatsRepository.cs
│   │           └── TrendingContentRepository.cs
│   ├── Services/
│   │   ├── Auth/ [Previous services]
│   │   ├── External/ [Previous services]
│   │   ├── Storage/ [Previous services]
│   │   ├── Payment/ [Previous services]
│   │   ├── Caching/ [Previous services]
│   │   ├── BackgroundJobs/ [Previous services]
│   │   ├── Chat/ [Previous services]
│   │   ├── Notifications/ [Previous services]
│   │   ├── Community/
│   │   │   ├── CommunityService.cs
│   │   │   ├── ReputationService.cs
│   │   │   ├── ContentModerationService.cs
│   │   │   ├── SpamDetectionService.cs
│   │   │   ├── TrendingService.cs
│   │   │   └── SearchIndexService.cs
│   │   ├── Dashboard/
│   │   │   └── DashboardService.cs
│   │   └── AI/
│   │       ├── IContentClassifier.cs
│   │       ├── ContentClassifier.cs
│   │       ├── ISentimentAnalyzer.cs
│   │       └── SentimentAnalyzer.cs
│   ├── Identity/ [Previous identity]
│   ├── MessageBus/ [Previous message bus]
│   ├── Logging/ [Previous logging]
│   ├── HealthChecks/ [Previous health checks]
│   ├── Security/ [Previous security]
│   ├── Search/
│   │   ├── ISearchService.cs
│   │   ├── ElasticSearchService.cs
│   │   └── CommunitySearchService.cs
│   └── GlobalUsings.cs
│
├── CommunityCar.Shared/
│   ├── DTOs/
│   │   ├── Common/ [Previous DTOs]
│   │   ├── Notifications/ [Previous DTOs]
│   │   ├── Community/
│   │   │   ├── Posts/
│   │   │   │   ├── PostDto.cs
│   │   │   │   ├── CreatePostRequest.cs
│   │   │   │   ├── UpdatePostRequest.cs
│   │   │   │   └── PostSummaryDto.cs
│   │   │   ├── Questions/
│   │   │   │   ├── QuestionDto.cs
│   │   │   │   ├── CreateQuestionRequest.cs
│   │   │   │   ├── UpdateQuestionRequest.cs
│   │   │   │   └── QuestionSummaryDto.cs
│   │   │   ├── Answers/
│   │   │   │   ├── AnswerDto.cs
│   │   │   │   ├── CreateAnswerRequest.cs
│   │   │   │   └── UpdateAnswerRequest.cs
│   │   │   ├── Comments/
│   │   │   │   ├── CommentDto.cs
│   │   │   │   ├── CreateCommentRequest.cs
│   │   │   │   └── UpdateCommentRequest.cs
│   │   │   ├── Votes/
│   │   │   │   └── VoteDto.cs
│   │   │   ├── Tags/
│   │   │   │   ├── TagDto.cs
│   │   │   │   └── CreateTagRequest.cs
│   │   │   ├── Dashboard/
│   │   │   │   ├── DashboardStatsDto.cs
│   │   │   │   ├── UserActivityDto.cs
│   │   │   │   ├── TrendingContentDto.cs
│   │   │   │   └── CommunityInsightsDto.cs
│   │   │   └── Moderation/
│   │   │       ├── ModerationActionDto.cs
│   │   │       ├── ReportDto.cs
│   │   │       └── ModerationLogDto.cs
│   │   └── Chat/ [Previous DTOs]
│   ├── Utilities/
│   │   ├── DateTimeExtensions.cs
│   │   ├── StringExtensions.cs
│   │   ├── EnumExtensions.cs
│   │   ├── CollectionExtensions.cs
│   │   ├── MarkdownHelper.cs
│   │   ├── HtmlSanitizer.cs
│   │   └── ContentFormatter.cs
│   ├── Constants/
│   │   ├── AppConstants.cs
│   │   ├── ErrorMessages.cs
│   │   ├── SuccessMessages.cs
│   │   ├── ValidationMessages.cs
│   │   ├── CommunityConstants.cs
│   │   ├── ReputationConstants.cs
│   │   └── ModerationConstants.cs
│   ├── Enums/
│   │   ├── ContentType.cs
│   │   ├── VoteType.cs
│   │   ├── PostType.cs
│   │   ├── QuestionStatus.cs
│   │   ├── ModerationActionType.cs
│   │   ├── ReportReason.cs
│   │   └── ReputationAction.cs
│   └── GlobalUsings.cs
│
├── CommunityCar.Messaging/
│   ├── Contracts/
│   │   ├── UserRegisteredEvent.cs
│   │   ├── BookingCreatedEvent.cs
│   │   ├── NotificationEvent.cs
│   │   ├── CommunityEvents/
│   │   │   ├── QuestionPostedEvent.cs
│   │   │   ├── AnswerAcceptedEvent.cs
│   │   │   ├── PostCreatedEvent.cs
│   │   │   ├── CommentAddedEvent.cs
│   │   │   └── VoteCastEvent.cs
│   │   └── DashboardEvents/
│   │       ├── DashboardUpdatedEvent.cs
│   │       └── StatsChangedEvent.cs
│   ├── Consumers/
│   │   ├── UserRegisteredConsumer.cs
│   │   ├── BookingCreatedConsumer.cs
│   │   ├── CommunityEventsConsumer.cs
│   │   └── DashboardEventsConsumer.cs
│   ├── Producers/
│   │   ├── EventProducer.cs
│   │   ├── NotificationProducer.cs
│   │   ├── CommunityEventProducer.cs
│   │   └── DashboardEventProducer.cs
│   └── GlobalUsings.cs
│
└── CommunityCar.Tests/
    ├── Unit/
    │   ├── Application/
    │   │   ├── Auth/ [Previous tests]
    │   │   ├── Profile/ [Previous tests]
    │   │   ├── Cars/ [Previous tests]
    │   │   ├── Bookings/ [Previous tests]
    │   │   ├── Chat/ [Previous tests]
    │   │   ├── Notifications/ [Previous tests]
    │   │   ├── Community/
    │   │   │   ├── Posts/
    │   │   │   │   ├── CreatePostCommandTests.cs
    │   │   │   │   └── PostServiceTests.cs
    │   │   │   ├── Questions/
    │   │   │   │   ├── CreateQuestionCommandTests.cs
    │   │   │   │   └── QuestionServiceTests.cs
    │   │   │   ├── Answers/
    │   │   │   │   ├── CreateAnswerCommandTests.cs
    │   │   │   │   └── AnswerServiceTests.cs
    │   │   │   ├── Comments/
    │   │   │   │   └── CommentServiceTests.cs
    │   │   │   ├── Votes/
    │   │   │   │   └── VoteServiceTests.cs
    │   │   │   ├── Reputation/
    │   │   │   │   └── ReputationServiceTests.cs
    │   │   │   └── Moderation/
    │   │   │       └── ModerationServiceTests.cs
    │   │   └── Dashboard/
    │   │       └── DashboardServiceTests.cs
    │   ├── Domain/ [Previous tests]
    │   └── Infrastructure/ [Previous tests]
    ├── Integration/
    │   ├── Api/
    │   │   ├── AuthControllerTests.cs
    │   │   ├── ProfileControllerTests.cs
    │   │   ├── CarsControllerTests.cs
    │   │   ├── BookingsControllerTests.cs
    │   │   ├── CommunityControllerTests.cs
    │   │   ├── DashboardControllerTests.cs
    │   │   └── ChatControllerTests.cs
    │   └── Database/ [Previous tests]
    ├── Functional/
    │   ├── AuthFlowTests.cs
    │   ├── BookingFlowTests.cs
    │   ├── ProfileManagementTests.cs
    │   ├── ChatFlowTests.cs
    │   ├── CommunityFlowTests.cs
    │   └── DashboardFlowTests.cs
    ├── TestHelpers/
    │   ├── TestDataFactory.cs
    │   ├── MockServices.cs
    │   ├── TestDbContextFactory.cs
    │   ├── AuthenticationTestHelper.cs
    │   ├── CommunityTestHelper.cs
    │   └── DashboardTestHelper.cs
    ├── Shared/
    │   ├── TestBase.cs
    │   ├── DatabaseFixture.cs
    │   └── ApiWebApplicationFactory.cs
    ├── GlobalUsings.cs
    ├── testsettings.json
    ├── xunit.runner.json
    └── docker-compose.test.yml