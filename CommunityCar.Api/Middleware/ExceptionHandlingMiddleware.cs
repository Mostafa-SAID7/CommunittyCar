using CommunityCar.Api.Models;
using CommunityCar.Domain.Exceptions;
using System.Net;
using System.Text.Json;

namespace CommunityCar.Api.Middleware;

public class ExceptionHandlingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionHandlingMiddleware> _logger;

    public ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An unhandled exception occurred");
            await HandleExceptionAsync(context, ex);
        }
    }

    private async Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        context.Response.ContentType = "application/json";

        var traceId = context.TraceIdentifier;
        ErrorResponse errorResponse;

        switch (exception)
        {
            case BadRequestException badRequestEx:
                context.Response.StatusCode = (int)HttpStatusCode.BadRequest;
                errorResponse = ErrorResponse.Create(badRequestEx.Message, null, traceId);
                break;

            case NotFoundException notFoundEx:
                context.Response.StatusCode = (int)HttpStatusCode.NotFound;
                errorResponse = ErrorResponse.Create(notFoundEx.Message, null, traceId);
                break;

            case UnauthorizedException unauthorizedEx:
                context.Response.StatusCode = (int)HttpStatusCode.Unauthorized;
                errorResponse = ErrorResponse.Create(unauthorizedEx.Message, null, traceId);
                break;

            case ValidationException validationEx:
                context.Response.StatusCode = (int)HttpStatusCode.BadRequest;
                errorResponse = ErrorResponse.Create(validationEx.Message, validationEx.Errors, traceId);
                break;

            case FluentValidation.ValidationException fluentValidationEx:
                context.Response.StatusCode = (int)HttpStatusCode.BadRequest;
                var errors = fluentValidationEx.Errors.Select(e => e.ErrorMessage);
                errorResponse = ErrorResponse.Create("Validation failed", errors, traceId);
                break;

            default:
                context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                errorResponse = ErrorResponse.Create("An unexpected error occurred", null, traceId);
                break;
        }

        await context.Response.WriteAsync(JsonSerializer.Serialize(errorResponse));
    }
}