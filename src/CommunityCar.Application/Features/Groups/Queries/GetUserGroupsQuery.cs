using CommunityCar.Application.DTOs.Community;
using MediatR;

namespace CommunityCar.Application.Features.Groups.Queries;

public class GetUserGroupsQuery : IRequest<IEnumerable<GroupDto>>
{
    public string UserId { get; set; } = string.Empty;
}

public class GroupDto : IMapFrom<Domain.Entities.Community.Group>
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string OwnerId { get; set; } = string.Empty;
    public string OwnerName { get; set; } = string.Empty;
    public string? CoverImageUrl { get; set; }
    public Domain.Entities.Community.GroupPrivacy Privacy { get; set; }
    public int MemberCount { get; set; }
    public int EventCount { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? LastActivityAt { get; set; }

    public void Mapping(AutoMapper.Profile profile)
    {
        profile.CreateMap<Domain.Entities.Community.Group, GroupDto>()
            .ForMember(dest => dest.OwnerName,
                opt => opt.MapFrom(src => src.Owner.FirstName + " " + src.Owner.LastName));
    }
}