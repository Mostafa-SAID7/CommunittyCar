using CommunityCar.Application.DTOs.Profile;

namespace CommunityCar.Application.Interfaces;

public interface IProfileService
{
    Task<UserProfileDto?> GetProfileAsync(string userId);
    Task<UserProfileDto?> GetPublicProfileAsync(string userId);
    Task<UserProfileDto> CreateProfileAsync(string userId, UpdateProfileRequest request);
    Task<UserProfileDto?> UpdateProfileAsync(string userId, UpdateProfileRequest request);
    Task<bool> DeleteProfileAsync(string userId);
    Task<string?> UploadProfilePictureAsync(string userId, IFormFile file);
    Task<string?> UploadCoverPhotoAsync(string userId, IFormFile file);
    Task<bool> DeleteProfilePictureAsync(string userId);
    Task<bool> DeleteCoverPhotoAsync(string userId);
    Task<bool> ValidateProfileDataAsync(UpdateProfileRequest request);
}