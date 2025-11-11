using CommunityCar.Application.Mappings;
using CommunityCar.Domain.Entities.Community;
using System.ComponentModel.DataAnnotations;

namespace CommunityCar.Application.DTOs.Community;

public class PostDto : IMapFrom<Post>
{
    public int Id { get; set; }
    public string AuthorId { get; set; } = string.Empty;
    public string AuthorName { get; set; } = string.Empty;
    public int ForumId { get; set; }
    public string ForumName { get; set; } = string.Empty;
    public int? CategoryId { get; set; }
    public string? CategoryName { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public string? Excerpt { get; set; }
    public bool IsPinned { get; set; }
    public bool IsLocked { get; set; }
    public bool IsFeatured { get; set; }
    public int ViewCount { get; set; }
    public int UpvoteCount { get; set; }
    public int DownvoteCount { get; set; }
    public int CommentCount { get; set; }
    public int? AcceptedCommentId { get; set; }
    public string? Tags { get; set; }
    public bool IsApproved { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public DateTime? LastActivityAt { get; set; }

    public void Mapping(AutoMapper.Profile profile)
    {
        profile.CreateMap<Post, PostDto>()
            .ForMember(dest => dest.AuthorName,
                opt => opt.MapFrom(src => src.Author.FirstName + " " + src.Author.LastName))
            .ForMember(dest => dest.ForumName,
                opt => opt.MapFrom(src => src.Forum.Name))
            .ForMember(dest => dest.CategoryName,
                opt => opt.MapFrom(src => src.Category != null ? src.Category.Name : null));
    }
}