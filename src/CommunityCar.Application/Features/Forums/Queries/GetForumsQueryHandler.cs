using CommunityCar.Application.DTOs.Community;
using CommunityCar.Domain.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CommunityCar.Application.Features.Forums.Queries;

public class GetForumsQueryHandler : IRequestHandler<GetForumsQuery, IEnumerable<ForumDto>>
{
    private readonly IRepository<Domain.Entities.Community.Forum> _forumRepository;

    public GetForumsQueryHandler(IRepository<Domain.Entities.Community.Forum> forumRepository)
    {
        _forumRepository = forumRepository;
    }

    public async Task<IEnumerable<ForumDto>> Handle(GetForumsQuery request, CancellationToken cancellationToken)
    {
        var forums = await _forumRepository.GetAll()
            .Where(f => !f.IsDeleted && f.IsActive)
            .Include(f => f.Categories.Where(c => !c.IsDeleted && c.IsActive))
            .Include(f => f.Posts.Where(p => !p.IsDeleted && p.IsApproved))
            .OrderBy(f => f.DisplayOrder)
            .Select(f => new ForumDto
            {
                Id = f.Id,
                Name = f.Name,
                Description = f.Description,
                IconUrl = f.IconUrl,
                DisplayOrder = f.DisplayOrder,
                IsActive = f.IsActive,
                PostCount = f.Posts.Count,
                LastActivityAt = f.Posts.Any() ? f.Posts.Max(p => p.LastActivityAt ?? p.CreatedAt) : null
            })
            .ToListAsync(cancellationToken);

        return forums;
    }
}