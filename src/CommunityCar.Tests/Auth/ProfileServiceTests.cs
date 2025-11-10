using CommunityCar.Application.DTOs.Profile;
using CommunityCar.Application.Interfaces;
using CommunityCar.Application.Services;
using CommunityCar.Domain.Entities;
using CommunityCar.Domain.Entities.Profile;
using CommunityCar.Infrastructure.Data;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Moq;

namespace CommunityCar.Tests.Auth;

public class ProfileServiceTests : IDisposable
{
    private readonly ApplicationDbContext _context;
    private readonly Mock<UserManager<User>> _userManagerMock;
    private readonly Mock<IWebHostEnvironment> _environmentMock;
    private readonly ProfileService _profileService;

    public ProfileServiceTests()
    {
        // Setup in-memory database
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;

        _context = new ApplicationDbContext(options);

        // Setup UserManager mock
        var userStoreMock = new Mock<IUserStore<User>>();
        _userManagerMock = new Mock<UserManager<User>>(
            userStoreMock.Object, null, null, null, null, null, null, null, null);

        // Setup WebHostEnvironment mock
        _environmentMock = new Mock<IWebHostEnvironment>();
        _environmentMock.Setup(e => e.WebRootPath).Returns("wwwroot");

        // Create ProfileService instance
        _profileService = new ProfileService(
            _context,
            _userManagerMock.Object,
            _environmentMock.Object);
    }

    [Fact]
    public async Task GetProfileAsync_ProfileExists_ReturnsProfile()
    {
        // Arrange
        var userId = "user-id";
        var user = new User { Id = userId, Email = "test@example.com", FirstName = "Test", LastName = "User" };
        var profile = new UserProfile
        {
            UserId = userId,
            DisplayName = "Test User",
            Bio = "Test bio",
            IsPublic = true
        };

        _context.UserProfiles.Add(profile);
        await _context.SaveChangesAsync();

        _userManagerMock.Setup(x => x.FindByIdAsync(userId)).ReturnsAsync(user);

        // Act
        var result = await _profileService.GetProfileAsync(userId);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(userId, result.UserId);
        Assert.Equal("Test User", result.DisplayName);
        Assert.Equal("Test bio", result.Bio);
    }

    [Fact]
    public async Task GetProfileAsync_ProfileNotExists_ReturnsNull()
    {
        // Arrange
        var userId = "nonexistent-user";

        // Act
        var result = await _profileService.GetProfileAsync(userId);

        // Assert
        Assert.Null(result);
    }

    [Fact]
    public async Task GetPublicProfileAsync_PublicProfile_ReturnsProfile()
    {
        // Arrange
        var userId = "user-id";
        var user = new User { Id = userId, Email = "test@example.com", FirstName = "Test", LastName = "User" };
        var profile = new UserProfile
        {
            UserId = userId,
            DisplayName = "Test User",
            Bio = "Test bio",
            IsPublic = true,
            ShowEmail = false
        };

        _context.UserProfiles.Add(profile);
        await _context.SaveChangesAsync();

        _userManagerMock.Setup(x => x.FindByIdAsync(userId)).ReturnsAsync(user);

        // Act
        var result = await _profileService.GetPublicProfileAsync(userId);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(userId, result.UserId);
        Assert.Equal("Test User", result.DisplayName);
        Assert.Null(result.UserEmail); // Should be hidden
    }

    [Fact]
    public async Task GetPublicProfileAsync_PrivateProfile_ReturnsNull()
    {
        // Arrange
        var userId = "user-id";
        var profile = new UserProfile
        {
            UserId = userId,
            IsPublic = false
        };

        _context.UserProfiles.Add(profile);
        await _context.SaveChangesAsync();

        // Act
        var result = await _profileService.GetPublicProfileAsync(userId);

        // Assert
        Assert.Null(result);
    }

    [Fact]
    public async Task CreateProfileAsync_ValidData_CreatesProfile()
    {
        // Arrange
        var userId = "user-id";
        var user = new User { Id = userId, Email = "test@example.com", FirstName = "Test", LastName = "User" };
        var request = new UpdateProfileRequest
        {
            DisplayName = "New User",
            Bio = "New bio",
            IsPublic = true
        };

        _userManagerMock.Setup(x => x.FindByIdAsync(userId)).ReturnsAsync(user);

        // Act
        var result = await _profileService.CreateProfileAsync(userId, request);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(userId, result.UserId);
        Assert.Equal("New User", result.DisplayName);
        Assert.Equal("New bio", result.Bio);
        Assert.True(result.IsPublic);

        var savedProfile = await _context.UserProfiles.FirstOrDefaultAsync(p => p.UserId == userId);
        Assert.NotNull(savedProfile);
    }

    [Fact]
    public async Task CreateProfileAsync_ProfileAlreadyExists_ThrowsException()
    {
        // Arrange
        var userId = "user-id";
        var existingProfile = new UserProfile { UserId = userId };
        _context.UserProfiles.Add(existingProfile);
        await _context.SaveChangesAsync();

        var request = new UpdateProfileRequest { DisplayName = "New User" };

        // Act & Assert
        await Assert.ThrowsAsync<InvalidOperationException>(
            () => _profileService.CreateProfileAsync(userId, request));
    }

    [Fact]
    public async Task UpdateProfileAsync_ProfileExists_UpdatesProfile()
    {
        // Arrange
        var userId = "user-id";
        var user = new User { Id = userId, Email = "test@example.com", FirstName = "Test", LastName = "User" };
        var profile = new UserProfile
        {
            UserId = userId,
            DisplayName = "Old Name",
            Bio = "Old bio"
        };

        _context.UserProfiles.Add(profile);
        await _context.SaveChangesAsync();

        var request = new UpdateProfileRequest
        {
            DisplayName = "Updated Name",
            Bio = "Updated bio"
        };

        _userManagerMock.Setup(x => x.FindByIdAsync(userId)).ReturnsAsync(user);

        // Act
        var result = await _profileService.UpdateProfileAsync(userId, request);

        // Assert
        Assert.NotNull(result);
        Assert.Equal("Updated Name", result.DisplayName);
        Assert.Equal("Updated bio", result.Bio);
    }

    [Fact]
    public async Task UpdateProfileAsync_ProfileNotExists_ReturnsNull()
    {
        // Arrange
        var userId = "nonexistent-user";
        var request = new UpdateProfileRequest { DisplayName = "New Name" };

        // Act
        var result = await _profileService.UpdateProfileAsync(userId, request);

        // Assert
        Assert.Null(result);
    }

    [Fact]
    public async Task DeleteProfileAsync_ProfileExists_DeletesProfile()
    {
        // Arrange
        var userId = "user-id";
        var profile = new UserProfile { UserId = userId };
        _context.UserProfiles.Add(profile);
        await _context.SaveChangesAsync();

        // Act
        var result = await _profileService.DeleteProfileAsync(userId);

        // Assert
        Assert.True(result);
        var deletedProfile = await _context.UserProfiles.FirstOrDefaultAsync(p => p.UserId == userId);
        Assert.Null(deletedProfile);
    }

    [Fact]
    public async Task DeleteProfileAsync_ProfileNotExists_ReturnsFalse()
    {
        // Arrange
        var userId = "nonexistent-user";

        // Act
        var result = await _profileService.DeleteProfileAsync(userId);

        // Assert
        Assert.False(result);
    }

    [Fact]
    public async Task ValidateProfileDataAsync_ValidData_ReturnsTrue()
    {
        // Arrange
        var request = new UpdateProfileRequest
        {
            DateOfBirth = new DateTime(2000, 1, 1),
            Website = "https://example.com"
        };

        // Act
        var result = await _profileService.ValidateProfileDataAsync(request);

        // Assert
        Assert.True(result);
    }

    [Fact]
    public async Task ValidateProfileDataAsync_UnderageUser_ReturnsFalse()
    {
        // Arrange
        var request = new UpdateProfileRequest
        {
            DateOfBirth = DateTime.UtcNow.AddYears(-10) // 10 years old
        };

        // Act
        var result = await _profileService.ValidateProfileDataAsync(request);

        // Assert
        Assert.False(result);
    }

    [Fact]
    public async Task ValidateProfileDataAsync_InvalidWebsite_ReturnsFalse()
    {
        // Arrange
        var request = new UpdateProfileRequest
        {
            Website = "invalid-url"
        };

        // Act
        var result = await _profileService.ValidateProfileDataAsync(request);

        // Assert
        Assert.False(result);
    }

    public void Dispose()
    {
        _context.Dispose();
    }
}