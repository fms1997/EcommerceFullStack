import { apiClient } from "@/lib/api/api-client";
import type { CartItem } from "@/modules/carrito/types";

type ApiCartItem = {
  productId: string;
  productSlug: string;
  productName: string;
  unitPrice: number;
  quantity: number;
  availableStock: number;
};

type ApiCartResponse = {
  items: ApiCartItem[];
};

function toCartItem(item: ApiCartItem): CartItem {
  return {
    productId: item.productId,
    slug: item.productSlug,
    name: item.productName,
    price: Number(item.unitPrice),
    quantity: item.quantity,
    stock: item.availableStock,
  };
}

export async function getServerCart(): Promise<CartItem[]> {
  const response = await apiClient.get<ApiCartResponse>("/api/cart");
  return response.data.items.map(toCartItem);
}

export async function addServerCartItem(productId: string, quantity = 1): Promise<CartItem[]> {
  const response = await apiClient.post<ApiCartResponse>("/api/cart/items", {
    productId,
    quantity,
  });

  return response.data.items.map(toCartItem);
}

export async function updateServerCartItem(productId: string, quantity: number): Promise<CartItem[]> {
  const response = await apiClient.patch<ApiCartResponse>(`/api/cart/items/${productId}`, {
    quantity,
  });

  return response.data.items.map(toCartItem);
}

export async function removeServerCartItem(productId: string): Promise<CartItem[]> {
  const response = await apiClient.delete<ApiCartResponse>(`/api/cart/items/${productId}`);
  return response.data.items.map(toCartItem);
}

export async function clearServerCart(): Promise<void> {
  await apiClient.delete("/api/cart");
}
