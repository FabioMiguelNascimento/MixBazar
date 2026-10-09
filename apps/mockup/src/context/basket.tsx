"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Product } from "@/data/catalog";

/* ------------------------------------------------------------------ */
/* Cesta global do mockup — compartilhada por Home, Catálogo, Detalhe  */
/* e página da cesta                                                   */
/* ------------------------------------------------------------------ */

export type BasketItem = {
  product: Product;
  quantity: number;
};

type BasketContextValue = {
  items: BasketItem[];
  count: number;
  subtotal: number;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (id: string) => void;
  setQuantity: (id: string, quantity: number) => void;
  clear: () => void;
};

const BasketContext = createContext<BasketContextValue | null>(null);

export function BasketProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<BasketItem[]>([]);

  const addItem = useCallback((product: Product, quantity = 1) => {
    const amount = Math.max(1, quantity);

    setItems((current) => {
      const existing = current.find((item) => item.product.id === product.id);

      if (!existing) {
        return [...current, { product, quantity: amount }];
      }

      return current.map((item) =>
        item.product.id === product.id
          ? { ...item, quantity: item.quantity + amount }
          : item,
      );
    });
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((current) =>
      current.filter((item) => item.product.id !== id),
    );
  }, []);

  const setQuantity = useCallback((id: string, quantity: number) => {
    setItems((current) =>
      current.map((item) =>
        item.product.id === id
          ? { ...item, quantity: Math.max(1, quantity) }
          : item,
      ),
    );
  }, []);

  const clear = useCallback(() => {
    setItems([]);
  }, []);

  const { count, subtotal } = useMemo(
    () => ({
      count: items.reduce((total, item) => total + item.quantity, 0),
      subtotal: items.reduce(
        (total, item) => total + item.quantity * item.product.priceValue,
        0,
      ),
    }),
    [items],
  );

  const value = useMemo(
    () => ({
      items,
      count,
      subtotal,
      addItem,
      removeItem,
      setQuantity,
      clear,
    }),
    [items, count, subtotal, addItem, removeItem, setQuantity, clear],
  );

  return (
    <BasketContext.Provider value={value}>{children}</BasketContext.Provider>
  );
}

export function useBasket(): BasketContextValue {
  const basket = useContext(BasketContext);

  if (!basket) {
    throw new Error("useBasket deve ser usado dentro de BasketProvider");
  }

  return basket;
}

export function formatPrice(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}
