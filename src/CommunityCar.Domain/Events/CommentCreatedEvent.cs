using MediatR;

namespace CommunityCar.Domain.Events;

public class CommentCreatedEvent : INotification
{
    public int CommentId { get; }
    public int PostId { get; }
    public string AuthorId { get; }
    public string Content { get; }
    public DateTime CreatedAt { get; }

    public CommentCreatedEvent(int commentId, int postId, string authorId, string content, DateTime createdAt)
    {
        CommentId = commentId;
        PostId = postId;
        AuthorId = authorId;
        Content = content;
        CreatedAt = createdAt;
    }
}