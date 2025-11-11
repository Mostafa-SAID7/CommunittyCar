using CommunityCar.Application.DTOs.Community;
using CommunityCar.Application.Features.Comments.Commands;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CommunityCar.Api.Controllers.Community;

[ApiController]
[Route("api/community/[controller]")]
[Authorize]
public class CommentsController : ControllerBase
{
    private readonly IMediator _mediator;

    public CommentsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpPost]
    [ProducesResponseType(typeof(int), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> CreateComment([FromBody] CreateCommentRequest request)
    {
        var command = new CreateCommentCommand
        {
            AuthorId = User.Identity?.Name ?? string.Empty,
            PostId = request.PostId,
            ParentCommentId = request.ParentCommentId,
            Content = request.Content
        };

        var commentId = await _mediator.Send(command);
        return CreatedAtAction(nameof(GetComment), new { id = commentId }, commentId);
    }

    [HttpGet("{id}")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(CommentDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetComment(int id)
    {
        // TODO: Implement GetCommentByIdQuery
        // var query = new GetCommentByIdQuery { CommentId = id };
        // var comment = await _mediator.Send(query);
        // if (comment == null)
        //     return NotFound();
        // return Ok(comment);
        return NotImplemented();
    }

    [HttpGet("post/{postId}")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(IEnumerable<CommentDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetCommentsByPost(int postId, [FromQuery] int page = 1, [FromQuery] int pageSize = 20)
    {
        // TODO: Implement GetCommentsByPostQuery
        // var query = new GetCommentsByPostQuery
        // {
        //     PostId = postId,
        //     Page = page,
        //     PageSize = pageSize
        // };
        // var comments = await _mediator.Send(query);
        // return Ok(comments);
        return NotImplemented();
    }

    [HttpPut("{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> UpdateComment(int id, [FromBody] UpdateCommentRequest request)
    {
        // TODO: Implement UpdateCommentCommand
        // var command = new UpdateCommentCommand
        // {
        //     CommentId = id,
        //     AuthorId = User.Identity?.Name ?? string.Empty,
        //     Content = request.Content
        // };

        // var result = await _mediator.Send(command);
        // if (!result)
        //     return NotFound();

        return NoContent();
    }

    [HttpDelete("{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DeleteComment(int id)
    {
        // TODO: Implement DeleteCommentCommand
        // var command = new DeleteCommentCommand
        // {
        //     CommentId = id,
        //     AuthorId = User.Identity?.Name ?? string.Empty
        // };

        // var result = await _mediator.Send(command);
        // if (!result)
        //     return NotFound();

        return NoContent();
    }

    [HttpPost("{id}/vote")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> VoteComment(int id, [FromBody] VoteCommentRequest request)
    {
        // TODO: Implement VoteCommentCommand
        // var command = new VoteCommentCommand
        // {
        //     CommentId = id,
        //     UserId = User.Identity?.Name ?? string.Empty,
        //     VoteType = request.VoteType
        // };

        // var result = await _mediator.Send(command);
        // return result ? Ok() : BadRequest();
        return NotImplemented();
    }

    [HttpPost("{id}/accept")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> AcceptAnswer(int id)
    {
        // TODO: Implement AcceptAnswerCommand
        // var command = new AcceptAnswerCommand
        // {
        //     CommentId = id,
        //     PostAuthorId = User.Identity?.Name ?? string.Empty
        // };

        // var result = await _mediator.Send(command);
        // return result ? Ok() : Forbid();
        return NotImplemented();
    }
}

public class VoteCommentRequest
{
    public Domain.Entities.Community.VoteType VoteType { get; set; }
}