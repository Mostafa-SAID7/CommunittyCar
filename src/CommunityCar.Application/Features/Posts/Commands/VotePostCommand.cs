using CommunityCar.Domain.Entities.Community;
using MediatR;

namespace CommunityCar.Application.Features.Posts.Commands;

public class VotePostCommand : IRequest<bool>
{
    public string UserId { get; set; } = string.Empty;
    public int PostId { get; set; }
    public VoteType VoteType { get; set; }
}