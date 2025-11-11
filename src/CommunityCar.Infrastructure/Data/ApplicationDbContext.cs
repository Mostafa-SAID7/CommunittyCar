using CommunityCar.Domain.Common;
using CommunityCar.Domain.Entities.Auth;
using CommunityCar.Domain.Entities.Car;
using CommunityCar.Domain.Entities.Booking;
using CommunityCar.Domain.Entities.Profile;
using CommunityCar.Domain.Entities;
using CommunityCar.Domain.Entities.Community;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace CommunityCar.Infrastructure.Data;

public class ApplicationDbContext : IdentityDbContext<User, Role, string>
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    // DbSets for domain entities
    public DbSet<Car> Cars { get; set; }
    public DbSet<Booking> Bookings { get; set; }
    public DbSet<RefreshToken> RefreshTokens { get; set; }
    public DbSet<AuditLog> AuditLogs { get; set; }
    public DbSet<ApiKey> ApiKeys { get; set; }
    public DbSet<UserProfile> UserProfiles { get; set; }
    public DbSet<Notification> Notifications { get; set; }
    public DbSet<ChatMessage> ChatMessages { get; set; }

    // Community DbSets
    public DbSet<Forum> Forums { get; set; }
    public DbSet<ForumCategory> ForumCategories { get; set; }
    public DbSet<Post> Posts { get; set; }
    public DbSet<Comment> Comments { get; set; }
    public DbSet<PostVote> PostVotes { get; set; }
    public DbSet<CommentVote> CommentVotes { get; set; }
    public DbSet<Tag> Tags { get; set; }
    public DbSet<PostTag> PostTags { get; set; }
    public DbSet<Group> Groups { get; set; }
    public DbSet<GroupMember> GroupMembers { get; set; }
    public DbSet<GroupEvent> GroupEvents { get; set; }
    public DbSet<EventAttendee> EventAttendees { get; set; }
    public DbSet<Conversation> Conversations { get; set; }
    public DbSet<ConversationParticipant> ConversationParticipants { get; set; }
    public DbSet<Message> Messages { get; set; }
    public DbSet<ModerationReport> ModerationReports { get; set; }
    public DbSet<Badge> Badges { get; set; }
    public DbSet<UserBadge> UserBadges { get; set; }
    public DbSet<ReputationScore> ReputationScores { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        // Apply global query filters for soft delete
        ApplyGlobalFilters(builder);

        // Configure entities
        ConfigureUser(builder);
        ConfigureRole(builder);
        ConfigureCar(builder);
        ConfigureBooking(builder);
        ConfigureRefreshToken(builder);
        ConfigureAuditLog(builder);
        ConfigureUserProfile(builder);
        ConfigureApiKey(builder);
        ConfigureNotification(builder);
        ConfigureChatMessage(builder);

        // Configure community entities
        ConfigureForum(builder);
        ConfigureForumCategory(builder);
        ConfigurePost(builder);
        ConfigureComment(builder);
        ConfigurePostVote(builder);
        ConfigureCommentVote(builder);
        ConfigureTag(builder);
        ConfigurePostTag(builder);
        ConfigureGroup(builder);
        ConfigureGroupMember(builder);
        ConfigureGroupEvent(builder);
        ConfigureEventAttendee(builder);
        ConfigureConversation(builder);
        ConfigureConversationParticipant(builder);
        ConfigureMessage(builder);
        ConfigureModerationReport(builder);
        ConfigureBadge(builder);
        ConfigureUserBadge(builder);
        ConfigureReputationScore(builder);
    }

    private void ApplyGlobalFilters(ModelBuilder builder)
    {
        // Apply soft delete filter to all BaseEntity inheritors
        foreach (var entityType in builder.Model.GetEntityTypes())
        {
            if (typeof(BaseEntity).IsAssignableFrom(entityType.ClrType))
            {
                var method = typeof(ApplicationDbContext)
                    .GetMethod(nameof(GetSoftDeleteFilter), System.Reflection.BindingFlags.NonPublic | System.Reflection.BindingFlags.Instance)
                    ?.MakeGenericMethod(entityType.ClrType);

                var filter = method?.Invoke(this, Array.Empty<object>());
                if (filter != null)
                {
                    builder.Entity(entityType.ClrType).HasQueryFilter((LambdaExpression)filter);
                }
            }
        }
    }

    private LambdaExpression GetSoftDeleteFilter<TEntity>() where TEntity : BaseEntity
    {
        Expression<Func<TEntity, bool>> filter = e => !e.IsDeleted;
        return filter;
    }

    private void ConfigureUser(ModelBuilder builder)
    {
        builder.Entity<User>(entity =>
        {
            entity.Property(u => u.FirstName).HasMaxLength(50).IsRequired();
            entity.Property(u => u.LastName).HasMaxLength(50).IsRequired();
            entity.Property(u => u.CreatedAt).HasDefaultValueSql("GETUTCDATE()");
            entity.Property(u => u.TwoFactorSecret).HasMaxLength(32);
            entity.Property(u => u.DeviceFingerprint).HasMaxLength(256);
            entity.Property(u => u.VerificationToken).HasMaxLength(64);
            entity.Property(u => u.PasswordResetToken).HasMaxLength(64);
            entity.Property(u => u.OtpCode).HasMaxLength(6);
            entity.Property(u => u.BiometricKey).HasMaxLength(512);
            entity.Property(u => u.SocialLoginProvider).HasMaxLength(50);
            entity.Property(u => u.SocialLoginId).HasMaxLength(256);

            // Indexes
            entity.HasIndex(u => u.Email).IsUnique();
            entity.HasIndex(u => new { u.FirstName, u.LastName });
        });
    }

    private void ConfigureRole(ModelBuilder builder)
    {
        builder.Entity<Role>(entity =>
        {
            entity.Property(r => r.Description).HasMaxLength(200);
            entity.Property(r => r.CreatedAt).HasDefaultValueSql("GETUTCDATE()");
        });
    }

    private void ConfigureCar(ModelBuilder builder)
    {
        builder.Entity<Car>(entity =>
        {
            entity.Property(c => c.Make).HasMaxLength(100).IsRequired();
            entity.Property(c => c.Model).HasMaxLength(100).IsRequired();
            entity.Property(c => c.Color).HasMaxLength(50).IsRequired();
            entity.Property(c => c.LicensePlate).HasMaxLength(20).IsRequired();
            entity.Property(c => c.Description).HasMaxLength(500);
            entity.Property(c => c.ImageUrl).HasMaxLength(500);
            entity.Property(c => c.DailyRate).HasPrecision(18, 2);

            // Relationships
            entity.HasOne(c => c.Owner)
                  .WithMany(u => u.Cars)
                  .HasForeignKey(c => c.OwnerId)
                  .OnDelete(DeleteBehavior.Restrict);

            // Indexes
            entity.HasIndex(c => c.LicensePlate).IsUnique();
            entity.HasIndex(c => c.OwnerId);
            entity.HasIndex(c => c.IsAvailable);
            entity.HasIndex(c => new { c.Make, c.Model });
        });
    }

    private void ConfigureBooking(ModelBuilder builder)
    {
        builder.Entity<Booking>(entity =>
        {
            entity.Property(b => b.TotalPrice).HasPrecision(18, 2);
            entity.Property(b => b.Status).HasMaxLength(20).IsRequired();
            entity.Property(b => b.Notes).HasMaxLength(1000);

            // Relationships
            entity.HasOne(b => b.Renter)
                  .WithMany(u => u.Bookings)
                  .HasForeignKey(b => b.RenterId)
                  .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(b => b.Car)
                  .WithMany(c => c.Bookings)
                  .HasForeignKey(b => b.CarId)
                  .OnDelete(DeleteBehavior.Restrict);

            // Constraints
            entity.HasCheckConstraint("CK_Booking_EndDate", "EndDate > StartDate");
            entity.HasCheckConstraint("CK_Booking_Status", "Status IN ('Pending', 'Confirmed', 'Active', 'Completed', 'Cancelled')");

            // Indexes
            entity.HasIndex(b => b.RenterId);
            entity.HasIndex(b => b.CarId);
            entity.HasIndex(b => b.Status);
            entity.HasIndex(b => new { b.StartDate, b.EndDate });
        });
    }

    private void ConfigureRefreshToken(ModelBuilder builder)
    {
        builder.Entity<RefreshToken>(entity =>
        {
            entity.HasKey(rt => rt.Id);

            entity.Property(rt => rt.TokenId).HasMaxLength(50).IsRequired();
            entity.Property(rt => rt.Token).HasMaxLength(500).IsRequired();
            entity.Property(rt => rt.DeviceFingerprint).HasMaxLength(200).IsRequired();
            entity.Property(rt => rt.CreatedByIp).HasMaxLength(45).IsRequired();
            entity.Property(rt => rt.RevokedByIp).HasMaxLength(45);

            // Relationships
            entity.HasOne(rt => rt.User)
                  .WithMany()
                  .HasForeignKey(rt => rt.UserId)
                  .OnDelete(DeleteBehavior.Cascade);

            // Indexes
            entity.HasIndex(rt => rt.UserId);
            entity.HasIndex(rt => rt.Token).IsUnique();
            entity.HasIndex(rt => rt.TokenId).IsUnique();
            entity.HasIndex(rt => rt.ExpiresAt);
        });
    }

    private void ConfigureAuditLog(ModelBuilder builder)
    {
        builder.Entity<AuditLog>(entity =>
        {
            entity.Property(a => a.Action).HasMaxLength(10).IsRequired();
            entity.Property(a => a.EntityType).HasMaxLength(200).IsRequired();
            entity.Property(a => a.EntityId).HasMaxLength(50).IsRequired();
            entity.Property(a => a.IpAddress).HasMaxLength(45);
            entity.Property(a => a.UserAgent).HasMaxLength(500);
            entity.Property(a => a.UserName).HasMaxLength(256);
            entity.Property(a => a.ChangeReason).HasMaxLength(1000);

            // Relationships
            entity.HasOne(a => a.User)
                  .WithMany()
                  .HasForeignKey(a => a.UserId)
                  .OnDelete(DeleteBehavior.SetNull);

            // Indexes
            entity.HasIndex(a => a.UserId);
            entity.HasIndex(a => a.EntityType);
            entity.HasIndex(a => a.EntityId);
            entity.HasIndex(a => a.Action);
            entity.HasIndex(a => a.CreatedAt);
        });
    }

    private void ConfigureUserProfile(ModelBuilder builder)
    {
        builder.Entity<UserProfile>(entity =>
        {
            entity.HasKey(up => up.Id);
            entity.HasOne(up => up.User)
                .WithOne()
                .HasForeignKey<UserProfile>(up => up.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.Property(up => up.DisplayName).HasMaxLength(100);
            entity.Property(up => up.Bio).HasMaxLength(500);
            entity.Property(up => up.PhoneNumber).HasMaxLength(50);
            entity.Property(up => up.Gender).HasMaxLength(20);
            entity.Property(up => up.Address).HasMaxLength(200);
            entity.Property(up => up.City).HasMaxLength(100);
            entity.Property(up => up.State).HasMaxLength(100);
            entity.Property(up => up.ZipCode).HasMaxLength(20);
            entity.Property(up => up.Country).HasMaxLength(100);
            entity.Property(up => up.Website).HasMaxLength(200);
            entity.Property(up => up.Occupation).HasMaxLength(100);
            entity.Property(up => up.Company).HasMaxLength(200);
            entity.Property(up => up.ProfilePictureUrl).HasMaxLength(500);
            entity.Property(up => up.CoverPhotoUrl).HasMaxLength(500);
            entity.Property(up => up.CreatedAt).HasDefaultValueSql("GETUTCDATE()");
            entity.Property(up => up.UpdatedAt).HasDefaultValueSql("GETUTCDATE()");
        });
    }

    private void ConfigureApiKey(ModelBuilder builder)
    {
        builder.Entity<ApiKey>(entity =>
        {
            entity.HasKey(ak => ak.Id);
            entity.Property(ak => ak.Key).HasMaxLength(256).IsRequired();
            entity.Property(ak => ak.Name).HasMaxLength(100).IsRequired();
            entity.Property(ak => ak.Description).HasMaxLength(500);
            entity.Property(ak => ak.CreatedByIp).HasMaxLength(45);
            entity.Property(ak => ak.LastUsedByIp).HasMaxLength(45);

            entity.HasOne(ak => ak.User)
                .WithMany()
                .HasForeignKey(ak => ak.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasIndex(ak => ak.Key).IsUnique();
            entity.HasIndex(ak => ak.UserId);
            entity.HasIndex(ak => ak.ExpiresAt);
            entity.HasIndex(ak => ak.IsActive);
        });
    }

    private void ConfigureNotification(ModelBuilder builder)
    {
        builder.Entity<Notification>(entity =>
        {
            entity.Property(n => n.Title).HasMaxLength(200).IsRequired();
            entity.Property(n => n.Message).HasMaxLength(1000).IsRequired();
            entity.Property(n => n.Type).HasMaxLength(50).IsRequired();
            entity.Property(n => n.ActionUrl).HasMaxLength(500);
            entity.Property(n => n.RelatedEntityType).HasMaxLength(100);
            entity.Property(n => n.RelatedEntityId).HasMaxLength(50);

            entity.HasOne(n => n.User)
                .WithMany()
                .HasForeignKey(n => n.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasIndex(n => n.UserId);
            entity.HasIndex(n => n.IsRead);
            entity.HasIndex(n => n.Type);
            entity.HasIndex(n => n.CreatedAt);
        });
    }

    private void ConfigureChatMessage(ModelBuilder builder)
    {
        builder.Entity<ChatMessage>(entity =>
        {
            entity.Property(cm => cm.Message).HasMaxLength(2000).IsRequired();
            entity.Property(cm => cm.MessageType).HasMaxLength(50);
            entity.Property(cm => cm.AttachmentUrl).HasMaxLength(500);
            entity.Property(cm => cm.ConversationId).HasMaxLength(100);

            entity.HasOne(cm => cm.Sender)
                .WithMany()
                .HasForeignKey(cm => cm.SenderId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(cm => cm.Receiver)
                .WithMany()
                .HasForeignKey(cm => cm.ReceiverId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(cm => cm.ReplyToMessage)
                .WithMany()
                .HasForeignKey(cm => cm.ReplyToMessageId)
                .OnDelete(DeleteBehavior.SetNull);

            entity.HasIndex(cm => cm.SenderId);
            entity.HasIndex(cm => cm.ReceiverId);
            entity.HasIndex(cm => cm.IsRead);
            entity.HasIndex(cm => cm.ConversationId);
            entity.HasIndex(cm => cm.CreatedAt);
            entity.HasIndex(cm => new { cm.SenderId, cm.ReceiverId });
        });
    }

    private void ConfigureForum(ModelBuilder builder)
    {
        builder.Entity<Forum>(entity =>
        {
            entity.Property(f => f.Name).HasMaxLength(200).IsRequired();
            entity.Property(f => f.Description).HasMaxLength(1000).IsRequired();
            entity.Property(f => f.IconUrl).HasMaxLength(500);
            entity.Property(f => f.DisplayOrder).HasDefaultValue(0);

            entity.HasIndex(f => f.Name).IsUnique();
            entity.HasIndex(f => f.IsActive);
            entity.HasIndex(f => f.DisplayOrder);
        });
    }

    private void ConfigureForumCategory(ModelBuilder builder)
    {
        builder.Entity<ForumCategory>(entity =>
        {
            entity.Property(fc => fc.Name).HasMaxLength(150).IsRequired();
            entity.Property(fc => fc.Description).HasMaxLength(500);
            entity.Property(fc => fc.DisplayOrder).HasDefaultValue(0);

            entity.HasOne(fc => fc.Forum)
                .WithMany(f => f.Categories)
                .HasForeignKey(fc => fc.ForumId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasIndex(fc => new { fc.ForumId, fc.Name }).IsUnique();
            entity.HasIndex(fc => fc.ForumId);
            entity.HasIndex(fc => fc.IsActive);
        });
    }

    private void ConfigurePost(ModelBuilder builder)
    {
        builder.Entity<Post>(entity =>
        {
            entity.Property(p => p.Title).HasMaxLength(300).IsRequired();
            entity.Property(p => p.Content).HasMaxLength(10000).IsRequired();
            entity.Property(p => p.Excerpt).HasMaxLength(500);
            entity.Property(p => p.Tags).HasMaxLength(100);
            entity.Property(p => p.ModerationReason).HasMaxLength(500);

            entity.HasOne(p => p.Author)
                .WithMany()
                .HasForeignKey(p => p.AuthorId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(p => p.Forum)
                .WithMany(f => f.Posts)
                .HasForeignKey(p => p.ForumId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(p => p.Category)
                .WithMany(fc => fc.Posts)
                .HasForeignKey(p => p.CategoryId)
                .OnDelete(DeleteBehavior.SetNull);

            entity.HasIndex(p => p.AuthorId);
            entity.HasIndex(p => p.ForumId);
            entity.HasIndex(p => p.CategoryId);
            entity.HasIndex(p => p.IsPinned);
            entity.HasIndex(p => p.IsLocked);
            entity.HasIndex(p => p.IsFeatured);
            entity.HasIndex(p => p.IsApproved);
            entity.HasIndex(p => p.CreatedAt);
            entity.HasIndex(p => p.LastActivityAt);
        });
    }

    private void ConfigureComment(ModelBuilder builder)
    {
        builder.Entity<Comment>(entity =>
        {
            entity.Property(c => c.Content).HasMaxLength(5000).IsRequired();
            entity.Property(c => c.ModerationReason).HasMaxLength(500);

            entity.HasOne(c => c.Author)
                .WithMany()
                .HasForeignKey(c => c.AuthorId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(c => c.Post)
                .WithMany(p => p.Comments)
                .HasForeignKey(c => c.PostId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(c => c.ParentComment)
                .WithMany(c => c.Replies)
                .HasForeignKey(c => c.ParentCommentId)
                .OnDelete(DeleteBehavior.SetNull);

            entity.HasIndex(c => c.AuthorId);
            entity.HasIndex(c => c.PostId);
            entity.HasIndex(c => c.ParentCommentId);
            entity.HasIndex(c => c.IsAcceptedAnswer);
            entity.HasIndex(c => c.IsApproved);
            entity.HasIndex(c => c.CreatedAt);
        });
    }

    private void ConfigurePostVote(ModelBuilder builder)
    {
        builder.Entity<PostVote>(entity =>
        {
            entity.HasOne(pv => pv.User)
                .WithMany()
                .HasForeignKey(pv => pv.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(pv => pv.Post)
                .WithMany(p => p.Votes)
                .HasForeignKey(pv => pv.PostId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasIndex(pv => new { pv.PostId, pv.UserId }).IsUnique();
            entity.HasIndex(pv => pv.UserId);
            entity.HasIndex(pv => pv.PostId);
            entity.HasIndex(pv => pv.VoteType);
        });
    }

    private void ConfigureCommentVote(ModelBuilder builder)
    {
        builder.Entity<CommentVote>(entity =>
        {
            entity.HasOne(cv => cv.User)
                .WithMany()
                .HasForeignKey(cv => cv.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(cv => cv.Comment)
                .WithMany(c => c.Votes)
                .HasForeignKey(cv => cv.CommentId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasIndex(cv => new { cv.CommentId, cv.UserId }).IsUnique();
            entity.HasIndex(cv => cv.UserId);
            entity.HasIndex(cv => cv.CommentId);
            entity.HasIndex(cv => cv.VoteType);
        });
    }

    private void ConfigureTag(ModelBuilder builder)
    {
        builder.Entity<Tag>(entity =>
        {
            entity.Property(t => t.Name).HasMaxLength(50).IsRequired();
            entity.Property(t => t.Description).HasMaxLength(200);
            entity.Property(t => t.UsageCount).HasDefaultValue(0);

            entity.HasIndex(t => t.Name).IsUnique();
            entity.HasIndex(t => t.IsApproved);
            entity.HasIndex(t => t.UsageCount);
        });
    }

    private void ConfigurePostTag(ModelBuilder builder)
    {
        builder.Entity<PostTag>(entity =>
        {
            entity.HasOne(pt => pt.Post)
                .WithMany(p => p.PostTags)
                .HasForeignKey(pt => pt.PostId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(pt => pt.Tag)
                .WithMany(t => t.PostTags)
                .HasForeignKey(pt => pt.TagId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasIndex(pt => new { pt.PostId, pt.TagId }).IsUnique();
            entity.HasIndex(pt => pt.PostId);
            entity.HasIndex(pt => pt.TagId);
        });
    }

    private void ConfigureGroup(ModelBuilder builder)
    {
        builder.Entity<Group>(entity =>
        {
            entity.Property(g => g.Name).HasMaxLength(100).IsRequired();
            entity.Property(g => g.Description).HasMaxLength(500);
            entity.Property(g => g.CoverImageUrl).HasMaxLength(500);

            entity.HasOne(g => g.Owner)
                .WithMany()
                .HasForeignKey(g => g.OwnerId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasIndex(g => g.Name).IsUnique();
            entity.HasIndex(g => g.OwnerId);
            entity.HasIndex(g => g.Privacy);
            entity.HasIndex(g => g.IsActive);
            entity.HasIndex(g => g.LastActivityAt);
        });
    }

    private void ConfigureGroupMember(ModelBuilder builder)
    {
        builder.Entity<GroupMember>(entity =>
        {
            entity.HasOne(gm => gm.Group)
                .WithMany(g => g.Members)
                .HasForeignKey(gm => gm.GroupId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(gm => gm.User)
                .WithMany()
                .HasForeignKey(gm => gm.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(gm => gm.InvitedBy)
                .WithMany()
                .HasForeignKey(gm => gm.InvitedById)
                .OnDelete(DeleteBehavior.SetNull);

            entity.HasIndex(gm => new { gm.GroupId, gm.UserId }).IsUnique();
            entity.HasIndex(gm => gm.GroupId);
            entity.HasIndex(gm => gm.UserId);
            entity.HasIndex(gm => gm.Role);
            entity.HasIndex(gm => gm.Status);
        });
    }

    private void ConfigureGroupEvent(ModelBuilder builder)
    {
        builder.Entity<GroupEvent>(entity =>
        {
            entity.Property(ge => ge.Title).HasMaxLength(200).IsRequired();
            entity.Property(ge => ge.Description).HasMaxLength(1000);
            entity.Property(ge => ge.Location).HasMaxLength(200);
            entity.Property(ge => ge.VirtualLink).HasMaxLength(500);

            entity.HasOne(ge => ge.Group)
                .WithMany(g => g.Events)
                .HasForeignKey(ge => ge.GroupId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(ge => ge.Organizer)
                .WithMany()
                .HasForeignKey(ge => ge.OrganizerId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasIndex(ge => ge.GroupId);
            entity.HasIndex(ge => ge.OrganizerId);
            entity.HasIndex(ge => ge.StartDate);
            entity.HasIndex(ge => ge.EndDate);
            entity.HasIndex(ge => ge.Status);
        });
    }

    private void ConfigureEventAttendee(ModelBuilder builder)
    {
        builder.Entity<EventAttendee>(entity =>
        {
            entity.HasOne(ea => ea.Event)
                .WithMany(ge => ge.Attendees)
                .HasForeignKey(ea => ea.EventId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(ea => ea.User)
                .WithMany()
                .HasForeignKey(ea => ea.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasIndex(ea => new { ea.EventId, ea.UserId }).IsUnique();
            entity.HasIndex(ea => ea.EventId);
            entity.HasIndex(ea => ea.UserId);
            entity.HasIndex(ea => ea.Status);
        });
    }

    private void ConfigureConversation(ModelBuilder builder)
    {
        builder.Entity<Conversation>(entity =>
        {
            entity.Property(c => c.Title).HasMaxLength(200).IsRequired();
            entity.Property(c => c.Description).HasMaxLength(500);
            entity.Property(c => c.LastMessagePreview).HasMaxLength(200);

            entity.HasOne(c => c.Group)
                .WithMany()
                .HasForeignKey(c => c.GroupId)
                .OnDelete(DeleteBehavior.SetNull);

            entity.HasIndex(c => c.Type);
            entity.HasIndex(c => c.GroupId);
            entity.HasIndex(c => c.IsActive);
            entity.HasIndex(c => c.LastMessageAt);
        });
    }

    private void ConfigureConversationParticipant(ModelBuilder builder)
    {
        builder.Entity<ConversationParticipant>(entity =>
        {
            entity.HasOne(cp => cp.Conversation)
                .WithMany(c => c.Participants)
                .HasForeignKey(cp => cp.ConversationId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(cp => cp.User)
                .WithMany()
                .HasForeignKey(cp => cp.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasIndex(cp => new { cp.ConversationId, cp.UserId }).IsUnique();
            entity.HasIndex(cp => cp.ConversationId);
            entity.HasIndex(cp => cp.UserId);
            entity.HasIndex(cp => cp.Role);
            entity.HasIndex(cp => cp.Status);
            entity.HasIndex(cp => cp.LastReadAt);
        });
    }

    private void ConfigureMessage(ModelBuilder builder)
    {
        builder.Entity<Message>(entity =>
        {
            entity.Property(m => m.Content).HasMaxLength(2000).IsRequired();
            entity.Property(m => m.MessageType).HasMaxLength(50);
            entity.Property(m => m.AttachmentUrl).HasMaxLength(500);
            entity.Property(m => m.ModerationReason).HasMaxLength(500);

            entity.HasOne(m => m.Sender)
                .WithMany()
                .HasForeignKey(m => m.SenderId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(m => m.Conversation)
                .WithMany(c => c.Messages)
                .HasForeignKey(m => m.ConversationId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(m => m.ReplyToMessage)
                .WithMany(m => m.Replies)
                .HasForeignKey(m => m.ReplyToMessageId)
                .OnDelete(DeleteBehavior.SetNull);

            entity.HasIndex(m => m.SenderId);
            entity.HasIndex(m => m.ConversationId);
            entity.HasIndex(m => m.ReplyToMessageId);
            entity.HasIndex(m => m.IsApproved);
            entity.HasIndex(m => m.CreatedAt);
        });
    }

    private void ConfigureModerationReport(ModelBuilder builder)
    {
        builder.Entity<ModerationReport>(entity =>
        {
            entity.Property(mr => mr.Reason).HasMaxLength(1000).IsRequired();
            entity.Property(mr => mr.AdditionalInfo).HasMaxLength(500);
            entity.Property(mr => mr.ModeratorNotes).HasMaxLength(500);

            entity.HasOne(mr => mr.Reporter)
                .WithMany()
                .HasForeignKey(mr => mr.ReporterId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(mr => mr.ReportedUser)
                .WithMany()
                .HasForeignKey(mr => mr.ReportedUserId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(mr => mr.Moderator)
                .WithMany()
                .HasForeignKey(mr => mr.ModeratorId)
                .OnDelete(DeleteBehavior.SetNull);

            entity.HasIndex(mr => mr.ReporterId);
            entity.HasIndex(mr => mr.ReportedUserId);
            entity.HasIndex(mr => mr.Status);
            entity.HasIndex(mr => mr.Type);
            entity.HasIndex(mr => mr.ContentType);
            entity.HasIndex(mr => mr.ContentId);
            entity.HasIndex(mr => mr.CreatedAt);
        });
    }

    private void ConfigureBadge(ModelBuilder builder)
    {
        builder.Entity<Badge>(entity =>
        {
            entity.Property(b => b.Name).HasMaxLength(100).IsRequired();
            entity.Property(b => b.Description).HasMaxLength(500);
            entity.Property(b => b.IconUrl).HasMaxLength(200);
            entity.Property(b => b.Criteria).HasMaxLength(1000);
            entity.Property(b => b.PointsValue).HasDefaultValue(0);

            entity.HasIndex(b => b.Name).IsUnique();
            entity.HasIndex(b => b.Type);
            entity.HasIndex(b => b.Rarity);
            entity.HasIndex(b => b.IsActive);
        });
    }

    private void ConfigureUserBadge(ModelBuilder builder)
    {
        builder.Entity<UserBadge>(entity =>
        {
            entity.Property(ub => ub.EarnedReason).HasMaxLength(500);

            entity.HasOne(ub => ub.User)
                .WithMany()
                .HasForeignKey(ub => ub.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(ub => ub.Badge)
                .WithMany(b => b.UserBadges)
                .HasForeignKey(ub => ub.BadgeId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasIndex(ub => new { ub.UserId, ub.BadgeId }).IsUnique();
            entity.HasIndex(ub => ub.UserId);
            entity.HasIndex(ub => ub.BadgeId);
            entity.HasIndex(ub => ub.EarnedAt);
            entity.HasIndex(ub => ub.IsDisplayed);
        });
    }

    private void ConfigureReputationScore(ModelBuilder builder)
    {
        builder.Entity<ReputationScore>(entity =>
        {
            entity.Property(rs => rs.TotalScore).HasDefaultValue(0);
            entity.Property(rs => rs.PostsScore).HasDefaultValue(0);
            entity.Property(rs => rs.CommentsScore).HasDefaultValue(0);
            entity.Property(rs => rs.VotesReceivedScore).HasDefaultValue(0);
            entity.Property(rs => rs.ModerationScore).HasDefaultValue(0);
            entity.Property(rs => rs.BadgesScore).HasDefaultValue(0);

            entity.HasOne(rs => rs.User)
                .WithOne()
                .HasForeignKey<ReputationScore>(rs => rs.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasIndex(rs => rs.UserId).IsUnique();
            entity.HasIndex(rs => rs.Level);
        });
    }
}