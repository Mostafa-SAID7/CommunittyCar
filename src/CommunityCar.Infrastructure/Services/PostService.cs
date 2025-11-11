using CommunityCar.Application.DTOs.Community;
using CommunityCar.Application.Interfaces;
using CommunityCar.Domain.Entities;
using CommunityCar.Domain.Entities.Community;
using CommunityCar.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace CommunityCar.Infrastructure.Services;

public class PostService : IPostService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IRepository<Post> _postRepository;
    private readonly IRepository<PostVote> _postVoteRepository;
    private readonly IRepository<Forum> _forumRepository;

    public PostService(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
        _postRepository = _unitOfWork.Repository<Post>();
        _postVoteRepository = _unitOfWork.Repository<PostVote>();
        _forumRepository = _unitOfWork.Repository<Forum>();
    }

    public async Task<int> CreatePostAsync(CreatePostRequest request, string authorId)
    {
        // Validate forum exists and is active
        var forum = await _forumRepository.GetByIdAsync(request.ForumId);
        if (forum == null || !forum.IsActive)
            throw new ArgumentException("Invalid or inactive forum");

        var post = new Post
        {
            AuthorId = authorId,
            ForumId = request.ForumId,
            CategoryId = request.CategoryId,
            Title = request.Title,
            Content = request.Content,
            Tags = request.Tags
        };

        await _postRepository.AddAsync(post);
        await _unitOfWork.SaveChangesAsync();

        return post.Id;
    }

    public async Task<PostDto?> GetPostByIdAsync(int postId, string? userId = null)
    {
        var post = await _postRepository.GetAll()
            .Include(p => p.Author)
            .Include(p => p.Forum)
            .Include(p => p.Category)
            .Include(p => p.Comments.Where(c => !c.IsDeleted))
            .FirstOrDefaultAsync(p => p.Id == postId && !p.IsDeleted);

        if (post == null)
            return null;

        // Increment view count if user is viewing
        if (userId != null && post.AuthorId != userId)
        {
            post.ViewCount++;
            post.LastActivityAt = DateTime.UtcNow;
            _postRepository.Update(post);
            await _unitOfWork.SaveChangesAsync();
        }

        // Map to DTO (AutoMapper will handle this)
        return new PostDto
        {
            Id = post.Id,
            AuthorId = post.AuthorId,
            AuthorName = post.Author.FirstName + " " + post.Author.LastName,
            ForumId = post.ForumId,
            ForumName = post.Forum.Name,
            CategoryId = post.CategoryId,
            CategoryName = post.Category?.Name,
            Title = post.Title,
            Content = post.Content,
            Excerpt = post.Excerpt,
            IsPinned = post.IsPinned,
            IsLocked = post.IsLocked,
            IsFeatured = post.IsFeatured,
            ViewCount = post.ViewCount,
            UpvoteCount = post.UpvoteCount,
            DownvoteCount = post.DownvoteCount,
            CommentCount = post.CommentCount,
            AcceptedCommentId = post.AcceptedCommentId,
            Tags = post.Tags,
            IsApproved = post.IsApproved,
            CreatedAt = post.CreatedAt,
            UpdatedAt = post.UpdatedAt,
            LastActivityAt = post.LastActivityAt
        };
    }

    public async Task<IEnumerable<PostDto>> GetPostsByForumAsync(int forumId, int page = 1, int pageSize = 20)
    {
        var skip = (page - 1) * pageSize;

        var posts = await _postRepository.GetAll()
            .Include(p => p.Author)
            .Include(p => p.Forum)
            .Include(p => p.Category)
            .Where(p => p.ForumId == forumId && !p.IsDeleted && p.IsApproved)
            .OrderByDescending(p => p.IsPinned)
            .ThenByDescending(p => p.LastActivityAt ?? p.CreatedAt)
            .Skip(skip)
            .Take(pageSize)
            .Select(p => new PostDto
            {
                Id = p.Id,
                AuthorId = p.AuthorId,
                AuthorName = p.Author.FirstName + " " + p.Author.LastName,
                ForumId = p.ForumId,
                ForumName = p.Forum.Name,
                CategoryId = p.CategoryId,
                CategoryName = p.Category?.Name,
                Title = p.Title,
                Content = p.Content,
                Excerpt = p.Excerpt,
                IsPinned = p.IsPinned,
                IsLocked = p.IsLocked,
                IsFeatured = p.IsFeatured,
                ViewCount = p.ViewCount,
                UpvoteCount = p.UpvoteCount,
                DownvoteCount = p.DownvoteCount,
                CommentCount = p.CommentCount,
                AcceptedCommentId = p.AcceptedCommentId,
                Tags = p.Tags,
                IsApproved = p.IsApproved,
                CreatedAt = p.CreatedAt,
                UpdatedAt = p.UpdatedAt,
                LastActivityAt = p.LastActivityAt
            })
            .ToListAsync();

        return posts;
    }

    public async Task<IEnumerable<PostDto>> GetPostsByUserAsync(string userId, int page = 1, int pageSize = 20)
    {
        var skip = (page - 1) * pageSize;

        var posts = await _postRepository.GetAll()
            .Include(p => p.Author)
            .Include(p => p.Forum)
            .Include(p => p.Category)
            .Where(p => p.AuthorId == userId && !p.IsDeleted)
            .OrderByDescending(p => p.CreatedAt)
            .Skip(skip)
            .Take(pageSize)
            .Select(p => new PostDto
            {
                Id = p.Id,
                AuthorId = p.AuthorId,
                AuthorName = p.Author.FirstName + " " + p.Author.LastName,
                ForumId = p.ForumId,
                ForumName = p.Forum.Name,
                CategoryId = p.CategoryId,
                CategoryName = p.Category?.Name,
                Title = p.Title,
                Content = p.Content,
                Excerpt = p.Excerpt,
                IsPinned = p.IsPinned,
                IsLocked = p.IsLocked,
                IsFeatured = p.IsFeatured,
                ViewCount = p.ViewCount,
                UpvoteCount = p.UpvoteCount,
                DownvoteCount = p.DownvoteCount,
                CommentCount = p.CommentCount,
                AcceptedCommentId = p.AcceptedCommentId,
                Tags = p.Tags,
                IsApproved = p.IsApproved,
                CreatedAt = p.CreatedAt,
                UpdatedAt = p.UpdatedAt,
                LastActivityAt = p.LastActivityAt
            })
            .ToListAsync();

        return posts;
    }

    public async Task<bool> VotePostAsync(int postId, string userId, VoteType voteType)
    {
        var post = await _postRepository.GetByIdAsync(postId);
        if (post == null || post.IsDeleted)
            return false;

        var existingVote = await _postVoteRepository.GetAll()
            .FirstOrDefaultAsync(v => v.PostId == postId && v.UserId == userId);

        if (existingVote != null)
        {
            // Remove existing vote
            if (existingVote.VoteType == VoteType.Upvote)
                post.UpvoteCount--;
            else
                post.DownvoteCount--;

            _postVoteRepository.Delete(existingVote);

            // If same vote type, just remove the vote
            if (existingVote.VoteType == voteType)
            {
                _postRepository.Update(post);
                await _unitOfWork.SaveChangesAsync();
                return true;
            }
        }

        // Add new vote
        var newVote = new PostVote
        {
            PostId = postId,
            UserId = userId,
            VoteType = voteType
        };

        if (voteType == VoteType.Upvote)
            post.UpvoteCount++;
        else
            post.DownvoteCount++;

        await _postVoteRepository.AddAsync(newVote);
        _postRepository.Update(post);
        await _unitOfWork.SaveChangesAsync();

        return true;
    }

    public async Task<bool> UpdatePostAsync(int postId, string authorId, UpdatePostRequest request)
    {
        var post = await _postRepository.GetByIdAsync(postId);
        if (post == null || post.AuthorId != authorId || post.IsDeleted)
            return false;

        post.Title = request.Title;
        post.Content = request.Content;
        post.Tags = request.Tags;
        post.UpdateTimestamp();

        _postRepository.Update(post);
        await _unitOfWork.SaveChangesAsync();

        return true;
    }

    public async Task<bool> DeletePostAsync(int postId, string authorId)
    {
        var post = await _postRepository.GetByIdAsync(postId);
        if (post == null || post.AuthorId != authorId)
            return false;

        post.SoftDelete();
        _postRepository.Update(post);
        await _unitOfWork.SaveChangesAsync();

        return true;
    }

    public async Task<bool> PinPostAsync(int postId, string moderatorId, bool pin)
    {
        var post = await _postRepository.GetByIdAsync(postId);
        if (post == null || post.IsDeleted)
            return false;

        // TODO: Add moderator permission check
        post.IsPinned = pin;
        post.UpdateTimestamp();

        _postRepository.Update(post);
        await _unitOfWork.SaveChangesAsync();

        return true;
    }

    public async Task<bool> LockPostAsync(int postId, string moderatorId, bool @lock)
    {
        var post = await _postRepository.GetByIdAsync(postId);
        if (post == null || post.IsDeleted)
            return false;

        // TODO: Add moderator permission check
        post.IsLocked = @lock;
        post.UpdateTimestamp();

        _postRepository.Update(post);
        await _unitOfWork.SaveChangesAsync();

        return true;
    }
}