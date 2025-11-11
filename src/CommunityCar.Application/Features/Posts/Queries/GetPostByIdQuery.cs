using CommunityCar.Application.DTOs.Community;
using MediatR;

namespace CommunityCar.Application.Features.Posts.Queries;

public class GetPostByIdQuery : IRequest<PostDto?>
{
    public int PostId { get; set; }
    public string? UserId { get; set; } // Optional, for tracking views
}