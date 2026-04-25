using Microsoft.AspNetCore.Mvc;
namespace Ecommerce.API.Controllers;
public sealed class CorrelationIdMiddleware(RequestDelegate next)
{
    public const string HeaderName = "X-Correlation-Id";

    [ApiController]
    [Route("api/health")]
    public sealed class HealthController : ControllerBase
    {
        [HttpGet]
        public IActionResult Get()
        {
            return Ok(new
            {
                status = "ok",
                service = "Ecommerce.API",
                timestampUtc = DateTime.UtcNow
            });
        }
    }
}
