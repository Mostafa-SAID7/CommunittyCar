using CommunityCar.Application.DTOs.Auth;
using CommunityCar.Application.Interfaces.Auth;
using CommunityCar.Application.Services.Auth;
using CommunityCar.Domain.Entities.Auth;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Moq;

namespace CommunityCar.Tests.Auth;

public class AuthServiceTests
{
    private readonly Mock<UserManager<User>> _userManagerMock;
    private readonly Mock<SignInManager<User>> _signInManagerMock;
    private readonly Mock<ITokenService> _tokenServiceMock;
    private readonly AuthService _authService;

    public AuthServiceTests()
    {
        // Setup UserManager mock
        var userStoreMock = new Mock<IUserStore<User>>();
        _userManagerMock = new Mock<UserManager<User>>(
            userStoreMock.Object, null, null, null, null, null, null, null, null);

        // Setup SignInManager mock
        var contextAccessorMock = new Mock<Microsoft.AspNetCore.Http.IHttpContextAccessor>();
        var userClaimsPrincipalFactoryMock = new Mock<IUserClaimsPrincipalFactory<User>>();
        _signInManagerMock = new Mock<SignInManager<User>>(
            _userManagerMock.Object,
            contextAccessorMock.Object,
            userClaimsPrincipalFactoryMock.Object,
            null, null, null, null);

        // Setup TokenService mock
        _tokenServiceMock = new Mock<ITokenService>();

        // Setup EmailService mock
        var emailServiceMock = new Mock<IEmailService>();

        // Create AuthService instance
        _authService = new AuthService(
            _userManagerMock.Object,
            _signInManagerMock.Object,
            _tokenServiceMock.Object,
            emailServiceMock.Object);
    }

    [Fact]
    public async Task LoginAsync_ValidCredentials_ReturnsSuccess()
    {
        // Arrange
        var loginRequest = new LoginRequest
        {
            Email = "test@example.com",
            Password = "Password123!"
        };

        var user = new User
        {
            Id = "user-id",
            Email = loginRequest.Email,
            UserName = loginRequest.Email,
            FirstName = "Test",
            LastName = "User"
        };

        _userManagerMock.Setup(x => x.FindByEmailAsync(loginRequest.Email))
            .ReturnsAsync(user);

        _signInManagerMock.Setup(x => x.CheckPasswordSignInAsync(user, loginRequest.Password, false))
            .ReturnsAsync(SignInResult.Success);

        _tokenServiceMock.Setup(x => x.GenerateJwtToken(user))
            .Returns("jwt-token");

        _tokenServiceMock.Setup(x => x.GenerateRefreshToken())
            .Returns("refresh-token");

        // Act
        var result = await _authService.LoginAsync(loginRequest);

        // Assert
        Assert.True(result.Success);
        Assert.Equal("Login successful", result.Message);
        Assert.Equal("jwt-token", result.Token);
        Assert.Equal("refresh-token", result.RefreshToken);
        Assert.NotNull(result.Expiration);
    }

    [Fact]
    public async Task LoginAsync_InvalidEmail_ReturnsFailure()
    {
        // Arrange
        var loginRequest = new LoginRequest
        {
            Email = "nonexistent@example.com",
            Password = "Password123!"
        };

        _userManagerMock.Setup(x => x.FindByEmailAsync(loginRequest.Email))
            .ReturnsAsync((User)null);

        // Act
        var result = await _authService.LoginAsync(loginRequest);

        // Assert
        Assert.False(result.Success);
        Assert.Equal("Invalid email or password", result.Message);
        Assert.Contains("User not found", result.Errors);
    }

    [Fact]
    public async Task RegisterAsync_ValidData_ReturnsSuccess()
    {
        // Arrange
        var registerRequest = new RegisterRequest
        {
            Email = "newuser@example.com",
            Password = "Password123!",
            ConfirmPassword = "Password123!",
            FirstName = "New",
            LastName = "User"
        };

        var user = new User
        {
            Email = registerRequest.Email,
            UserName = registerRequest.Email,
            FirstName = registerRequest.FirstName,
            LastName = registerRequest.LastName
        };

        _userManagerMock.Setup(x => x.CreateAsync(It.IsAny<User>(), registerRequest.Password))
            .ReturnsAsync(IdentityResult.Success);

        _tokenServiceMock.Setup(x => x.GenerateJwtToken(It.IsAny<User>()))
            .Returns("jwt-token");

        _tokenServiceMock.Setup(x => x.GenerateRefreshToken())
            .Returns("refresh-token");

        // Act
        var result = await _authService.RegisterAsync(registerRequest);

        // Assert
        Assert.True(result.Success);
        Assert.Equal("Registration successful", result.Message);
        Assert.Equal("jwt-token", result.Token);
        Assert.Equal("refresh-token", result.RefreshToken);
    }

    [Fact]
    public async Task RegisterAsync_InvalidData_ReturnsFailure()
    {
        // Arrange
        var registerRequest = new RegisterRequest
        {
            Email = "invalid-email",
            Password = "weak",
            ConfirmPassword = "weak",
            FirstName = "",
            LastName = ""
        };

        _userManagerMock.Setup(x => x.CreateAsync(It.IsAny<User>(), registerRequest.Password))
            .ReturnsAsync(IdentityResult.Failed(new IdentityError { Description = "Invalid data" }));

        // Act
        var result = await _authService.RegisterAsync(registerRequest);

        // Assert
        Assert.False(result.Success);
        Assert.Equal("Registration failed", result.Message);
        Assert.Contains("Invalid data", result.Errors);
    }
}