using MediatR;

namespace CommunityCar.Application.Features.Posts.Commands;

public class CreatePostCommand : IRequest<int>
{
    public string AuthorId { get; set; } = string.Empty;
    public int ForumId { get; set; }
    public int? CategoryId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public string? Tags { get; set; }
}