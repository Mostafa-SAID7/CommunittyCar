using CommunityCar.Domain.Common;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CommunityCar.Domain.Entities.Community;

public class ReputationScore : BaseEntity
{
    [Required]
    public string UserId { get; set; } = string.Empty;

    [ForeignKey("UserId")]
    public virtual User User { get; set; } = null!;

    [Required]
    public int TotalScore { get; set; } = 0;

    public int PostsScore { get; set; } = 0;

    public int CommentsScore { get; set; } = 0;

    public int VotesReceivedScore { get; set; } = 0;

    public int ModerationScore { get; set; } = 0;

    public int BadgesScore { get; set; } = 0;

    [Required]
    public ReputationLevel Level { get; set; } = ReputationLevel.Newcomer;

    public DateTime? LastCalculatedAt { get; set; }

    // Activity counters
    public int TotalPosts { get; set; } = 0;

    public int TotalComments { get; set; } = 0;

    public int TotalUpvotesReceived { get; set; } = 0;

    public int TotalDownvotesReceived { get; set; } = 0;

    public int HelpfulAnswers { get; set; } = 0;

    public int AcceptedAnswers { get; set; } = 0;
}

public enum ReputationLevel
{
    Newcomer = 1,      // 0-99 points
    Contributor = 2,   // 100-499 points
    Expert = 3,        // 500-999 points
    Master = 4,        // 1000-2499 points
    Guru = 5,          // 2500-4999 points
    Legend = 6         // 5000+ points
}