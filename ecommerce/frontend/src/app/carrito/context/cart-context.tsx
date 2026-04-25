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
import { authSessionChangedEvent, authStorageKey } from "@/app/auth/context/auth-context";
import {
  addServerCartItem,
  clearServerCart,
  getServerCart,
  removeServerCartItem,
  updateServerCartItem,
} from "@/modules/carrito/services/cart-service";

type CartContextValue = {
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
  addItem: (product: CartProductInput) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
};

type CartMode = "guest" | "server";

const CART_STORAGE_KEY = "ecommerce_cart_items";
const CartContext = createContext<CartContextValue | undefined>(undefined);

function hasAuthSession(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  const raw = window.localStorage.getItem(authStorageKey);
  if (!raw) {
    return false;
  }

  try {
    const parsed = JSON.parse(raw) as { token?: string };
    return Boolean(parsed.token);
  } catch {
    return false;
  }
}

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
      quantity: Math.min(Math.max(1, item.quantity), Math.max(item.stock, 1)),
      stock: Math.max(0, item.stock),
    }))
    .filter((item) => item.stock > 0);
}

function readGuestCart(): CartItem[] {
  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) {
      return [];
    }

    return sanitizeCartItems(JSON.parse(raw));
  } catch {
    window.localStorage.removeItem(CART_STORAGE_KEY);
    return [];
  }
}

function persistGuestCart(items: CartItem[]): void {
  window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
}

function clearGuestCart(): void {
  window.localStorage.removeItem(CART_STORAGE_KEY);
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [mode, setMode] = useState<CartMode>("guest");
  const [hasHydrated, setHasHydrated] = useState(false);

  const applyServerMutation = useCallback((action: Promise<CartItem[]>) => {
    void action.then(setItems).catch(() => undefined);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadCartBySession() {
      const authenticated = hasAuthSession();

      if (!authenticated) {
        if (cancelled) return;
        setMode("guest");
        setItems(readGuestCart());
        setHasHydrated(true);
        return;
      }

      try {
        const guestItems = readGuestCart();

        if (guestItems.length > 0) {
          for (const item of guestItems) {
            await addServerCartItem(item.productId, item.quantity);
          }
          clearGuestCart();
        }

        const serverItems = await getServerCart();

        if (cancelled) return;
        setMode("server");
        setItems(serverItems);
      } catch {
        if (cancelled) return;
        setMode("server");
        setItems([]);
      } finally {
        if (!cancelled) {
          setHasHydrated(true);
        }
      }
    }

    void loadCartBySession();

    const handleAuthChange = () => {
      void loadCartBySession();
    };

    window.addEventListener(authSessionChangedEvent, handleAuthChange);
    return () => {
      cancelled = true;
      window.removeEventListener(authSessionChangedEvent, handleAuthChange);
    };
  }, []);

  useEffect(() => {
    if (!hasHydrated || mode !== "guest") {
      return;
    }

    persistGuestCart(items);
  }, [items, hasHydrated, mode]);

  const addItem = useCallback(
    (product: CartProductInput) => {
      if (mode === "server") {
        applyServerMutation(addServerCartItem(product.productId, 1));
        return;
      }

      setItems((prev) => {
        const existing = prev.find((item) => item.productId === product.productId);

        if (!existing) {
          if (product.stock <= 0) return prev;
          return [...prev, { ...product, quantity: 1 }];
        }

        return prev.map((item) =>
          item.productId === product.productId
            ? { ...item, quantity: Math.min(item.quantity + 1, item.stock) }
            : item,
        );
      });
    },
    [mode, applyServerMutation],
  );

  const removeItem = useCallback(
    (productId: string) => {
      if (mode === "server") {
        applyServerMutation(removeServerCartItem(productId));
        return;
      }

      setItems((prev) => prev.filter((item) => item.productId !== productId));
    },
    [mode, applyServerMutation],
  );

  const updateQuantity = useCallback(
    (productId: string, quantity: number) => {
      if (mode === "server") {
        if (quantity <= 0) {
          applyServerMutation(removeServerCartItem(productId));
          return;
        }

        applyServerMutation(updateServerCartItem(productId, quantity));
        return;
      }

      if (quantity <= 0) {
        setItems((prev) => prev.filter((item) => item.productId !== productId));
        return;
      }

      setItems((prev) =>
        prev.map((item) =>
          item.productId === productId
            ? { ...item, quantity: Math.min(quantity, item.stock) }
            : item,
        ),
      );
    },
    [mode, applyServerMutation],
  );

  const clearCart = useCallback(() => {
    if (mode === "server") {
      void clearServerCart()
        .then(() => setItems([]))
        .catch(() => undefined);
      return;
    }

    setItems([]);
  }, [mode]);

  const totalItems = useMemo(
    () => items.reduce((acc, item) => acc + item.quantity, 0),
    [items],
  );

  const totalAmount = useMemo(
    () => items.reduce((acc, item) => acc + item.quantity * item.price, 0),
    [items],
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
    [items, totalItems, totalAmount, addItem, removeItem, updateQuantity, clearCart],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart debe usarse dentro de CartProvider");
  }

  return context;
}

export const cartStorageKey = CART_STORAGE_KEY;