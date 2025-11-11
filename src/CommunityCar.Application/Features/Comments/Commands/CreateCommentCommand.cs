using MediatR;

namespace CommunityCar.Application.Features.Comments.Commands;

public class CreateCommentCommand : IRequest<int>
{
    public string AuthorId { get; set; } = string.Empty;
    public int PostId { get; set; }
    public int? ParentCommentId { get; set; }
    public string Content { get; set; } = string.Empty;
}