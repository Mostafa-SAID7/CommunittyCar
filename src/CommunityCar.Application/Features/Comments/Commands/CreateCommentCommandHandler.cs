using CommunityCar.Application.DTOs.Community;
using CommunityCar.Application.Interfaces;
using MediatR;

namespace CommunityCar.Application.Features.Comments.Commands;

public class CreateCommentCommandHandler : IRequestHandler<CreateCommentCommand, int>
{
    private readonly ICommentService _commentService;

    public CreateCommentCommandHandler(ICommentService commentService)
    {
        _commentService = commentService;
    }

    public async Task<int> Handle(CreateCommentCommand request, CancellationToken cancellationToken)
    {
        var createRequest = new CreateCommentRequest
        {
            PostId = request.PostId,
            ParentCommentId = request.ParentCommentId,
            Content = request.Content
        };

        return await _commentService.CreateCommentAsync(createRequest, request.AuthorId);
    }
}