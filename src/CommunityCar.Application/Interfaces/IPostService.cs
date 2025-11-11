using CommunityCar.Application.DTOs.Community;

namespace CommunityCar.Application.Interfaces;

public interface IPostService
{
    Task<int> CreatePostAsync(CreatePostRequest request, string authorId);
    Task<PostDto?> GetPostByIdAsync(int postId, string? userId = null);
    Task<IEnumerable<PostDto>> GetPostsByForumAsync(int forumId, int page = 1, int pageSize = 20);
    Task<IEnumerable<PostDto>> GetPostsByUserAsync(string userId, int page = 1, int pageSize = 20);
    Task<bool> VotePostAsync(int postId, string userId, Domain.Entities.Community.VoteType voteType);
    Task<bool> UpdatePostAsync(int postId, string authorId, UpdatePostRequest request);
    Task<bool> DeletePostAsync(int postId, string authorId);
    Task<bool> PinPostAsync(int postId, string moderatorId, bool pin);
    Task<bool> LockPostAsync(int postId, string moderatorId, bool @lock);
}