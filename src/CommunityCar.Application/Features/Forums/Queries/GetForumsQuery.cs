using CommunityCar.Application.DTOs.Community;
using MediatR;

namespace CommunityCar.Application.Features.Forums.Queries;

public class GetForumsQuery : IRequest<IEnumerable<ForumDto>>
{
}

public class ForumDto : IMapFrom<Domain.Entities.Community.Forum>
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string? IconUrl { get; set; }
    public int DisplayOrder { get; set; }
    public bool IsActive { get; set; }
    public int PostCount { get; set; }
    public DateTime? LastActivityAt { get; set; }

    public void Mapping(AutoMapper.Profile profile)
    {
        profile.CreateMap<Domain.Entities.Community.Forum, ForumDto>();
    }
}