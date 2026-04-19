import { apiClient } from "@/lib/api/api-client";
import { CartItem } from "@/modules/carrito/types";
export type ShippingAddress = {
  fullName: string;
  addressLine1: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
};

export type OrderItemResponse = {
  productId: string;
  productName: string;
  productSlug: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
};
export type OrderSummaryResponse = {
  orderId: string;
  createdAtUtc: string;
  status: string;
  total: number;
    shippingAddress: ShippingAddress;
  itemCount: number;
};
export type OrderResponse = {
  orderId: string;
  createdAtUtc: string;
  status: string;
  total: number;
  items: OrderItemResponse[];
};

export async function createOrder(items: CartItem[], shippingAddress: ShippingAddress) {
    const response = await apiClient.post<OrderResponse>("/api/checkout/orders", {
    items: items.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
    })),
        shippingAddress,
  });

  return response.data;
}

export async function getMyOrders() {
  const response = await apiClient.get<OrderSummaryResponse[]>("/api/checkout/orders/me");
  return response.data;
}


export async function getOrderById(orderId: string) {
  const response = await apiClient.get<OrderResponse>(`/api/checkout/orders/${orderId}`);
  return response.data;
}
