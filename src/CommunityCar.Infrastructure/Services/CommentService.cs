using CommunityCar.Application.DTOs.Community;
using CommunityCar.Application.Interfaces;
using CommunityCar.Domain.Entities;
using CommunityCar.Domain.Entities.Community;
using CommunityCar.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace CommunityCar.Infrastructure.Services;

public class CommentService : ICommentService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IRepository<Comment> _commentRepository;
    private readonly IRepository<CommentVote> _commentVoteRepository;
    private readonly IRepository<Post> _postRepository;

    public CommentService(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
        _commentRepository = _unitOfWork.Repository<Comment>();
        _commentVoteRepository = _unitOfWork.Repository<CommentVote>();
        _postRepository = _unitOfWork.Repository<Post>();
    }

    public async Task<int> CreateCommentAsync(CreateCommentRequest request, string authorId)
    {
        // Validate post exists and is not locked
        var post = await _postRepository.GetByIdAsync(request.PostId);
        if (post == null || post.IsDeleted || post.IsLocked)
            throw new ArgumentException("Invalid or locked post");

        var comment = new Comment
        {
            AuthorId = authorId,
            PostId = request.PostId,
            ParentCommentId = request.ParentCommentId,
            Content = request.Content
        };

        await _commentRepository.AddAsync(comment);

        // Update post's comment count and last activity
        post.CommentCount++;
        post.LastActivityAt = DateTime.UtcNow;
        _postRepository.Update(post);

        await _unitOfWork.SaveChangesAsync();

        return comment.Id;
    }

    public async Task<CommentDto?> GetCommentByIdAsync(int commentId)
    {
        var comment = await _commentRepository.GetAll()
            .Include(c => c.Author)
            .Include(c => c.Replies.Where(r => !r.IsDeleted))
            .FirstOrDefaultAsync(c => c.Id == commentId && !c.IsDeleted);

        if (comment == null)
            return null;

        return new CommentDto
        {
            Id = comment.Id,
            AuthorId = comment.AuthorId,
            AuthorName = comment.Author.FirstName + " " + comment.Author.LastName,
            PostId = comment.PostId,
            ParentCommentId = comment.ParentCommentId,
            Content = comment.Content,
            IsAcceptedAnswer = comment.IsAcceptedAnswer,
            UpvoteCount = comment.UpvoteCount,
            DownvoteCount = comment.DownvoteCount,
            ReplyCount = comment.Replies.Count,
            IsApproved = comment.IsApproved,
            CreatedAt = comment.CreatedAt,
            UpdatedAt = comment.UpdatedAt
        };
    }

    public async Task<IEnumerable<CommentDto>> GetCommentsByPostAsync(int postId, int page = 1, int pageSize = 20)
    {
        var skip = (page - 1) * pageSize;

        var comments = await _commentRepository.GetAll()
            .Include(c => c.Author)
            .Include(c => c.Replies.Where(r => !r.IsDeleted))
            .Where(c => c.PostId == postId && c.ParentCommentId == null && !c.IsDeleted && c.IsApproved)
            .OrderBy(c => c.CreatedAt)
            .Skip(skip)
            .Take(pageSize)
            .Select(c => new CommentDto
            {
                Id = c.Id,
                AuthorId = c.AuthorId,
                AuthorName = c.Author.FirstName + " " + c.Author.LastName,
                PostId = c.PostId,
                ParentCommentId = c.ParentCommentId,
                Content = c.Content,
                IsAcceptedAnswer = c.IsAcceptedAnswer,
                UpvoteCount = c.UpvoteCount,
                DownvoteCount = c.DownvoteCount,
                ReplyCount = c.Replies.Count,
                IsApproved = c.IsApproved,
                CreatedAt = c.CreatedAt,
                UpdatedAt = c.UpdatedAt,
                Replies = c.Replies.Select(r => new CommentDto
                {
                    Id = r.Id,
                    AuthorId = r.AuthorId,
                    AuthorName = r.Author.FirstName + " " + r.Author.LastName,
                    PostId = r.PostId,
                    ParentCommentId = r.ParentCommentId,
                    Content = r.Content,
                    IsAcceptedAnswer = r.IsAcceptedAnswer,
                    UpvoteCount = r.UpvoteCount,
                    DownvoteCount = r.DownvoteCount,
                    ReplyCount = 0, // Nested replies not supported in this implementation
                    IsApproved = r.IsApproved,
                    CreatedAt = r.CreatedAt,
                    UpdatedAt = r.UpdatedAt
                }).ToList()
            })
            .ToListAsync();

        return comments;
    }

    public async Task<bool> VoteCommentAsync(int commentId, string userId, VoteType voteType)
    {
        var comment = await _commentRepository.GetByIdAsync(commentId);
        if (comment == null || comment.IsDeleted)
            return false;

        var existingVote = await _commentVoteRepository.GetAll()
            .FirstOrDefaultAsync(v => v.CommentId == commentId && v.UserId == userId);

        if (existingVote != null)
        {
            // Remove existing vote
            if (existingVote.VoteType == VoteType.Upvote)
                comment.UpvoteCount--;
            else
                comment.DownvoteCount--;

            _commentVoteRepository.Delete(existingVote);

            // If same vote type, just remove the vote
            if (existingVote.VoteType == voteType)
            {
                _commentRepository.Update(comment);
                await _unitOfWork.SaveChangesAsync();
                return true;
            }
        }

        // Add new vote
        var newVote = new CommentVote
        {
            CommentId = commentId,
            UserId = userId,
            VoteType = voteType
        };

        if (voteType == VoteType.Upvote)
            comment.UpvoteCount++;
        else
            comment.DownvoteCount++;

        await _commentVoteRepository.AddAsync(newVote);
        _commentRepository.Update(comment);
        await _unitOfWork.SaveChangesAsync();

        return true;
    }

    public async Task<bool> UpdateCommentAsync(int commentId, string authorId, UpdateCommentRequest request)
    {
        var comment = await _commentRepository.GetByIdAsync(commentId);
        if (comment == null || comment.AuthorId != authorId || comment.IsDeleted)
            return false;

        comment.Content = request.Content;
        comment.UpdateTimestamp();

        _commentRepository.Update(comment);
        await _unitOfWork.SaveChangesAsync();

        return true;
    }

    public async Task<bool> DeleteCommentAsync(int commentId, string authorId)
    {
        var comment = await _commentRepository.GetByIdAsync(commentId);
        if (comment == null || comment.AuthorId != authorId)
            return false;

        comment.SoftDelete();
        _commentRepository.Update(comment);

        // Update post's comment count
        var post = await _postRepository.GetByIdAsync(comment.PostId);
        if (post != null)
        {
            post.CommentCount = Math.Max(0, post.CommentCount - 1);
            _postRepository.Update(post);
        }

        await _unitOfWork.SaveChangesAsync();

        return true;
    }

    public async Task<bool> AcceptAnswerAsync(int commentId, string postAuthorId)
    {
        var comment = await _commentRepository.GetByIdAsync(commentId);
        if (comment == null || comment.IsDeleted)
            return false;

        // Verify the user is the post author
        var post = await _postRepository.GetByIdAsync(comment.PostId);
        if (post == null || post.AuthorId != postAuthorId)
            return false;

        // Remove existing accepted answer
        var existingAccepted = await _commentRepository.GetAll()
            .FirstOrDefaultAsync(c => c.PostId == comment.PostId && c.IsAcceptedAnswer);

        if (existingAccepted != null)
        {
            existingAccepted.IsAcceptedAnswer = false;
            _commentRepository.Update(existingAccepted);
        }

        // Set new accepted answer
        comment.IsAcceptedAnswer = true;
        _commentRepository.Update(comment);

        // Update post's accepted comment ID
        post.AcceptedCommentId = commentId;
        _postRepository.Update(post);

        await _unitOfWork.SaveChangesAsync();

        return true;
    }
}