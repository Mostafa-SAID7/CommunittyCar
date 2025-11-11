using Microsoft.AspNetCore.SignalR;

namespace CommunityCar.Api.Hubs;

public class NotificationHub : Hub
{
    public async Task SendNotificationToUser(string userId, string message)
    {
        await Clients.User(userId).SendAsync("ReceiveNotification", message);
    }

    public async Task SendNotificationToAll(string message)
    {
        await Clients.All.SendAsync("ReceiveNotification", message);
    }

    public async Task JoinNotificationGroup(string userId)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, $"notifications_{userId}");
    }

    public async Task LeaveNotificationGroup(string userId)
    {
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"notifications_{userId}");
    }
}