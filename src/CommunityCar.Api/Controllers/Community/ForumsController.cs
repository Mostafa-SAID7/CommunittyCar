using CommunityCar.Application.DTOs.Community;
using CommunityCar.Application.Features.Forums.Queries;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CommunityCar.Api.Controllers.Community;

[ApiController]
[Route("api/community/[controller]")]
public class ForumsController : ControllerBase
{
    private readonly IMediator _mediator;

    public ForumsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    [AllowAnonymous]
    [ProducesResponseType(typeof(IEnumerable<ForumDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetForums()
    {
        var query = new GetForumsQuery();
        var forums = await _mediator.Send(query);
        return Ok(forums);
    }

    [HttpGet("{id}")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(ForumDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetForum(int id)
    {
        // TODO: Implement GetForumByIdQuery
        // var query = new GetForumByIdQuery { ForumId = id };
        // var forum = await _mediator.Send(query);
        // if (forum == null)
        //     return NotFound();
        // return Ok(forum);
        return NotImplemented();
    }

    [HttpGet("{forumId}/posts")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(IEnumerable<PostDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetForumPosts(int forumId, [FromQuery] int page = 1, [FromQuery] int pageSize = 20)
    {
        // TODO: Implement GetPostsByForumQuery
        // var query = new GetPostsByForumQuery
        // {
        //     ForumId = forumId,
        //     Page = page,
        //     PageSize = pageSize
        // };
        // var posts = await _mediator.Send(query);
        // return Ok(posts);
        return NotImplemented();
    }

    [HttpGet("{forumId}/categories")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(IEnumerable<ForumCategoryDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetForumCategories(int forumId)
    {
        // TODO: Implement GetForumCategoriesQuery
        // var query = new GetForumCategoriesQuery { ForumId = forumId };
        // var categories = await _mediator.Send(query);
        // return Ok(categories);
        return NotImplemented();
    }
}

public class ForumCategoryDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public int DisplayOrder { get; set; }
    public bool IsActive { get; set; }
}