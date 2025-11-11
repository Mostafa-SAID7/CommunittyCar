using CommunityCar.Application.DTOs.Chat;
using FluentValidation;

namespace CommunityCar.Application.Validators.Chat;

public class SendChatMessageRequestValidator : AbstractValidator<SendChatMessageRequest>
{
    public SendChatMessageRequestValidator()
    {
        RuleFor(x => x.SenderId)
            .NotEmpty().WithMessage("Sender ID is required");

        RuleFor(x => x.ReceiverId)
            .NotEmpty().WithMessage("Receiver ID is required")
            .NotEqual(x => x.SenderId).WithMessage("Sender and receiver cannot be the same");

        RuleFor(x => x.Message)
            .NotEmpty().WithMessage("Message is required")
            .MaximumLength(2000).WithMessage("Message must not exceed 2000 characters");

        RuleFor(x => x.MessageType)
            .MaximumLength(50).WithMessage("Message type must not exceed 50 characters")
            .When(x => !string.IsNullOrEmpty(x.MessageType));

        RuleFor(x => x.AttachmentUrl)
            .MaximumLength(500).WithMessage("Attachment URL must not exceed 500 characters")
            .When(x => !string.IsNullOrEmpty(x.AttachmentUrl));

        RuleFor(x => x.ConversationId)
            .MaximumLength(100).WithMessage("Conversation ID must not exceed 100 characters")
            .When(x => !string.IsNullOrEmpty(x.ConversationId));
    }
}