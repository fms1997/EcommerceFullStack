using System.ComponentModel.DataAnnotations;

namespace Ecommerce.API.Contracts;

public sealed record AddCartItemRequest(
    [property: Required(ErrorMessage = "El ProductId es obligatorio.")]
    Guid ProductId,

    [property: Range(1, 1000, ErrorMessage = "La cantidad debe estar entre 1 y 1000.")]
    int Quantity = 1);

public sealed record UpdateCartItemRequest(
    [property: Range(1, 1000, ErrorMessage = "La cantidad debe estar entre 1 y 1000.")]
    int Quantity);

public sealed record CartItemResponse(
    Guid ProductId,
    string ProductSlug,
    string ProductName,
    decimal UnitPrice,
    int Quantity,
    int AvailableStock,
    decimal LineTotal);

public sealed record CartResponse(
    Guid CartId,
    Guid UserId,
    DateTime UpdatedAtUtc,
    IReadOnlyList<CartItemResponse> Items,
    int TotalItems,
    decimal TotalAmount);
