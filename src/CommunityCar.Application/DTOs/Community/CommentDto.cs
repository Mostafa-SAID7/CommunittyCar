using CommunityCar.Application.Mappings;
using CommunityCar.Domain.Entities.Community;

namespace CommunityCar.Application.DTOs.Community;

public class CommentDto : IMapFrom<Comment>
{
    public int Id { get; set; }
    public string AuthorId { get; set; } = string.Empty;
    public string AuthorName { get; set; } = string.Empty;
    public int PostId { get; set; }
    public int? ParentCommentId { get; set; }
    public string Content { get; set; } = string.Empty;
    public bool IsAcceptedAnswer { get; set; }
    public int UpvoteCount { get; set; }
    public int DownvoteCount { get; set; }
    public int ReplyCount { get; set; }
    public bool IsApproved { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }

    // For nested comments
    public IEnumerable<CommentDto>? Replies { get; set; }

    public void Mapping(AutoMapper.Profile profile)
    {
        profile.CreateMap<Comment, CommentDto>()
            .ForMember(dest => dest.AuthorName,
                opt => opt.MapFrom(src => src.Author.FirstName + " " + src.Author.LastName))
            .ForMember(dest => dest.Replies,
                opt => opt.MapFrom(src => src.Replies.Where(r => !r.IsDeleted)));
    }
}