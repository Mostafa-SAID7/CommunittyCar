using CommunityCar.Domain.Common;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CommunityCar.Domain.Entities.Community;

public class Comment : BaseEntity
{
    [Required]
    public string AuthorId { get; set; } = string.Empty;

    [ForeignKey("AuthorId")]
    public virtual User Author { get; set; } = null!;

    [Required]
    public int PostId { get; set; }

    [ForeignKey("PostId")]
    public virtual Post Post { get; set; } = null!;

    public int? ParentCommentId { get; set; }

    [ForeignKey("ParentCommentId")]
    public virtual Comment? ParentComment { get; set; }

    [Required]
    [MaxLength(5000)]
    public string Content { get; set; } = string.Empty;

    public bool IsAcceptedAnswer { get; set; } = false;

    public int UpvoteCount { get; set; } = 0;

    public int DownvoteCount { get; set; } = 0;

    public int ReplyCount { get; set; } = 0;

    // Moderation
    public bool IsApproved { get; set; } = true;

    public string? ModerationReason { get; set; }

    // Navigation properties
    public virtual ICollection<Comment> Replies { get; set; } = new List<Comment>();
    public virtual ICollection<CommentVote> Votes { get; set; } = new List<CommentVote>();
}