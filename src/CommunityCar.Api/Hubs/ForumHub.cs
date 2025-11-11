using Microsoft.AspNetCore.SignalR;

namespace CommunityCar.Api.Hubs;

public class ForumHub : Hub
{
    public async Task JoinForum(int forumId)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, $"forum_{forumId}");
    }

    public async Task LeaveForum(int forumId)
    {
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"forum_{forumId}");
    }

    public async Task JoinPost(int postId)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, $"post_{postId}");
    }

    public async Task LeavePost(int postId)
    {
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"post_{postId}");
    }

    public async Task SendPostUpdate(int forumId, object postData)
    {
        await Clients.Group($"forum_{forumId}").SendAsync("PostUpdate", postData);
    }

    public async Task SendCommentUpdate(int postId, object commentData)
    {
        await Clients.Group($"post_{postId}").SendAsync("CommentUpdate", commentData);
    }

    public async Task SendVoteUpdate(int postId, object voteData)
    {
        await Clients.Group($"post_{postId}").SendAsync("VoteUpdate", voteData);
    }

    public async Task SendForumActivity(int forumId, string activityType, object activityData)
    {
        await Clients.Group($"forum_{forumId}").SendAsync("ForumActivity", activityType, activityData);
    }
}