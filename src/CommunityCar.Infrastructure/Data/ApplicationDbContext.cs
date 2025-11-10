using CommunityCar.Domain.Common;
using CommunityCar.Domain.Entities.Auth;
using CommunityCar.Domain.Entities.Car;
using CommunityCar.Domain.Entities.Booking;
using CommunityCar.Domain.Entities.Profile;
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
}