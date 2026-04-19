using Ecommerce.API.Contracts;
using Ecommerce.API.Services;
using Ecommerce.Domain.Entities;
using Ecommerce.Infrastructure.Persistence;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Ecommerce.API.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController(EcommerceDbContext dbContext, IJwtTokenService jwtTokenService) : ControllerBase
{
    [HttpPost("register")]
    public async Task<ActionResult<AuthResponse>> Register(
        [FromBody] RegisterRequest request,
        CancellationToken cancellationToken = default)
    {
        var email = request.Email.Trim().ToLowerInvariant();

        if (string.IsNullOrWhiteSpace(request.FullName) || string.IsNullOrWhiteSpace(email) || string.IsNullOrWhiteSpace(request.Password))
        {
            return BadRequest("Nombre, email y contraseña son obligatorios.");
        }

        if (request.Password.Length < 6)
        {
            return BadRequest("La contraseña debe tener al menos 6 caracteres.");
        }

        var exists = await dbContext.Users
            .AsNoTracking()
            .AnyAsync(user => user.Email == email, cancellationToken);

        if (exists)
        {
            return Conflict("Ya existe un usuario con ese email.");
        }

        var user = new User
        {
            FullName = request.FullName.Trim(),
            Email = email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
            Role = "Customer",
            IsActive = true,
            CreatedAtUtc = DateTime.UtcNow
        };

        dbContext.Users.Add(user);
        await dbContext.SaveChangesAsync(cancellationToken);

        var (token, expiresAtUtc) = jwtTokenService.CreateToken(user);

        return Ok(new AuthResponse(
            token,
            expiresAtUtc,
            new AuthUserResponse(user.Id, user.FullName, user.Email, user.Role)));
    }

    [HttpPost("login")]
    public async Task<ActionResult<AuthResponse>> Login(
        [FromBody] LoginRequest request,
        CancellationToken cancellationToken = default)
    {
        var email = request.Email.Trim().ToLowerInvariant();

        var user = await dbContext.Users
            .FirstOrDefaultAsync(item => item.Email == email && item.IsActive, cancellationToken);

        if (user is null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
        {
            return Unauthorized("Credenciales inválidas.");
        }

        var (token, expiresAtUtc) = jwtTokenService.CreateToken(user);

        return Ok(new AuthResponse(
            token,
            expiresAtUtc,
            new AuthUserResponse(user.Id, user.FullName, user.Email, user.Role)));
    }
}
