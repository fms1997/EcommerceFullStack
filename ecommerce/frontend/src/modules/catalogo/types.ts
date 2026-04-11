export type Category = {
  id: string;
  name: string;
  slug: string;
  description?: string;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  categoryName: string;
  categorySlug: string;
  image?: string;
};

export type ProductFilters = {
  search: string;
  categorySlug: string;
  minPrice?: number;
  maxPrice?: number;
  page: number;
  pageSize: number;
};

export type ProductListResult = {
  products: Product[];
  total: number;
  totalPages: number;
  currentPage: number;
};
