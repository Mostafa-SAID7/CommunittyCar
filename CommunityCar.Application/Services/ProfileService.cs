using CommunityCar.Application.DTOs.Profile;
using CommunityCar.Application.Interfaces;
using CommunityCar.Domain.Entities;
using CommunityCar.Domain.Entities.Profile;
using CommunityCar.Infrastructure.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace CommunityCar.Application.Services;

public class ProfileService : IProfileService
{
    private readonly ApplicationDbContext _context;
    private readonly UserManager<User> _userManager;
    private readonly IWebHostEnvironment _environment;

    public ProfileService(
        ApplicationDbContext context,
        UserManager<User> userManager,
        IWebHostEnvironment environment)
    {
        _context = context;
        _userManager = userManager;
        _environment = environment;
    }

    public async Task<UserProfileDto?> GetProfileAsync(string userId)
    {
        var profile = await _context.UserProfiles
            .Include(p => p.User)
            .FirstOrDefaultAsync(p => p.UserId == userId);

        if (profile == null)
            return null;

        return MapToDto(profile);
    }

    public async Task<UserProfileDto?> GetPublicProfileAsync(string userId)
    {
        var profile = await _context.UserProfiles
            .Include(p => p.User)
            .FirstOrDefaultAsync(p => p.UserId == userId && p.IsPublic);

        if (profile == null)
            return null;

        var dto = MapToDto(profile);

        // Hide sensitive information for public profiles
        if (!profile.ShowEmail)
            dto.UserEmail = null;

        if (!profile.ShowPhone)
            dto.PhoneNumber = null;

        return dto;
    }

    public async Task<UserProfileDto> CreateProfileAsync(string userId, UpdateProfileRequest request)
    {
        var user = await _userManager.FindByIdAsync(userId);
        if (user == null)
            throw new ArgumentException("User not found");

        var existingProfile = await _context.UserProfiles
            .FirstOrDefaultAsync(p => p.UserId == userId);

        if (existingProfile != null)
            throw new InvalidOperationException("Profile already exists");

        var profile = new UserProfile
        {
            UserId = userId,
            DisplayName = request.DisplayName ?? $"{user.FirstName} {user.LastName}",
            Bio = request.Bio,
            PhoneNumber = request.PhoneNumber,
            DateOfBirth = request.DateOfBirth,
            Gender = request.Gender,
            Address = request.Address,
            City = request.City,
            State = request.State,
            ZipCode = request.ZipCode,
            Country = request.Country,
            Website = request.Website,
            Occupation = request.Occupation,
            Company = request.Company,
            IsPublic = request.IsPublic,
            ShowEmail = request.ShowEmail,
            ShowPhone = request.ShowPhone,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _context.UserProfiles.Add(profile);
        await _context.SaveChangesAsync();

        return MapToDto(profile);
    }

    public async Task<UserProfileDto?> UpdateProfileAsync(string userId, UpdateProfileRequest request)
    {
        var profile = await _context.UserProfiles
            .Include(p => p.User)
            .FirstOrDefaultAsync(p => p.UserId == userId);

        if (profile == null)
            return null;

        // Update properties
        profile.DisplayName = request.DisplayName ?? profile.DisplayName;
        profile.Bio = request.Bio ?? profile.Bio;
        profile.PhoneNumber = request.PhoneNumber ?? profile.PhoneNumber;
        profile.DateOfBirth = request.DateOfBirth ?? profile.DateOfBirth;
        profile.Gender = request.Gender ?? profile.Gender;
        profile.Address = request.Address ?? profile.Address;
        profile.City = request.City ?? profile.City;
        profile.State = request.State ?? profile.State;
        profile.ZipCode = request.ZipCode ?? profile.ZipCode;
        profile.Country = request.Country ?? profile.Country;
        profile.Website = request.Website ?? profile.Website;
        profile.Occupation = request.Occupation ?? profile.Occupation;
        profile.Company = request.Company ?? profile.Company;
        profile.IsPublic = request.IsPublic;
        profile.ShowEmail = request.ShowEmail;
        profile.ShowPhone = request.ShowPhone;
        profile.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return MapToDto(profile);
    }

    public async Task<bool> DeleteProfileAsync(string userId)
    {
        var profile = await _context.UserProfiles
            .FirstOrDefaultAsync(p => p.UserId == userId);

        if (profile == null)
            return false;

        _context.UserProfiles.Remove(profile);
        await _context.SaveChangesAsync();

        return true;
    }

    public async Task<string?> UploadProfilePictureAsync(string userId, IFormFile file)
    {
        if (file == null || file.Length == 0)
            return null;

        // Validate file type
        var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif" };
        var extension = Path.GetExtension(file.FileName).ToLowerInvariant();

        if (!allowedExtensions.Contains(extension))
            throw new ArgumentException("Invalid file type. Only JPG, PNG, and GIF are allowed.");

        // Validate file size (5MB max)
        if (file.Length > 5 * 1024 * 1024)
            throw new ArgumentException("File size cannot exceed 5MB.");

        var profile = await _context.UserProfiles
            .FirstOrDefaultAsync(p => p.UserId == userId);

        if (profile == null)
            throw new ArgumentException("Profile not found");

        // Create uploads directory if it doesn't exist
        var uploadsDir = Path.Combine(_environment.WebRootPath ?? "wwwroot", "uploads", "profiles");
        Directory.CreateDirectory(uploadsDir);

        // Generate unique filename
        var fileName = $"{userId}_profile_{DateTime.UtcNow:yyyyMMddHHmmss}{extension}";
        var filePath = Path.Combine(uploadsDir, fileName);

        // Save file
        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

        // Delete old profile picture if exists
        if (!string.IsNullOrEmpty(profile.ProfilePictureUrl))
        {
            var oldFileName = Path.GetFileName(profile.ProfilePictureUrl);
            var oldFilePath = Path.Combine(uploadsDir, oldFileName);
            if (File.Exists(oldFilePath))
            {
                File.Delete(oldFilePath);
            }
        }

        // Update profile
        profile.ProfilePictureUrl = $"/uploads/profiles/{fileName}";
        profile.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return profile.ProfilePictureUrl;
    }

    public async Task<string?> UploadCoverPhotoAsync(string userId, IFormFile file)
    {
        if (file == null || file.Length == 0)
            return null;

        // Validate file type
        var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif" };
        var extension = Path.GetExtension(file.FileName).ToLowerInvariant();

        if (!allowedExtensions.Contains(extension))
            throw new ArgumentException("Invalid file type. Only JPG, PNG, and GIF are allowed.");

        // Validate file size (10MB max for cover photos)
        if (file.Length > 10 * 1024 * 1024)
            throw new ArgumentException("File size cannot exceed 10MB.");

        var profile = await _context.UserProfiles
            .FirstOrDefaultAsync(p => p.UserId == userId);

        if (profile == null)
            throw new ArgumentException("Profile not found");

        // Create uploads directory if it doesn't exist
        var uploadsDir = Path.Combine(_environment.WebRootPath ?? "wwwroot", "uploads", "covers");
        Directory.CreateDirectory(uploadsDir);

        // Generate unique filename
        var fileName = $"{userId}_cover_{DateTime.UtcNow:yyyyMMddHHmmss}{extension}";
        var filePath = Path.Combine(uploadsDir, fileName);

        // Save file
        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

        // Delete old cover photo if exists
        if (!string.IsNullOrEmpty(profile.CoverPhotoUrl))
        {
            var oldFileName = Path.GetFileName(profile.CoverPhotoUrl);
            var oldFilePath = Path.Combine(uploadsDir, oldFileName);
            if (File.Exists(oldFilePath))
            {
                File.Delete(oldFilePath);
            }
        }

        // Update profile
        profile.CoverPhotoUrl = $"/uploads/covers/{fileName}";
        profile.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return profile.CoverPhotoUrl;
    }

    public async Task<bool> DeleteProfilePictureAsync(string userId)
    {
        var profile = await _context.UserProfiles
            .FirstOrDefaultAsync(p => p.UserId == userId);

        if (profile == null || string.IsNullOrEmpty(profile.ProfilePictureUrl))
            return false;

        // Delete file
        var fileName = Path.GetFileName(profile.ProfilePictureUrl);
        var filePath = Path.Combine(_environment.WebRootPath ?? "wwwroot", "uploads", "profiles", fileName);

        if (File.Exists(filePath))
        {
            File.Delete(filePath);
        }

        // Update profile
        profile.ProfilePictureUrl = null;
        profile.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return true;
    }

    public async Task<bool> DeleteCoverPhotoAsync(string userId)
    {
        var profile = await _context.UserProfiles
            .FirstOrDefaultAsync(p => p.UserId == userId);

        if (profile == null || string.IsNullOrEmpty(profile.CoverPhotoUrl))
            return false;

        // Delete file
        var fileName = Path.GetFileName(profile.CoverPhotoUrl);
        var filePath = Path.Combine(_environment.WebRootPath ?? "wwwroot", "uploads", "covers", fileName);

        if (File.Exists(filePath))
        {
            File.Delete(filePath);
        }

        // Update profile
        profile.CoverPhotoUrl = null;
        profile.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return true;
    }

    public async Task<bool> ValidateProfileDataAsync(UpdateProfileRequest request)
    {
        // Validate date of birth (must be at least 13 years old)
        if (request.DateOfBirth.HasValue)
        {
            var age = DateTime.UtcNow.Year - request.DateOfBirth.Value.Year;
            if (request.DateOfBirth.Value.Date > DateTime.UtcNow.AddYears(-age))
                age--;

            if (age < 13)
                return false;
        }

        // Validate website URL format
        if (!string.IsNullOrEmpty(request.Website) &&
            !Uri.TryCreate(request.Website, UriKind.Absolute, out _))
        {
            return false;
        }

        return true;
    }

    private UserProfileDto MapToDto(UserProfile profile)
    {
        return new UserProfileDto
        {
            Id = profile.Id,
            UserId = profile.UserId,
            DisplayName = profile.DisplayName,
            Bio = profile.Bio,
            PhoneNumber = profile.PhoneNumber,
            DateOfBirth = profile.DateOfBirth,
            Gender = profile.Gender,
            Address = profile.Address,
            City = profile.City,
            State = profile.State,
            ZipCode = profile.ZipCode,
            Country = profile.Country,
            Website = profile.Website,
            Occupation = profile.Occupation,
            Company = profile.Company,
            ProfilePictureUrl = profile.ProfilePictureUrl,
            CoverPhotoUrl = profile.CoverPhotoUrl,
            IsPublic = profile.IsPublic,
            ShowEmail = profile.ShowEmail,
            ShowPhone = profile.ShowPhone,
            CreatedAt = profile.CreatedAt,
            UpdatedAt = profile.UpdatedAt,
            FullAddress = profile.FullAddress,
            Age = profile.Age,
            UserEmail = profile.User?.Email,
            UserFirstName = profile.User?.FirstName,
            UserLastName = profile.User?.LastName,
            UserFullName = profile.User?.FullName
        };
    }
}