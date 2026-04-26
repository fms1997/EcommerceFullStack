using Ecommerce.API.Middleware;

namespace Ecommerce.Tests;

public class RequestMetricsStoreTests
{
    [Fact]
    public void Track_IncrementsTotalsAndRouteCounts()
    {
        var store = new RequestMetricsStore();

        store.Track("GET /api/catalog/products", 200);
        store.Track("GET /api/catalog/products", 500);

        var prometheus = store.ToPrometheus();

        Assert.Contains("ecommerce_http_requests_total 2", prometheus);
        Assert.Contains("ecommerce_http_failures_total 1", prometheus);
        Assert.Contains("ecommerce_http_requests_by_route_total{route=\"GET /api/catalog/products\"} 2", prometheus);
    }
}
