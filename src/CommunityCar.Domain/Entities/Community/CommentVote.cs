using CommunityCar.Domain.Common;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CommunityCar.Domain.Entities.Community;

public class CommentVote : BaseEntity
{
    [Required]
    public string UserId { get; set; } = string.Empty;

    [ForeignKey("UserId")]
    public virtual User User { get; set; } = null!;

    [Required]
    public int CommentId { get; set; }

    [ForeignKey("CommentId")]
    public virtual Comment Comment { get; set; } = null!;

    [Required]
    public VoteType VoteType { get; set; } // Upvote or Downvote
}