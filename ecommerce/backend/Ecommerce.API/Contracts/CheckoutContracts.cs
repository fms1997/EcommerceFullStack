namespace Ecommerce.API.Contracts;

public sealed record CreateOrderItemRequest(Guid ProductId, int Quantity);

//public sealed record CreateOrderRequest(IReadOnlyList<CreateOrderItemRequest> Items);
public sealed record ShippingAddressRequest(
    string FullName,
    string AddressLine1,
    string City,
    string State,
    string PostalCode,
    string Country,
    string? Phone);

public sealed record CreateOrderRequest(
    IReadOnlyList<CreateOrderItemRequest> Items,
    ShippingAddressRequest ShippingAddress);

public sealed record ShippingAddressResponse(
    string FullName,
    string AddressLine1,
    string City,
    string State,
    string PostalCode,
    string Country,
    string? Phone);

public sealed record OrderItemResponse(
    Guid ProductId,
    string ProductName,
    string ProductSlug,
    decimal UnitPrice,
    int Quantity,
    decimal LineTotal);
public sealed record OrderSummaryResponse(
    Guid OrderId,
    DateTime CreatedAtUtc,
    string Status,
    decimal Total,
    int ItemCount);
public sealed record CreateOrderResponse(
    Guid OrderId,
    DateTime CreatedAtUtc,
    string Status,
    decimal Total,
        ShippingAddressResponse ShippingAddress,
    IReadOnlyList<OrderItemResponse> Items);

public sealed record OrderDetailResponse(
    Guid OrderId,
    DateTime CreatedAtUtc,
    string Status,
    decimal Total,
        ShippingAddressResponse ShippingAddress,
    IReadOnlyList<OrderItemResponse> Items);
