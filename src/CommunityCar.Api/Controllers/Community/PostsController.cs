using CommunityCar.Application.DTOs.Community;
using CommunityCar.Application.Features.Posts.Commands;
using CommunityCar.Application.Features.Posts.Queries;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CommunityCar.Api.Controllers.Community;

[ApiController]
[Route("api/community/[controller]")]
[Authorize]
public class PostsController : ControllerBase
{
    private readonly IMediator _mediator;

    public PostsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpPost]
    [ProducesResponseType(typeof(int), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> CreatePost([FromBody] CreatePostRequest request)
    {
        var command = new CreatePostCommand
        {
            AuthorId = User.Identity?.Name ?? string.Empty,
            ForumId = request.ForumId,
            CategoryId = request.CategoryId,
            Title = request.Title,
            Content = request.Content,
            Tags = request.Tags
        };

        var postId = await _mediator.Send(command);
        return CreatedAtAction(nameof(GetPost), new { id = postId }, postId);
    }

    [HttpGet("{id}")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(PostDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetPost(int id)
    {
        var query = new GetPostByIdQuery
        {
            PostId = id,
            UserId = User.Identity?.IsAuthenticated == true ? User.Identity.Name : null
        };

        var post = await _mediator.Send(query);
        if (post == null)
            return NotFound();

        return Ok(post);
    }

    [HttpPut("{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> UpdatePost(int id, [FromBody] UpdatePostRequest request)
    {
        // TODO: Implement UpdatePostCommand and handler
        // var command = new UpdatePostCommand
        // {
        //     PostId = id,
        //     AuthorId = User.Identity?.Name ?? string.Empty,
        //     Title = request.Title,
        //     Content = request.Content,
        //     Tags = request.Tags
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
    public async Task<IActionResult> DeletePost(int id)
    {
        // TODO: Implement DeletePostCommand and handler
        // var command = new DeletePostCommand
        // {
        //     PostId = id,
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
    public async Task<IActionResult> VotePost(int id, [FromBody] VotePostRequest request)
    {
        var command = new VotePostCommand
        {
            PostId = id,
            UserId = User.Identity?.Name ?? string.Empty,
            VoteType = request.VoteType
        };

        var result = await _mediator.Send(command);
        return result ? Ok() : BadRequest();
    }
}

public class VotePostRequest
{
    public Domain.Entities.Community.VoteType VoteType { get; set; }
}