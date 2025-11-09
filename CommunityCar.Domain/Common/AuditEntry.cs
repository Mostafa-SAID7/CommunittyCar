using System.Text.Json;

namespace CommunityCar.Domain.Common;

public class AuditEntry
{
    public string TableName { get; set; } = string.Empty;
    public string Action { get; set; } = string.Empty; // INSERT, UPDATE, DELETE
    public string EntityId { get; set; } = string.Empty;
    public string EntityType { get; set; } = string.Empty;
    public string UserId { get; set; } = string.Empty;
    public string UserName { get; set; } = string.Empty;
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;
    public string? OldValues { get; set; } // JSON serialized
    public string? NewValues { get; set; } // JSON serialized
    public string? ChangedColumns { get; set; } // JSON serialized array
    public string? IpAddress { get; set; }
    public string? UserAgent { get; set; }

    public void SetOldValues(object? values)
    {
        OldValues = values != null ? JsonSerializer.Serialize(values) : null;
    }

    public void SetNewValues(object? values)
    {
        NewValues = values != null ? JsonSerializer.Serialize(values) : null;
    }

    public void SetChangedColumns(IEnumerable<string> columns)
    {
        ChangedColumns = JsonSerializer.Serialize(columns);
    }

    public IEnumerable<string>? GetChangedColumns()
    {
        return ChangedColumns != null
            ? JsonSerializer.Deserialize<IEnumerable<string>>(ChangedColumns)
            : null;
    }
}