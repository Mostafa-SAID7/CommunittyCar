using CommunityCar.Domain.Common;
using MediatR;

namespace CommunityCar.Domain.Events;

public class PostCreatedEvent : INotification
{
    public int PostId { get; }
    public string AuthorId { get; }
    public string Title { get; }
    public int ForumId { get; }
    public DateTime CreatedAt { get; }

    public PostCreatedEvent(int postId, string authorId, string title, int forumId, DateTime createdAt)
    {
        PostId = postId;
        AuthorId = authorId;
        Title = title;
        ForumId = forumId;
        CreatedAt = createdAt;
    }
}