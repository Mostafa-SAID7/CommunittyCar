namespace CommunityCar.Api.Models;

public class ErrorResponse
{
    public string Message { get; set; } = string.Empty;
    public IEnumerable<string>? Errors { get; set; }
    public string TraceId { get; set; } = string.Empty;

    public static ErrorResponse Create(string message, IEnumerable<string>? errors, string traceId)
    {
        return new ErrorResponse
        {
            Message = message,
            Errors = errors,
            TraceId = traceId
        };
    }
}