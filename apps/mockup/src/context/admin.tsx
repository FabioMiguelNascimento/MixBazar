"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useBasket, type Order } from "@/context/basket";
import { useCustomer } from "@/context/customer";
import {
  FUNNEL_STAGES,
  PERIOD_DAYS,
  seedCampaigns,
  seedOrders,
  type AdminCampaign,
  type AdminOrder,
  type OrderStatus,
  type Period,
  type TopProduct,
} from "@/data/admin";
import { seedTopProducts } from "@/data/admin";

export type ActivityEvent = {
  id: string;
  text: string;
  detail: string;
  time: string;
  status: OrderStatus | null;
};

export type Alert = {
  id: string;
  text: string;
  href: string;
  linkLabel: string;
};

type AdminContextValue = {
  period: Period;
  setPeriod: (period: Period) => void;
  statusFilter: OrderStatus | null;
  toggleStatusFilter: (status: OrderStatus) => void;
  funnel: { status: OrderStatus; count: number; value: number }[];
  revenue: number;
  confirmedCount: number;
  ticket: number;
  pendingCount: number;
  topProducts: TopProduct[];
  activity: ActivityEvent[];
  alerts: Alert[];
  campaigns: AdminCampaign[];
};

const AdminContext = createContext<AdminContextValue | null>(null);

function sessionOrderToAdmin(order: Order, customer: string): AdminOrder {
  return {
    id: order.id,
    number: order.number,
    customer,
    summary: `${order.count} ${order.count === 1 ? "item" : "itens"}`,
    total: Math.max(0, order.subtotal - order.discount),
    couponCode: order.couponCode,
    status: "novo",
    daysAgo: 0,
    hoursStuck: 0,
  };
}

export function AdminProvider({ children }: { children: ReactNode }) {
  const { orders } = useBasket();
  const { profile } = useCustomer();
  const [period, setPeriod] = useState<Period>("7d");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | null>(null);

  const toggleStatusFilter = useCallback((status: OrderStatus) => {
    setStatusFilter((current) => (current === status ? null : status));
  }, []);

  const allOrders = useMemo<AdminOrder[]>(() => {
    const session = orders.map((order) =>
      sessionOrderToAdmin(order, profile.name),
    );
    return [...session, ...seedOrders];
  }, [orders, profile.name]);

  const visibleOrders = useMemo(
    () => allOrders.filter((order) => order.daysAgo <= PERIOD_DAYS[period]),
    [allOrders, period],
  );

  const funnel = useMemo(
    () =>
      FUNNEL_STAGES.map((status) => {
        const stage = visibleOrders.filter((order) => order.status === status);
        return {
          status,
          count: stage.length,
          value: stage.reduce((total, order) => total + order.total, 0),
        };
      }),
    [visibleOrders],
  );

  const confirmed = useMemo(
    () => visibleOrders.filter((order) => order.status !== "novo"),
    [visibleOrders],
  );
  const revenue = confirmed.reduce((total, order) => total + order.total, 0);
  const confirmedCount = confirmed.length;
  const ticket = confirmedCount > 0 ? revenue / confirmedCount : 0;
  const pendingCount = funnel[0]?.count ?? 0;

  const activity = useMemo<ActivityEvent[]>(() => {
    const events: ActivityEvent[] = visibleOrders.map((order) => ({
      id: `order-${order.id}`,
      text: `Pedido #${order.number} · ${order.customer}`,
      detail: `${order.summary} · ${ORDER_STATUS_LABEL_SHORT[order.status]}`,
      time: order.daysAgo === 0 ? "hoje" : `há ${order.daysAgo}d`,
      status: order.status,
    }));
    const filtered =
      statusFilter === null
        ? events
        : events.filter((event) => event.status === statusFilter);
    return filtered.slice(0, 8);
  }, [visibleOrders, statusFilter]);

  const alerts = useMemo<Alert[]>(() => {
    const found: Alert[] = [];
    const stuck = visibleOrders.filter(
      (order) => order.status === "novo" && order.hoursStuck >= 24,
    );
    if (stuck.length > 0) {
      found.push({
        id: "stuck",
        text: `${stuck.length} ${stuck.length === 1 ? "pedido parado" : "pedidos parados"} sem confirmação há mais de 24h.`,
        href: "/mockup/admin",
        linkLabel: "Ver pedidos",
      });
    }
    const expiring = seedCampaigns.filter(
      (campaign) => campaign.status === "ativa" && campaign.daysLeft <= 3,
    );
    for (const campaign of expiring) {
      found.push({
        id: `expiring-${campaign.id}`,
        text: `Campanha ${campaign.name} termina em ${campaign.daysLeft} dias.`,
        href: "/mockup/admin",
        linkLabel: "Ver campanhas",
      });
    }
    const hot = seedCampaigns.filter(
      (campaign) => campaign.limit > 0 && campaign.used / campaign.limit >= 0.8,
    );
    for (const campaign of hot) {
      found.push({
        id: `hot-${campaign.id}`,
        text: `Cupom ${campaign.couponCode} acima de 80% do uso.`,
        href: "/mockup/admin",
        linkLabel: "Ver cupons",
      });
    }
    return found;
  }, [visibleOrders]);

  const value: AdminContextValue = {
    period,
    setPeriod,
    statusFilter,
    toggleStatusFilter,
    funnel,
    revenue,
    confirmedCount,
    ticket,
    pendingCount,
    topProducts: seedTopProducts,
    activity,
    alerts,
    campaigns: seedCampaigns,
  };

  return (
    <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
  );
}

const ORDER_STATUS_LABEL_SHORT: Record<OrderStatus, string> = {
  novo: "aguardando confirmação",
  preparo: "em preparo",
  pronto: "pronto",
  entregue: "entregue",
};

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === null) {
    throw new Error("useAdmin deve ser usado dentro de AdminProvider");
  }
  return context;
}
