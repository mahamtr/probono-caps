namespace caps.Middleware;

public class LoggingMiddlware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<LoggingMiddlware> _logger;

    public LoggingMiddlware(RequestDelegate next, ILogger<LoggingMiddlware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        // Log the request details
        _logger.LogInformation($"Request: {context.Request.Method} {context.Request.Path}");

        // Log the request body (if applicable)
        if (context.Request.Body != null)
        {
            context.Request.EnableBuffering(); // Enable rewinding the request body stream
            var body = await new StreamReader(context.Request.Body).ReadToEndAsync();
            context.Request.Body.Position = 0; // Reset the stream position for further processing
            _logger.LogInformation($"Request Body: {body}");
        }

        // Call the next middleware in the pipeline
        await _next(context);
    }
}