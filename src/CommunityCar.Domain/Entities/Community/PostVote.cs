using CommunityCar.Domain.Common;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CommunityCar.Domain.Entities.Community;

public class PostVote : BaseEntity
{
    [Required]
    public string UserId { get; set; } = string.Empty;

    [ForeignKey("UserId")]
    public virtual User User { get; set; } = null!;

    [Required]
    public int PostId { get; set; }

    [ForeignKey("PostId")]
    public virtual Post Post { get; set; } = null!;

    [Required]
    public VoteType VoteType { get; set; } // Upvote or Downvote

    public DateTime? ExpiresAt { get; set; } // For temporary votes if needed
}

public enum VoteType
{
    Upvote = 1,
    Downvote = -1
}