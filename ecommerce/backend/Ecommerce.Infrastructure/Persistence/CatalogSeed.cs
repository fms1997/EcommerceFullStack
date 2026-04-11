using Ecommerce.Domain.Entities;

namespace Ecommerce.Infrastructure.Persistence;

public static class CatalogSeed
{
    public static async Task SeedAsync(EcommerceDbContext dbContext, CancellationToken cancellationToken = default)
    {
        if (dbContext.Categories.Any() || dbContext.Products.Any())
        {
            return;
        }

        var categories = new[]
        {
            new Category { Name = "Electrónica", Slug = "electronica", Description = "Gadgets y tecnología", IsActive = true },
            new Category { Name = "Hogar", Slug = "hogar", Description = "Productos para tu casa", IsActive = true },
            new Category { Name = "Deportes", Slug = "deportes", Description = "Equipamiento deportivo", IsActive = true },
            new Category { Name = "Moda", Slug = "moda", Description = "Ropa y accesorios", IsActive = true },
        };

        dbContext.Categories.AddRange(categories);
        await dbContext.SaveChangesAsync(cancellationToken);

        var bySlug = categories.ToDictionary(c => c.Slug, c => c.Id);

        var products = new[]
        {
            new Product { Name = "Auriculares inalámbricos Pro", Slug = "auriculares-inalambricos-pro", Description = "Sonido envolvente y cancelación de ruido.", Price = 149.90m, Stock = 30, CategoryId = bySlug["electronica"], IsActive = true },
            new Product { Name = "Smartwatch Active X", Slug = "smartwatch-active-x", Description = "Monitoreo de salud y GPS.", Price = 199.00m, Stock = 15, CategoryId = bySlug["electronica"], IsActive = true },
            new Product { Name = "Cafetera automática 15 bar", Slug = "cafetera-automatica-15-bar", Description = "Espresso rápido y cremoso.", Price = 129.50m, Stock = 22, CategoryId = bySlug["hogar"], IsActive = true },
            new Product { Name = "Licuadora multifunción 1200W", Slug = "licuadora-multifuncion-1200w", Description = "Potencia y versatilidad diaria.", Price = 89.99m, Stock = 18, CategoryId = bySlug["hogar"], IsActive = true },
            new Product { Name = "Mancuernas ajustables 20kg", Slug = "mancuernas-ajustables-20kg", Description = "Entrena fuerza en casa.", Price = 159.00m, Stock = 12, CategoryId = bySlug["deportes"], IsActive = true },
            new Product { Name = "Esterilla yoga premium", Slug = "esterilla-yoga-premium", Description = "Superficie antideslizante.", Price = 42.00m, Stock = 40, CategoryId = bySlug["deportes"], IsActive = true },
            new Product { Name = "Chaqueta impermeable urbana", Slug = "chaqueta-impermeable-urbana", Description = "Protección contra lluvia y viento.", Price = 119.00m, Stock = 20, CategoryId = bySlug["moda"], IsActive = true },
            new Product { Name = "Zapatillas running Fly", Slug = "zapatillas-running-fly", Description = "Comodidad y retorno de energía.", Price = 94.50m, Stock = 27, CategoryId = bySlug["moda"], IsActive = true },
            new Product { Name = "Teclado mecánico RGB", Slug = "teclado-mecanico-rgb", Description = "Switches táctiles y RGB.", Price = 79.00m, Stock = 33, CategoryId = bySlug["electronica"], IsActive = true },
            new Product { Name = "Organizador modular de cocina", Slug = "organizador-modular-de-cocina", Description = "Ordena mejor tus espacios.", Price = 36.75m, Stock = 55, CategoryId = bySlug["hogar"], IsActive = true },
            new Product { Name = "Bicicleta estática compacta", Slug = "bicicleta-estatica-compacta", Description = "Cardio diario en casa.", Price = 249.00m, Stock = 9, CategoryId = bySlug["deportes"], IsActive = true },
            new Product { Name = "Mochila casual minimal", Slug = "mochila-casual-minimal", Description = "Cómoda y funcional.", Price = 58.00m, Stock = 44, CategoryId = bySlug["moda"], IsActive = true },
        };

        dbContext.Products.AddRange(products);
        await dbContext.SaveChangesAsync(cancellationToken);
    }
}
