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
import type { ComplementOption, Product } from "@/data/catalog";

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

export type ComplementLine = {
  groupId: string;
  option: ComplementOption;
};

export type Basket = {
  id: string;
  name: string;
  items: BasketItem[];
  complements: ComplementLine[];
};

export type OrderProductLine = {
  kind: "product";
  product: Product;
  quantity: number;
};

export type OrderBasketLine = {
  kind: "basket";
  basket: Basket;
  quantity: number;
};

export type OrderLine = OrderProductLine | OrderBasketLine;

export function orderTotals(lines: OrderLine[]): {
  count: number;
  subtotal: number;
} {
  let count = 0;
  let subtotal = 0;
  for (const line of lines) {
    if (line.kind === "product") {
      count += line.quantity;
      subtotal += line.quantity * line.product.priceValue;
    } else {
      for (const item of line.basket.items) {
        count += item.quantity * line.quantity;
        subtotal +=
          item.quantity * line.quantity * item.product.priceValue;
      }
      for (const complement of line.basket.complements) {
        subtotal += complement.option.priceValue * line.quantity;
      }
    }
  }
  return { count, subtotal };
}

export type Order = {
  id: string;
  number: number;
  lines: OrderLine[];
  address: string;
  pickup: boolean;
  couponCode: string | null;
  discount: number;
  count: number;
  subtotal: number;
  sentAt: string;
};

type BasketContextValue = {
  baskets: Basket[];
  activeId: string;
  items: BasketItem[];
  complements: ComplementLine[];
  count: number;
  subtotal: number;
  orders: Order[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (id: string) => void;
  setQuantity: (id: string, quantity: number) => void;
  toggleComplement: (groupId: string, option: ComplementOption) => void;
  removeComplement: (optionId: string) => void;
  createBasket: () => void;
  switchBasket: (id: string) => void;
  renameBasket: (id: string, name: string) => void;
  deleteBasket: (id: string) => void;
  sendActiveBasket: (
    address: string,
    pickup: boolean,
    coupon: { code: string | null; discount: number },
  ) => Order;
  registerOrder: (input: CreateOrderInput) => Order;
};

const FIRST_BASKET_ID = "cesta-1";
const FIRST_BASKET_NAME = "Minha cesta";

export const MAX_BASKETS = 5;

function freshBasket(id: string, name: string): Basket {
  return { id, name, items: [], complements: [] };
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

export type CreateOrderInput = {
  lines: OrderLine[];
  address: string;
  pickup: boolean;
  couponCode: string | null;
  discount: number;
};

export function createOrder(input: CreateOrderInput, number: number): Order {
  const lines: OrderLine[] = input.lines.map((line) =>
    line.kind === "product"
      ? {
          kind: "product",
          product: { ...line.product },
          quantity: line.quantity,
        }
      : {
          kind: "basket",
          basket: {
            ...line.basket,
            items: line.basket.items.map((item) => ({
              quantity: item.quantity,
              product: { ...item.product },
            })),
            complements: line.basket.complements.map((complement) => ({
              groupId: complement.groupId,
              option: { ...complement.option },
            })),
          },
          quantity: line.quantity,
        },
  );
  const { count, subtotal } = orderTotals(lines);
  return {
    id: `pedido-${number}`,
    number,
    lines,
    address: input.address,
    pickup: input.pickup,
    couponCode: input.couponCode,
    discount: input.discount,
    count,
    subtotal,
    sentAt: new Date().toISOString(),
  };
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

  const toggleComplement = useCallback(
    (groupId: string, option: ComplementOption) => {
      setBaskets((current) =>
        current.map((basket) => {
          if (basket.id !== activeId) {
            return basket;
          }
          const selected = basket.complements.some(
            (line) => line.option.id === option.id,
          );
          return {
            ...basket,
            complements: selected
              ? basket.complements.filter(
                  (line) => line.option.id !== option.id,
                )
              : [
                  ...basket.complements.filter(
                    (line) => line.groupId !== groupId,
                  ),
                  { groupId, option },
                ],
          };
        }),
      );
    },
    [activeId],
  );

  const removeComplement = useCallback((optionId: string) => {
    setBaskets((current) =>
      current.map((basket) => ({
        ...basket,
        complements: basket.complements.filter(
          (line) => line.option.id !== optionId,
        ),
      })),
    );
  }, []);

  const registerOrder = useCallback((input: CreateOrderInput) => {
    const number = requestCounter.current;
    requestCounter.current += 1;
    const sent = createOrder(input, number);
    setOrders((current) => [sent, ...current]);
    return sent;
  }, []);

  const sendActiveBasket = useCallback(
    (
      address: string,
      pickup: boolean,
      coupon: { code: string | null; discount: number },
    ) => {
    const target =
      baskets.find((basket) => basket.id === activeId) ?? baskets[0];
    if (!target) {
      throw new Error("Nenhuma cesta ativa para enviar");
    }
    const sent = registerOrder({
      lines: [{ kind: "basket", basket: target, quantity: 1 }],
      address,
      pickup,
      couponCode: coupon.code,
      discount: coupon.discount,
    });

    const remaining = baskets.filter((basket) => basket.id !== target.id);

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
  }, [baskets, activeId, registerOrder]);

  const { items, complements, count, subtotal } = useMemo(() => {
    const active =
      baskets.find((basket) => basket.id === activeId) ?? baskets[0];
    const list = active?.items ?? [];
    const extras = active?.complements ?? [];

    return {
      items: list,
      complements: extras,
      count: list.reduce((total, item) => total + item.quantity, 0),
      subtotal:
        list.reduce(
          (total, item) => total + item.quantity * item.product.priceValue,
          0,
        ) + extras.reduce((total, line) => total + line.option.priceValue, 0),
    };
  }, [baskets, activeId]);

  const value = useMemo(
    () => ({
      baskets,
      activeId,
      items,
      complements,
      count,
      subtotal,
      orders,
      addItem,
      removeItem,
      setQuantity,
      toggleComplement,
      removeComplement,
      createBasket,
      switchBasket,
      renameBasket,
      deleteBasket,
      sendActiveBasket,
      registerOrder,
    }),
    [
      baskets,
      activeId,
      items,
      complements,
      count,
      subtotal,
      orders,
      addItem,
      removeItem,
      setQuantity,
      toggleComplement,
      removeComplement,
      createBasket,
      switchBasket,
      renameBasket,
      deleteBasket,
      sendActiveBasket,
      registerOrder,
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
