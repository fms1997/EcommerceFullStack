//using System.ComponentModel.DataAnnotations;
//namespace Ecommerce.API.Contracts;

//public sealed record RegisterRequest(
//    [property: Required(ErrorMessage = "El nombre completo es obligatorio.")]
//    [property: StringLength(120, MinimumLength = 3, ErrorMessage = "El nombre completo debe tener entre 3 y 120 caracteres.")]
//    string FullName,

//    [property: Required(ErrorMessage = "El email es obligatorio.")]
//    [property: EmailAddress(ErrorMessage = "El email no tiene un formato válido.")]
//    string Email,

//    [property: Required(ErrorMessage = "La contraseña es obligatoria.")]
//    [property: StringLength(100, MinimumLength = 6, ErrorMessage = "La contraseña debe tener al menos 6 caracteres.")]
//    string Password);

//public sealed record LoginRequest(
//    [property: Required(ErrorMessage = "El email es obligatorio.")]
//    [property: EmailAddress(ErrorMessage = "El email no tiene un formato válido.")]
//    string Email,

//    [property: Required(ErrorMessage = "La contraseña es obligatoria.")]
//    string Password);

//public sealed record AuthUserResponse(Guid Id, string FullName, string Email, string Role);

//public sealed record AuthResponse(
//    string AccessToken,
//    DateTime ExpiresAtUtc,
//    AuthUserResponse User);






using System.ComponentModel.DataAnnotations;
namespace Ecommerce.API.Contracts;

public sealed record RegisterRequest(
    [param: Required(ErrorMessage = "El nombre completo es obligatorio.")]
    [param: StringLength(120, MinimumLength = 3, ErrorMessage = "El nombre completo debe tener entre 3 y 120 caracteres.")]
    string FullName,

    [param: Required(ErrorMessage = "El email es obligatorio.")]
    [param: EmailAddress(ErrorMessage = "El email no tiene un formato válido.")]
    string Email,

    [param: Required(ErrorMessage = "La contraseña es obligatoria.")]
    [param: StringLength(100, MinimumLength = 6, ErrorMessage = "La contraseña debe tener al menos 6 caracteres.")]
    string Password);

public sealed record LoginRequest(
    [param: Required(ErrorMessage = "El email es obligatorio.")]
    [param: EmailAddress(ErrorMessage = "El email no tiene un formato válido.")]
    string Email,

    [param: Required(ErrorMessage = "La contraseña es obligatoria.")]
    string Password);

public sealed record AuthUserResponse(Guid Id, string FullName, string Email, string Role);

public sealed record AuthResponse(
    string AccessToken,
    DateTime ExpiresAtUtc,
    AuthUserResponse User);