namespace Ecommerce.API.Contracts;

public sealed record CategoryResponse(Guid Id, string Name, string Slug, string? Description);

public sealed record ProductResponse(
    Guid Id,
    string Name,
    string Slug,
    string? Description,
    decimal Price,
    int Stock,
    string CategoryName,
    string CategorySlug);

public sealed record ProductDetailResponse(
    Guid Id,
    string Name,
    string Slug,
    string? Description,
    decimal Price,
    int Stock,
    string CategoryName,
    string CategorySlug);

public sealed record PagedProductsResponse(
    IReadOnlyList<ProductResponse> Items,
    int Page,
    int PageSize,
    int Total,
    int TotalPages);
