using CommunityCar.Application.DTOs.Community;
using CommunityCar.Application.Interfaces;
using MediatR;

namespace CommunityCar.Application.Features.Posts.Commands;

public class CreatePostCommandHandler : IRequestHandler<CreatePostCommand, int>
{
    private readonly IPostService _postService;

    public CreatePostCommandHandler(IPostService postService)
    {
        _postService = postService;
    }

    public async Task<int> Handle(CreatePostCommand request, CancellationToken cancellationToken)
    {
        var createRequest = new CreatePostRequest
        {
            ForumId = request.ForumId,
            CategoryId = request.CategoryId,
            Title = request.Title,
            Content = request.Content,
            Tags = request.Tags
        };

        return await _postService.CreatePostAsync(createRequest, request.AuthorId);
    }
}