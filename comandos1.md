5) Crear el backend ASP.NET Core

Entrá a la raíz del proyecto y hacé:

mkdir backend
cd backend
dotnet new sln -n Ecommerce
dotnet new webapi -n Ecommerce.API

Ahora agregá el proyecto a la solución:

dotnet sln add Ecommerce.API/Ecommerce.API.csproj

  

6) Crear arquitectura por capas

Dentro de backend:

dotnet new classlib -n Ecommerce.Domain
dotnet new classlib -n Ecommerce.Application
dotnet new classlib -n Ecommerce.Infrastructure

Agregar a la solución:

dotnet sln add Ecommerce.Domain/Ecommerce.Domain.csproj
dotnet sln add Ecommerce.Application/Ecommerce.Application.csproj
dotnet sln add Ecommerce.Infrastructure/Ecommerce.Infrastructure.csproj



8) Instalar paquetes NuGet necesarios
 Ecommerce.API
dotnet add Ecommerce.API/Ecommerce.API.csproj package Swashbuckle.AspNetCore
dotnet add Ecommerce.API/Ecommerce.API.csproj package Microsoft.AspNetCore.OpenApi
En Ecommerce.Infrastructure
dotnet add Ecommerce.Infrastructure/Ecommerce.Infrastructure.csproj package Microsoft.EntityFrameworkCore
dotnet add Ecommerce.Infrastructure/Ecommerce.Infrastructure.csproj package Npgsql.EntityFrameworkCore.PostgreSQL
dotnet add Ecommerce.Infrastructure/Ecommerce.Infrastructure.csproj package Microsoft.EntityFrameworkCore.Design
dotnet add Ecommerce.Infrastructure/Ecommerce.Infrastructure.csproj package Microsoft.Extensions.Configuration.Abstractions
dotnet add Ecommerce.Infrastructure/Ecommerce.Infrastructure.csproj package Microsoft.Extensions.DependencyInjection.Abstractions
En Ecommerce.Application
dotnet add Ecommerce.Application/Ecommerce.Application.csproj package FluentValidation
dotnet add Ecommerce.Infrastructure/Ecommerce.Infrastructure.csproj package Microsoft.Extensions.Configuration
dotnet add Ecommerce.API/Ecommerce.API.csproj package Swashbuckle.AspNetCore --version 10.1.7

9) Estructura recomendada del backend
backend/
├── Ecommerce.API/
│   ├── Controllers/
│   ├── Extensions/
│   ├── Middlewares/
│   ├── Program.cs
│   └── appsettings.json
├── Ecommerce.Application/
│   ├── DTOs/
│   ├── Interfaces/
│   ├── Services/
│   └── Validators/
├── Ecommerce.Domain/
│   ├── Entities/
│   ├── Enums/
│   └── Common/
├── Ecommerce.Infrastructure/
│   ├── Persistence/
│   │   ├── Configurations/
│   │   └── EcommerceDbContext.cs
│   ├── Repositories/
│   └── DependencyInjection.cs
└── Ecommerce.sln



15) Instalar herramienta de migraciones
dotnet tool update --global dotnet-ef


16) Crear la primera migración

Desde la carpeta backend:

dotnet ef migrations add InitialCreate --project Ecommerce.Infrastructure/Ecommerce.Infrastructure.csproj --startup-project Ecommerce.API/Ecommerce.API.csproj --output-dir Persistence/Migrations

Y para aplicar la migración:
dotnet ef database update
dotnet ef database update --project Ecommerce.Infrastructure/Ecommerce.Infrastructure.csproj --startup-project Ecommerce.API/Ecommerce.API.csproj

dotnet ef database update --project Ecommerce.Infrastructure/Ecommerce.Infrastructure.csproj --startup-project Ecommerce.API/Ecommerce.API.csproj

dotnet ef migrations add InitialCreate --project Ecommerce.Infrastructure/Ecommerce.Infrastructure.csproj --startup-project Ecommerce.API/Ecommerce.API.csproj --output-dir Persistence/Migrations




26) Probar el levantamiento
docker compose up --build