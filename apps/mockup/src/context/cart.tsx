"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Basket, BasketItem } from "@/context/basket";
import type { Product } from "@/data/catalog";

/* ------------------------------------------------------------------ */
/* Carrinho do mockup — coleciona produtos avulsos e cestas montadas.  */
/* A cesta agrupa e customiza um item; o carrinho junta tudo o que o   */
/* cliente deseja guardar. O pedido continua sendo feito pela cesta.   */
/* ------------------------------------------------------------------ */

export type CartLineKind = "product" | "basket";

export type CartLine = {
  id: string;
  kind: CartLineKind;
  refId: string;
  name: string;
  image: string;
  unitPrice: number;
  qty: number;
  items?: BasketItem[];
};

type CartContextValue = {
  lines: CartLine[];
  count: number;
  subtotal: number;
  addProduct: (product: Product, quantity?: number) => void;
  addBasket: (basket: Basket) => void;
  setQty: (id: string, qty: number) => void;
  removeLine: (id: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

function basketUnitPrice(basket: Basket): number {
  return basket.items.reduce(
    (total, item) => total + item.quantity * item.product.priceValue,
    0,
  );
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);

  const addProduct = useCallback((product: Product, quantity = 1) => {
    const amount = Math.max(1, quantity);
    const id = `product:${product.id}`;
    setLines((current) => {
      const existing = current.find((line) => line.id === id);
      if (existing) {
        return current.map((line) =>
          line.id === id ? { ...line, qty: line.qty + amount } : line,
        );
      }
      return [
        ...current,
        {
          id,
          kind: "product",
          refId: product.id,
          name: product.name,
          image: product.images[0],
          unitPrice: product.priceValue,
          qty: amount,
        },
      ];
    });
  }, []);

  const addBasket = useCallback((basket: Basket) => {
    const id = `basket:${basket.id}`;
    const snapshot = {
      id,
      kind: "basket" as const,
      refId: basket.id,
      name: basket.name,
      image: basket.items[0]?.product.images[0] ?? "",
      unitPrice: basketUnitPrice(basket),
      items: basket.items.map((item) => ({ ...item })),
    };
    setLines((current) => {
      const existing = current.find((line) => line.id === id);
      if (existing) {
        return current.map((line) =>
          line.id === id ? { ...snapshot, qty: line.qty } : line,
        );
      }
      return [...current, { ...snapshot, qty: 1 }];
    });
  }, []);

  const setQty = useCallback((id: string, qty: number) => {
    setLines((current) =>
      current.map((line) =>
        line.id === id ? { ...line, qty: Math.max(1, qty) } : line,
      ),
    );
  }, []);

  const removeLine = useCallback((id: string) => {
    setLines((current) => current.filter((line) => line.id !== id));
  }, []);

  const clear = useCallback(() => {
    setLines([]);
  }, []);

  const { count, subtotal } = useMemo(() => {
    return {
      count: lines.reduce((total, line) => total + line.qty, 0),
      subtotal: lines.reduce(
        (total, line) => total + line.qty * line.unitPrice,
        0,
      ),
    };
  }, [lines]);

  const value = useMemo(
    () => ({
      lines,
      count,
      subtotal,
      addProduct,
      addBasket,
      setQty,
      removeLine,
      clear,
    }),
    [lines, count, subtotal, addProduct, addBasket, setQty, removeLine, clear],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const cart = useContext(CartContext);
  if (!cart) {
    throw new Error("useCart deve ser usado dentro de CartProvider");
  }
  return cart;
}
