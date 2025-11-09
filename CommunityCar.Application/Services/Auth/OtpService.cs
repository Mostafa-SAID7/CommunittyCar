using CommunityCar.Application.Services;
using System.Security.Cryptography;

namespace CommunityCar.Application.Services.Auth;

public class OtpService
{
    private const int OtpLength = 6;
    private const int OtpExpiryMinutes = 5;

    public string GenerateOtp()
    {
        using var rng = RandomNumberGenerator.Create();
        var bytes = new byte[4];
        rng.GetBytes(bytes);
        var otp = BitConverter.ToUInt32(bytes, 0) % 1000000;
        return otp.ToString().PadLeft(OtpLength, '0');
    }

    public bool ValidateOtp(string providedOtp, string storedOtp, DateTime otpExpiry)
    {
        return providedOtp == storedOtp && otpExpiry > DateTime.UtcNow;
    }

    public DateTime GetOtpExpiry()
    {
        return DateTime.UtcNow.AddMinutes(OtpExpiryMinutes);
    }
}