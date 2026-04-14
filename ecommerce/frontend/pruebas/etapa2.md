# Guía paso a paso para probar la Fase 2 (Catálogo)

Esta guía valida la **Fase 2** del proyecto: categorías, filtros, paginación y detalle de producto.

## 1) Levantar servicios

Desde la raíz:

```bash
cd ecommerce
docker compose up --build -d
```

Verificá estado:

```bash
docker compose ps
```

Esperado:
- `ecommerce_postgres` en estado `running`
- `ecommerce_backend` en estado `running`
- `ecommerce_frontend` en estado `running`

## 2) Verificar backend (Swagger)

Abrí:
- http://localhost:8080/swagger

Debe aparecer la API con endpoints de catálogo.

## 3) Validar endpoint de categorías

```bash
curl -s http://localhost:8080/api/catalog/categories | jq
```

Esperado:
- Lista no vacía.
- Cada categoría con: `id`, `name`, `slug`, `description`.

## 4) Validar endpoint de productos (sin filtros)

```bash
curl -s "http://localhost:8080/api/catalog/products?page=1&pageSize=6" | jq
```

Esperado:
- Objeto con `items`, `page`, `pageSize`, `total`, `totalPages`.
- `items` debe traer máximo 6 productos.

## 5) Probar búsqueda por texto

```bash
curl -s "http://localhost:8080/api/catalog/products?search=cam&page=1&pageSize=6" | jq
```

Esperado:
- Menos resultados o igual que sin filtros.
- Productos cuyo nombre o descripción contenga el término (case-insensitive).

## 6) Probar filtro por categoría

Primero elegí un `slug` válido de categorías (por ejemplo `ropa`).

```bash
curl -s "http://localhost:8080/api/catalog/products?category=ropa&page=1&pageSize=6" | jq
```

Esperado:
- Todos los productos con `categorySlug = ropa`.

## 7) Probar rango de precio

```bash
curl -s "http://localhost:8080/api/catalog/products?minPrice=10&maxPrice=100&page=1&pageSize=6" | jq
```

Esperado:
- Productos con precio dentro del rango.

## 8) Probar paginación

```bash
curl -s "http://localhost:8080/api/catalog/products?page=1&pageSize=2" | jq
curl -s "http://localhost:8080/api/catalog/products?page=2&pageSize=2" | jq
```

Esperado:
- Cambian los elementos de `items` entre página 1 y 2.
- `totalPages` consistente con `total` y `pageSize`.

## 9) Probar detalle por slug

Tomá un `slug` de algún producto de los pasos anteriores.

```bash
curl -s "http://localhost:8080/api/catalog/products/<slug-valido>" | jq
```

Esperado:
- Producto completo (incluye categoría).

Caso no existente:

```bash
curl -i "http://localhost:8080/api/catalog/products/slug-que-no-existe"
```

Esperado:
- `HTTP/1.1 404 Not Found`.

## 10) Validar frontend

Abrí:
- http://localhost:3000
- Click en **Ir al catálogo** o abrí http://localhost:3000/catalogo

Checklist manual en UI:
- Se listan categorías.
- Buscar por texto actualiza resultados.
- Filtro por categoría funciona.
- Filtro mínimo/máximo de precio funciona.
- Paginación (siguiente/anterior) cambia productos.
- Click en producto abre detalle `/catalogo/[slug]`.
- Botón **Limpiar filtros** reinicia búsqueda.

## 11) Comprobar fallback mock (opcional)

Si apagás backend, el frontend usa datos mock:

```bash
docker compose stop backend
```

Recargá `/catalogo`.

Esperado:
- La UI sigue mostrando productos/categorías (mock data).

Luego volver a levantar backend:

```bash
docker compose start backend
```

## 12) Cerrar entorno

```bash
docker compose down
```

Si querés limpiar volumen de DB:

```bash
docker compose down -v
```

---

## Troubleshooting rápido

- Si `curl ... | jq` falla, instalá `jq` o quitá `| jq`.
- Si frontend no conecta al backend, revisá que backend esté en `http://localhost:8080`.
- Si no aparecen datos, revisá logs:

```bash
docker compose logs backend --tail=200
docker compose logs frontend --tail=200
docker compose logs postgres --tail=200
```
