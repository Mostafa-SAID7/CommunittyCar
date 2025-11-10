using CommunityCar.Application.DTOs.Auth;
using FluentValidation;

namespace CommunityCar.Application.Validators.Auth;

public class LoginRequestValidator : AbstractValidator<LoginRequest>
{
    public LoginRequestValidator()
    {
        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("Email is required")
            .EmailAddress().WithMessage("Invalid email format");

        RuleFor(x => x.Password)
            .NotEmpty().WithMessage("Password is required")
            .MinimumLength(8).WithMessage("Password must be at least 8 characters long");

        When(x => x.RememberMe, () =>
        {
            RuleFor(x => x.RememberMe)
                .Equal(true).WithMessage("Remember me must be explicitly set to true");
        });
    }
}