using System.Text.Json.Serialization;

namespace CommunityCar.Api.Models;

public class ErrorResponse
{
    [JsonPropertyName("success")]
    public bool Success { get; set; } = false;

    [JsonPropertyName("message")]
    public string Message { get; set; } = string.Empty;

    [JsonPropertyName("errors")]
    public IEnumerable<string>? Errors { get; set; }

    [JsonPropertyName("traceId")]
    public string? TraceId { get; set; }

    [JsonPropertyName("timestamp")]
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;

    public static ErrorResponse Create(string message, IEnumerable<string>? errors = null, string? traceId = null)
    {
        return new ErrorResponse
        {
            Message = message,
            Errors = errors,
            TraceId = traceId
        };
    }
}