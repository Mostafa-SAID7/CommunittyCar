using CommunityCar.Application.DTOs.Profile;
using FluentValidation;

namespace CommunityCar.Application.Validators.Profile;

public class UpdateProfileRequestValidator : AbstractValidator<UpdateProfileRequest>
{
    public UpdateProfileRequestValidator()
    {
        RuleFor(x => x.FirstName)
            .NotEmpty().WithMessage("First name is required")
            .MaximumLength(50).WithMessage("First name must not exceed 50 characters")
            .Matches(@"^[a-zA-Z\s]+$").WithMessage("First name can only contain letters and spaces");

        RuleFor(x => x.LastName)
            .NotEmpty().WithMessage("Last name is required")
            .MaximumLength(50).WithMessage("Last name must not exceed 50 characters")
            .Matches(@"^[a-zA-Z\s]+$").WithMessage("Last name can only contain letters and spaces");

        RuleFor(x => x.PhoneNumber)
            .Matches(@"^\+?[1-9]\d{1,14}$").WithMessage("Invalid phone number format")
            .When(x => !string.IsNullOrEmpty(x.PhoneNumber));

        RuleFor(x => x.Bio)
            .MaximumLength(500).WithMessage("Bio must not exceed 500 characters")
            .When(x => !string.IsNullOrEmpty(x.Bio));

        RuleFor(x => x.Location)
            .MaximumLength(100).WithMessage("Location must not exceed 100 characters")
            .When(x => x.Location != null);

        RuleFor(x => x.Website)
            .Matches(@"^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$").WithMessage("Invalid website URL format")
            .When(x => !string.IsNullOrEmpty(x.Website));

        RuleFor(x => x.DateOfBirth)
            .LessThan(DateTime.Today.AddYears(-13)).WithMessage("You must be at least 13 years old")
            .GreaterThan(DateTime.Today.AddYears(-120)).WithMessage("Invalid date of birth")
            .When(x => x.DateOfBirth != null);

        RuleFor(x => x.Gender)
            .IsInEnum().WithMessage("Invalid gender value")
            .When(x => x.Gender != null);
    }
}