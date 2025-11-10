using CommunityCar.Application.DTOs.Auth;
using FluentValidation;

namespace CommunityCar.Application.Validators.Auth;

public class OtpRequestValidator : AbstractValidator<OtpRequest>
{
    public OtpRequestValidator()
    {
        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("Email is required")
            .EmailAddress().WithMessage("Invalid email format");

        RuleFor(x => x.OtpCode)
            .NotEmpty().WithMessage("OTP code is required")
            .Length(6).WithMessage("OTP code must be exactly 6 digits")
            .Matches(@"^\d{6}$").WithMessage("OTP code must contain only digits");
    }
}