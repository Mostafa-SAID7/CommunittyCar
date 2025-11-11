using CommunityCar.Application.DTOs.Notifications;
using FluentValidation;

namespace CommunityCar.Application.Validators.Notifications;

public class CreateNotificationRequestValidator : AbstractValidator<CreateNotificationRequest>
{
    public CreateNotificationRequestValidator()
    {
        RuleFor(x => x.UserId)
            .NotEmpty().WithMessage("User ID is required");

        RuleFor(x => x.Title)
            .NotEmpty().WithMessage("Title is required")
            .MaximumLength(200).WithMessage("Title must not exceed 200 characters");

        RuleFor(x => x.Message)
            .NotEmpty().WithMessage("Message is required")
            .MaximumLength(1000).WithMessage("Message must not exceed 1000 characters");

        RuleFor(x => x.Type)
            .NotEmpty().WithMessage("Type is required")
            .MaximumLength(50).WithMessage("Type must not exceed 50 characters");

        RuleFor(x => x.ActionUrl)
            .MaximumLength(500).WithMessage("Action URL must not exceed 500 characters")
            .When(x => !string.IsNullOrEmpty(x.ActionUrl));

        RuleFor(x => x.RelatedEntityType)
            .MaximumLength(100).WithMessage("Related entity type must not exceed 100 characters")
            .When(x => !string.IsNullOrEmpty(x.RelatedEntityType));

        RuleFor(x => x.RelatedEntityId)
            .MaximumLength(50).WithMessage("Related entity ID must not exceed 50 characters")
            .When(x => !string.IsNullOrEmpty(x.RelatedEntityId));
    }
}