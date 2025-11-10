using System.Collections.Generic;

namespace CommunityCar.Domain.Exceptions;

public class ValidationException : Exception
{
    public IEnumerable<string> Errors { get; }

    public ValidationException(string message) : base(message)
    {
        Errors = new[] { message };
    }

    public ValidationException(IEnumerable<string> errors) : base("Validation failed")
    {
        Errors = errors;
    }

    public ValidationException(string message, IEnumerable<string> errors) : base(message)
    {
        Errors = errors;
    }
}