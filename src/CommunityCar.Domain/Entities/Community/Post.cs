using CommunityCar.Domain.Common;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CommunityCar.Domain.Entities.Community;

public class Post : BaseEntity
{
    [Required]
    public string AuthorId { get; set; } = string.Empty;

    [ForeignKey("AuthorId")]
    public virtual User Author { get; set; } = null!;

    [Required]
    public int ForumId { get; set; }

    [ForeignKey("ForumId")]
    public virtual Forum Forum { get; set; } = null!;

    public int? CategoryId { get; set; }

    [ForeignKey("CategoryId")]
    public virtual ForumCategory? Category { get; set; }

    [Required]
    [MaxLength(300)]
    public string Title { get; set; } = string.Empty;

    [Required]
    [MaxLength(10000)]
    public string Content { get; set; } = string.Empty;

    [MaxLength(500)]
    public string? Excerpt { get; set; }

    public bool IsPinned { get; set; } = false;

    public bool IsLocked { get; set; } = false;

    public bool IsFeatured { get; set; } = false;

    public int ViewCount { get; set; } = 0;

    public int UpvoteCount { get; set; } = 0;

    public int DownvoteCount { get; set; } = 0;

    public int CommentCount { get; set; } = 0;

    public int? AcceptedCommentId { get; set; }

    [MaxLength(100)]
    public string? Tags { get; set; } // Comma-separated tags

    // Moderation
    public bool IsApproved { get; set; } = true;

    public string? ModerationReason { get; set; }

    public DateTime? LastActivityAt { get; set; }

    // Navigation properties
    public virtual ICollection<Comment> Comments { get; set; } = new List<Comment>();
    public virtual ICollection<PostVote> Votes { get; set; } = new List<PostVote>();
    public virtual ICollection<PostTag> PostTags { get; set; } = new List<PostTag>();
}