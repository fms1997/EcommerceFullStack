namespace Ecommerce.API.Contracts;

public sealed record RegisterRequest(string FullName, string Email, string Password);

public sealed record LoginRequest(string Email, string Password);

public sealed record AuthUserResponse(Guid Id, string FullName, string Email, string Role);

public sealed record AuthResponse(
    string AccessToken,
    DateTime ExpiresAtUtc,
    AuthUserResponse User);
