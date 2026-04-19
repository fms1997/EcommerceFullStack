"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { CartItem, CartProductInput } from "@/modules/carrito/types";

type CartContextValue = {
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
  addItem: (product: CartProductInput) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
};

const CART_STORAGE_KEY = "ecommerce_cart_items";

const CartContext = createContext<CartContextValue | undefined>(undefined);

// ✅ FUNCIÓN CORREGIDA
function sanitizeCartItems(rawItems: unknown): CartItem[] {
  if (!Array.isArray(rawItems)) {
    return [];
  }

  return rawItems
    .filter((item): item is CartItem => {
      if (!item || typeof item !== "object") return false;

      const candidate = item as Partial<CartItem>;

      return (
        typeof candidate.productId === "string" &&
        typeof candidate.slug === "string" &&
        typeof candidate.name === "string" &&
        typeof candidate.price === "number" &&
        typeof candidate.quantity === "number" &&
        typeof candidate.stock === "number"
      );
    })
    .map((item) => ({
      ...item,
      quantity: Math.min(
        Math.max(1, item.quantity),
        Math.max(item.stock, 1)
      ),
      stock: Math.max(0, item.stock),
    }))
    .filter((item) => item.stock > 0);
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hasHydrated, setHasHydrated] = useState(false);

  // 🔹 Cargar desde localStorage
  useEffect(() => {
    try {
      const rawCart = window.localStorage.getItem(CART_STORAGE_KEY);
      if (!rawCart) return;

      const parsed = JSON.parse(rawCart);
      setItems(sanitizeCartItems(parsed));
    } catch {
      window.localStorage.removeItem(CART_STORAGE_KEY);
    } finally {
      setHasHydrated(true);
    }
  }, []);

  // 🔹 Guardar en localStorage
  useEffect(() => {
    if (!hasHydrated) return;

    window.localStorage.setItem(
      CART_STORAGE_KEY,
      JSON.stringify(items)
    );
  }, [items, hasHydrated]);

  const addItem = useCallback((product: CartProductInput) => {
    setItems((prev) => {
      const existing = prev.find(
        (item) => item.productId === product.productId
      );

      if (!existing) {
        if (product.stock <= 0) return prev;

        return [...prev, { ...product, quantity: 1 }];
      }

      return prev.map((item) =>
        item.productId === product.productId
          ? {
              ...item,
              quantity: Math.min(item.quantity + 1, item.stock),
            }
          : item
      );
    });
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems((prev) =>
      prev.filter((item) => item.productId !== productId)
    );
  }, []);

  const updateQuantity = useCallback(
    (productId: string, quantity: number) => {
      if (quantity <= 0) {
        setItems((prev) =>
          prev.filter((item) => item.productId !== productId)
        );
        return;
      }

      setItems((prev) =>
        prev.map((item) =>
          item.productId === productId
            ? {
                ...item,
                quantity: Math.min(quantity, item.stock),
              }
            : item
        )
      );
    },
    []
  );

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const totalItems = useMemo(
    () => items.reduce((acc, item) => acc + item.quantity, 0),
    [items]
  );

  const totalAmount = useMemo(
    () =>
      items.reduce(
        (acc, item) => acc + item.quantity * item.price,
        0
      ),
    [items]
  );

  const value = useMemo(
    () => ({
      items,
      totalItems,
      totalAmount,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
    }),
    [
      items,
      totalItems,
      totalAmount,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
    ]
  );

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart debe usarse dentro de CartProvider");
  }

  return context;
}

export const cartStorageKey = CART_STORAGE_KEY;