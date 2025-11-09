using CommunityCar.Application.DTOs.Profile;
using CommunityCar.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CommunityCar.Api.Controllers.Profile;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ProfileController : ControllerBase
{
    private readonly IProfileService _profileService;

    public ProfileController(IProfileService profileService)
    {
        _profileService = profileService;
    }

    [HttpGet("me")]
    public async Task<IActionResult> GetMyProfile()
    {
        var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId))
            return Unauthorized();

        var profile = await _profileService.GetProfileAsync(userId);
        if (profile == null)
            return NotFound("Profile not found");

        return Ok(profile);
    }

    [HttpGet("{userId}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetPublicProfile(string userId)
    {
        var profile = await _profileService.GetPublicProfileAsync(userId);
        if (profile == null)
            return NotFound("Profile not found or not public");

        return Ok(profile);
    }

    [HttpPost]
    public async Task<IActionResult> CreateProfile([FromBody] UpdateProfileRequest request)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId))
            return Unauthorized();

        // Validate profile data
        if (!await _profileService.ValidateProfileDataAsync(request))
            return BadRequest("Invalid profile data");

        try
        {
            var profile = await _profileService.CreateProfileAsync(userId, request);
            return CreatedAtAction(nameof(GetMyProfile), profile);
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(ex.Message);
        }
    }

    [HttpPut]
    public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileRequest request)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId))
            return Unauthorized();

        // Validate profile data
        if (!await _profileService.ValidateProfileDataAsync(request))
            return BadRequest("Invalid profile data");

        var profile = await _profileService.UpdateProfileAsync(userId, request);
        if (profile == null)
            return NotFound("Profile not found");

        return Ok(profile);
    }

    [HttpDelete]
    public async Task<IActionResult> DeleteProfile()
    {
        var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId))
            return Unauthorized();

        var result = await _profileService.DeleteProfileAsync(userId);
        if (!result)
            return NotFound("Profile not found");

        return NoContent();
    }

    [HttpPost("profile-picture")]
    public async Task<IActionResult> UploadProfilePicture(IFormFile file)
    {
        if (file == null || file.Length == 0)
            return BadRequest("No file uploaded");

        var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId))
            return Unauthorized();

        try
        {
            var imageUrl = await _profileService.UploadProfilePictureAsync(userId, file);
            return Ok(new { profilePictureUrl = imageUrl });
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPost("cover-photo")]
    public async Task<IActionResult> UploadCoverPhoto(IFormFile file)
    {
        if (file == null || file.Length == 0)
            return BadRequest("No file uploaded");

        var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId))
            return Unauthorized();

        try
        {
            var imageUrl = await _profileService.UploadCoverPhotoAsync(userId, file);
            return Ok(new { coverPhotoUrl = imageUrl });
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpDelete("profile-picture")]
    public async Task<IActionResult> DeleteProfilePicture()
    {
        var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId))
            return Unauthorized();

        var result = await _profileService.DeleteProfilePictureAsync(userId);
        if (!result)
            return NotFound("Profile picture not found");

        return NoContent();
    }

    [HttpDelete("cover-photo")]
    public async Task<IActionResult> DeleteCoverPhoto()
    {
        var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId))
            return Unauthorized();

        var result = await _profileService.DeleteCoverPhotoAsync(userId);
        if (!result)
            return NotFound("Cover photo not found");

        return NoContent();
    }
}