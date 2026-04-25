namespace Ecommerce.API.Middleware;

public sealed class RequestMetricsMiddleware(RequestDelegate next, RequestMetricsStore metricsStore)
{
    public async Task InvokeAsync(HttpContext context)
    {
        await next(context);

        var route = context.GetEndpoint()?.DisplayName ?? context.Request.Path.Value ?? "unknown";
        metricsStore.Track(route, context.Response.StatusCode);
    }
}
