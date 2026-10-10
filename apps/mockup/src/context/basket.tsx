"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { Product } from "@/data/catalog";

/* ------------------------------------------------------------------ */
/* Cestas do mockup — vários rascunhos nomeados por comprador, com uma */
/* cesta ativa. Home, Catálogo e Detalhe somem sempre na ativa, por    */
/* isso a API de leitura (items/count/subtotal/addItem) não mudou.     */
/* Envios viram pedidos registrados no histórico.                      */
/* ------------------------------------------------------------------ */

export type BasketItem = {
  product: Product;
  quantity: number;
};

export type Basket = {
  id: string;
  name: string;
  items: BasketItem[];
};

export type Order = {
  id: string;
  number: number;
  name: string;
  items: BasketItem[];
  count: number;
  subtotal: number;
  sentAt: string;
};

type BasketContextValue = {
  baskets: Basket[];
  activeId: string;
  items: BasketItem[];
  count: number;
  subtotal: number;
  orders: Order[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (id: string) => void;
  setQuantity: (id: string, quantity: number) => void;
  createBasket: () => void;
  switchBasket: (id: string) => void;
  renameBasket: (id: string, name: string) => void;
  deleteBasket: (id: string) => void;
  sendActiveBasket: () => Order;
};

const FIRST_BASKET_ID = "cesta-1";
const FIRST_BASKET_NAME = "Minha cesta";

export const MAX_BASKETS = 5;

function freshBasket(id: string, name: string): Basket {
  return { id, name, items: [] };
}

function updateItems(
  baskets: Basket[],
  id: string,
  update: (items: BasketItem[]) => BasketItem[],
): Basket[] {
  return baskets.map((basket) =>
    basket.id === id ? { ...basket, items: update(basket.items) } : basket,
  );
}

const BasketContext = createContext<BasketContextValue | null>(null);

export function BasketProvider({ children }: { children: ReactNode }) {
  const [baskets, setBaskets] = useState<Basket[]>(() => [
    freshBasket(FIRST_BASKET_ID, FIRST_BASKET_NAME),
  ]);
  const [activeId, setActiveId] = useState(FIRST_BASKET_ID);
  const [orders, setOrders] = useState<Order[]>([]);
  const counter = useRef(2);
  const requestCounter = useRef(1);

  const addItem = useCallback(
    (product: Product, quantity = 1) => {
      const amount = Math.max(1, quantity);

      setBaskets((current) =>
        updateItems(current, activeId, (items) => {
          const existing = items.find(
            (item) => item.product.id === product.id,
          );

          if (!existing) {
            return [...items, { product, quantity: amount }];
          }

          return items.map((item) =>
            item.product.id === product.id
              ? { ...item, quantity: item.quantity + amount }
              : item,
          );
        }),
      );
    },
    [activeId],
  );

  const removeItem = useCallback(
    (id: string) => {
      setBaskets((current) =>
        updateItems(current, activeId, (items) =>
          items.filter((item) => item.product.id !== id),
        ),
      );
    },
    [activeId],
  );

  const setQuantity = useCallback(
    (id: string, quantity: number) => {
      setBaskets((current) =>
        updateItems(current, activeId, (items) =>
          items.map((item) =>
            item.product.id === id
              ? { ...item, quantity: Math.max(1, quantity) }
              : item,
          ),
        ),
      );
    },
    [activeId],
  );

  const createBasket = useCallback(() => {
    if (baskets.length >= MAX_BASKETS) {
      return;
    }

    const n = counter.current;
    counter.current += 1;
    const id = `cesta-${n}`;

    setBaskets([...baskets, freshBasket(id, `Cesta ${n}`)]);
    setActiveId(id);
  }, [baskets]);

  const switchBasket = useCallback((id: string) => {
    setActiveId(id);
  }, []);

  const renameBasket = useCallback((id: string, name: string) => {
    const trimmed = name.trim();

    if (!trimmed) {
      return;
    }

    setBaskets((current) =>
      current.map((basket) =>
        basket.id === id ? { ...basket, name: trimmed } : basket,
      ),
    );
  }, []);

  const deleteBasket = useCallback(
    (id: string) => {
      if (baskets.length <= 1) {
        setBaskets(updateItems(baskets, id, () => []));
        return;
      }

      const remaining = baskets.filter((basket) => basket.id !== id);
      setBaskets(remaining);

      if (id === activeId) {
        const first = remaining[0];

        if (first) {
          setActiveId(first.id);
        }
      }
    },
    [baskets, activeId],
  );

  const sendActiveBasket = useCallback(() => {
    const target =
      baskets.find((basket) => basket.id === activeId) ?? baskets[0];
    const targetItems = target?.items ?? [];
    const number = requestCounter.current;
    requestCounter.current += 1;

    const sent: Order = {
      id: `pedido-${number}`,
      number,
      name: target?.name ?? FIRST_BASKET_NAME,
      items: targetItems,
      count: targetItems.reduce((total, item) => total + item.quantity, 0),
      subtotal: targetItems.reduce(
        (total, item) => total + item.quantity * item.product.priceValue,
        0,
      ),
      sentAt: new Date().toISOString(),
    };
    setOrders((current) => [sent, ...current]);

    const remaining = baskets.filter((basket) => basket.id !== target?.id);

    if (remaining.length === 0) {
      // Lista vazia: reutilizar o id inicial é seguro e preserva a numeração.
      const fresh = freshBasket(FIRST_BASKET_ID, FIRST_BASKET_NAME);
      setBaskets([fresh]);
      setActiveId(fresh.id);
    } else {
      setBaskets(remaining);

      const first = remaining[0];

      if (first) {
        setActiveId(first.id);
      }
    }

    return sent;
  }, [baskets, activeId]);

  const { items, count, subtotal } = useMemo(() => {
    const active =
      baskets.find((basket) => basket.id === activeId) ?? baskets[0];
    const list = active?.items ?? [];

    return {
      items: list,
      count: list.reduce((total, item) => total + item.quantity, 0),
      subtotal: list.reduce(
        (total, item) => total + item.quantity * item.product.priceValue,
        0,
      ),
    };
  }, [baskets, activeId]);

  const value = useMemo(
    () => ({
      baskets,
      activeId,
      items,
      count,
      subtotal,
      orders,
      addItem,
      removeItem,
      setQuantity,
      createBasket,
      switchBasket,
      renameBasket,
      deleteBasket,
      sendActiveBasket,
    }),
    [
      baskets,
      activeId,
      items,
      count,
      subtotal,
      orders,
      addItem,
      removeItem,
      setQuantity,
      createBasket,
      switchBasket,
      renameBasket,
      deleteBasket,
      sendActiveBasket,
    ],
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

export function formatDateTime(iso: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}
