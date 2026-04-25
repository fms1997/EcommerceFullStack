using System.Collections.Concurrent;

namespace Ecommerce.API.Middleware;

public sealed class RequestMetricsStore
{
    private long _totalRequests;
    private long _totalFailures;
    private readonly ConcurrentDictionary<string, long> _byRoute = new();

    public void Track(string route, int statusCode)
    {
        Interlocked.Increment(ref _totalRequests);
        _byRoute.AddOrUpdate(route, 1, (_, current) => current + 1);

        if (statusCode >= 500)
        {
            Interlocked.Increment(ref _totalFailures);
        }
    }

    public string ToPrometheus()
    {
        var lines = new List<string>
        {
            "# HELP ecommerce_http_requests_total Total HTTP requests.",
            "# TYPE ecommerce_http_requests_total counter",
            $"ecommerce_http_requests_total {Interlocked.Read(ref _totalRequests)}",
            "# HELP ecommerce_http_failures_total Total HTTP 5xx responses.",
            "# TYPE ecommerce_http_failures_total counter",
            $"ecommerce_http_failures_total {Interlocked.Read(ref _totalFailures)}"
        };

        lines.Add("# HELP ecommerce_http_requests_by_route_total Total requests grouped by route.");
        lines.Add("# TYPE ecommerce_http_requests_by_route_total counter");

        foreach (var (route, count) in _byRoute.OrderBy(pair => pair.Key))
        {
            lines.Add($"ecommerce_http_requests_by_route_total{{route=\"{route}\"}} {count}");
        }

        return string.Join("\n", lines);
    }
}
