using Microsoft.AspNetCore.SignalR;

namespace CommunityCar.Api.Hubs;

public class ChatHub : Hub
{
    public async Task SendMessageToUser(string receiverId, string message, string senderId)
    {
        await Clients.User(receiverId).SendAsync("ReceiveMessage", message, senderId);
    }

    public async Task SendMessageToGroup(string groupName, string message, string senderId)
    {
        await Clients.Group(groupName).SendAsync("ReceiveMessage", message, senderId);
    }

    public async Task JoinChatGroup(string groupName)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, groupName);
    }

    public async Task LeaveChatGroup(string groupName)
    {
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, groupName);
    }

    public async Task JoinPrivateChat(string userId1, string userId2)
    {
        var groupName = GetConversationGroupName(userId1, userId2);
        await Groups.AddToGroupAsync(Context.ConnectionId, groupName);
    }

    public async Task LeavePrivateChat(string userId1, string userId2)
    {
        var groupName = GetConversationGroupName(userId1, userId2);
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, groupName);
    }

    private string GetConversationGroupName(string userId1, string userId2)
    {
        var ids = new[] { userId1, userId2 }.OrderBy(id => id).ToArray();
        return $"chat_{ids[0]}_{ids[1]}";
    }
}