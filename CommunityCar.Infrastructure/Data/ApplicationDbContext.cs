using CommunityCar.Domain.Entities.Auth;
using CommunityCar.Domain.Entities.Profile;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace CommunityCar.Infrastructure.Data;

public class ApplicationDbContext : IdentityDbContext<User, Role, string>
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<RefreshToken> RefreshTokens { get; set; }
    public DbSet<AuditLog> AuditLogs { get; set; }
    public DbSet<ApiKey> ApiKeys { get; set; }
    public DbSet<UserProfile> UserProfiles { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        // Configure User entity
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
        });

        // Configure Role entity
        builder.Entity<Role>(entity =>
        {
            entity.Property(r => r.Description).HasMaxLength(200);
            entity.Property(r => r.CreatedAt).HasDefaultValueSql("GETUTCDATE()");
        });

        // Configure RefreshToken entity
        builder.Entity<RefreshToken>(entity =>
        {
            entity.HasKey(rt => rt.Id);
            entity.Property(rt => rt.Token).HasMaxLength(256).IsRequired();
            entity.Property(rt => rt.DeviceFingerprint).HasMaxLength(256).IsRequired();
            entity.Property(rt => rt.CreatedAt).HasDefaultValueSql("GETUTCDATE()");
            entity.HasIndex(rt => rt.Token).IsUnique();
            entity.HasIndex(rt => new { rt.UserId, rt.DeviceFingerprint });
        });

        // Configure AuditLog entity
        builder.Entity<AuditLog>(entity =>
        {
            entity.HasKey(al => al.Id);
            entity.Property(al => al.Action).HasMaxLength(100).IsRequired();
            entity.Property(al => al.EntityType).HasMaxLength(100).IsRequired();
            entity.Property(al => al.EntityId).HasMaxLength(100).IsRequired();
            entity.Property(al => al.IpAddress).HasMaxLength(45).IsRequired();
            entity.Property(al => al.UserAgent).HasMaxLength(500);
            entity.Property(al => al.Timestamp).HasDefaultValueSql("GETUTCDATE()");
            entity.Property(al => al.ErrorMessage).HasMaxLength(1000);
        });

        // Configure UserProfile entity
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
}