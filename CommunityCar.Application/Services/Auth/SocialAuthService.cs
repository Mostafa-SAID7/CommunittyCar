using CommunityCar.Application.DTOs.Auth;
using CommunityCar.Application.Services;
using CommunityCar.Domain.Entities.Auth;
using Microsoft.Extensions.Configuration;
using System.Net.Http;
using System.Text.Json;

namespace CommunityCar.Application.Services.Auth;

public class SocialAuthService
{
    private readonly HttpClient _httpClient;
    private readonly IConfiguration _configuration;

    public SocialAuthService(HttpClient httpClient, IConfiguration configuration)
    {
        _httpClient = httpClient;
        _configuration = configuration;
    }

    public async Task<SocialUserInfo?> ValidateGoogleTokenAsync(string accessToken)
    {
        try
        {
            var request = new HttpRequestMessage(HttpMethod.Get, "https://www.googleapis.com/oauth2/v2/userinfo");
            request.Headers.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", accessToken);

            var response = await _httpClient.SendAsync(request);
            if (!response.IsSuccessStatusCode)
                return null;

            var content = await response.Content.ReadAsStringAsync();
            var userInfo = JsonSerializer.Deserialize<GoogleUserInfo>(content);

            return new SocialUserInfo
            {
                Provider = "Google",
                ProviderId = userInfo?.Id ?? "",
                Email = userInfo?.Email ?? "",
                FirstName = userInfo?.GivenName ?? "",
                LastName = userInfo?.FamilyName ?? "",
                PictureUrl = userInfo?.Picture ?? ""
            };
        }
        catch
        {
            return null;
        }
    }

    public async Task<SocialUserInfo?> ValidateFacebookTokenAsync(string accessToken)
    {
        try
        {
            var request = new HttpRequestMessage(HttpMethod.Get, $"https://graph.facebook.com/me?fields=id,email,first_name,last_name,picture&access_token={accessToken}");
            var response = await _httpClient.SendAsync(request);

            if (!response.IsSuccessStatusCode)
                return null;

            var content = await response.Content.ReadAsStringAsync();
            var userInfo = JsonSerializer.Deserialize<FacebookUserInfo>(content);

            return new SocialUserInfo
            {
                Provider = "Facebook",
                ProviderId = userInfo?.Id ?? "",
                Email = userInfo?.Email ?? "",
                FirstName = userInfo?.FirstName ?? "",
                LastName = userInfo?.LastName ?? "",
                PictureUrl = userInfo?.Picture?.Data?.Url ?? ""
            };
        }
        catch
        {
            return null;
        }
    }
}

public class SocialUserInfo
{
    public string Provider { get; set; } = string.Empty;
    public string ProviderId { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string PictureUrl { get; set; } = string.Empty;
}

internal class GoogleUserInfo
{
    public string Id { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string GivenName { get; set; } = string.Empty;
    public string FamilyName { get; set; } = string.Empty;
    public string Picture { get; set; } = string.Empty;
}

internal class FacebookUserInfo
{
    public string Id { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public FacebookPicture Picture { get; set; } = new();
}

internal class FacebookPicture
{
    public FacebookPictureData Data { get; set; } = new();
}

internal class FacebookPictureData
{
    public string Url { get; set; } = string.Empty;
}