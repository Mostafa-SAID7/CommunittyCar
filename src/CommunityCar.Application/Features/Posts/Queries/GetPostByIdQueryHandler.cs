using CommunityCar.Application.DTOs.Community;
using CommunityCar.Application.Interfaces;
using MediatR;

namespace CommunityCar.Application.Features.Posts.Queries;

public class GetPostByIdQueryHandler : IRequestHandler<GetPostByIdQuery, PostDto?>
{
    private readonly IPostService _postService;

    public GetPostByIdQueryHandler(IPostService postService)
    {
        _postService = postService;
    }

    public async Task<PostDto?> Handle(GetPostByIdQuery request, CancellationToken cancellationToken)
    {
        return await _postService.GetPostByIdAsync(request.PostId, request.UserId);
    }
}