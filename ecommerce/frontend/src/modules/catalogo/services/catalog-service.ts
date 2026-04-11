import { apiClient } from "@/lib/api/api-client";
import { mockCategories, mockProducts } from "../data/mock-catalog-data";
import { Category, Product, ProductFilters, ProductListResult } from "../types";

type ApiPagedProducts = {
  items: Product[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

function normalize(value?: string) {
  return (value ?? "").trim().toLowerCase();
}

export async function getCategories(): Promise<Category[]> {
  try {
    const response = await apiClient.get<Category[]>("/api/catalog/categories");
    return response.data;
  } catch {
    return mockCategories;
  }
}

export async function getProducts(filters: ProductFilters): Promise<ProductListResult> {
  try {
    const response = await apiClient.get<ApiPagedProducts>("/api/catalog/products", {
      params: {
        search: filters.search?.trim() || undefined,
        category: filters.categorySlug || undefined,
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
        page: filters.page,
        pageSize: filters.pageSize,
      },
    });

    return {
      products: response.data.items,
      total: response.data.total,
      totalPages: response.data.totalPages,
      currentPage: response.data.page,
    };
  } catch {
    const category = mockCategories.find((item) => item.slug === filters.categorySlug);

    const filtered = mockProducts.filter((product) => {
      const matchesSearch =
        !filters.search ||
        normalize(product.name).includes(normalize(filters.search)) ||
        normalize(product.description).includes(normalize(filters.search));

      const matchesCategory = !category || product.categorySlug === category.slug;
      const matchesMinPrice = filters.minPrice === undefined || product.price >= filters.minPrice;
      const matchesMaxPrice = filters.maxPrice === undefined || product.price <= filters.maxPrice;

      return matchesSearch && matchesCategory && matchesMinPrice && matchesMaxPrice;
    });

    const total = filtered.length;
    const totalPages = Math.max(1, Math.ceil(total / filters.pageSize));
    const currentPage = Math.min(Math.max(1, filters.page), totalPages);
    const start = (currentPage - 1) * filters.pageSize;

    return {
      products: filtered.slice(start, start + filters.pageSize),
      total,
      totalPages,
      currentPage,
    };
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const response = await apiClient.get<Product>(`/api/catalog/products/${slug}`);
    return response.data;
  } catch {
    return mockProducts.find((item) => item.slug === slug) ?? null;
  }
}
