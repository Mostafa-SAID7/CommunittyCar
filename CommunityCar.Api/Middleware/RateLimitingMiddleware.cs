using System.Collections.Concurrent;
using System.Net;

namespace CommunityCar.Api.Middleware;

public class RateLimitingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<RateLimitingMiddleware> _logger;
    private static readonly ConcurrentDictionary<string, ClientRequestInfo> _clients = new();

    public RateLimitingMiddleware(RequestDelegate next, ILogger<RateLimitingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        var ipAddress = context.Connection.RemoteIpAddress?.ToString() ?? "unknown";
        var clientInfo = _clients.GetOrAdd(ipAddress, new ClientRequestInfo());

        // Clean up old requests
        clientInfo.Requests.RemoveAll(r => r < DateTime.UtcNow.AddMinutes(-1));

        // Check rate limit (100 requests per minute)
        if (clientInfo.Requests.Count >= 100)
        {
            _logger.LogWarning("Rate limit exceeded for IP: {IpAddress}", ipAddress);
            context.Response.StatusCode = (int)HttpStatusCode.TooManyRequests;
            await context.Response.WriteAsync("Rate limit exceeded. Try again later.");
            return;
        }

        clientInfo.Requests.Add(DateTime.UtcNow);
        await _next(context);
    }
}

public class ClientRequestInfo
{
    public List<DateTime> Requests { get; } = new();
}