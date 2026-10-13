/* ------------------------------------------------------------------ */
/* Dados do painel admin — seeds fixos + pedidos reais da sessão        */
/* Tudo em memória, como o resto do mockup                              */
/* ------------------------------------------------------------------ */

import type { Tone } from "@repo/ui";

export type OrderStatus = "novo" | "preparo" | "pronto" | "entregue";

export type AdminOrderItem = {
  name: string;
  quantity: number;
  priceValue: number | null;
};

export type AdminOrder = {
  id: string;
  number: number;
  customer: string;
  summary: string;
  items: AdminOrderItem[];
  address: string | null;
  total: number;
  couponCode: string | null;
  status: OrderStatus;
  mode: "entrega" | "retirada";
  /** dias atrás (0 = hoje); pedidos da sessão entram com 0 */
  daysAgo: number;
  /** horas parado no status atual (para alertas) */
  hoursStuck: number;
};

export const FUNNEL_STAGES: OrderStatus[] = [
  "novo",
  "preparo",
  "pronto",
  "entregue",
];

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {  novo: "Novo",
  preparo: "Em preparo",
  pronto: "Pronto",
  entregue: "Entregue",
};

export const ORDER_STATUS_TONE: Record<OrderStatus, Tone> = {
  novo: "warning",
  preparo: "info",
  pronto: "lime",
  entregue: "jungle",
};

export const NEXT_STATUS: Partial<Record<OrderStatus, OrderStatus>> = {
  novo: "preparo",
  preparo: "pronto",
  pronto: "entregue",
};

export const PREV_STATUS: Partial<Record<OrderStatus, OrderStatus>> = {
  preparo: "novo",
  pronto: "preparo",
  entregue: "pronto",
};

export function orderTimeLabel(daysAgo: number) {
  return daysAgo === 0 ? "hoje" : `há ${daysAgo}d`;
}

export function orderDate(daysAgo: number) {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return {
    date: date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }),
    relative: orderTimeLabel(daysAgo),
  };
}

export const seedOrders: AdminOrder[] = [
  { id: "seed-101", address: "Rua das Flores, 123 — Centro", number: 101, customer: "Mariana Lopes", summary: "3 itens", items: [{ name: "Cesta Café da Manhã", quantity: 1, priceValue: 89.9 }, { name: "Caneca Artesanal", quantity: 2, priceValue: 34.9 }], total: 159.7, couponCode: "MIX10", status: "novo", mode: "entrega", daysAgo: 0, hoursStuck: 26 },
  { id: "seed-102", address: null, number: 102, customer: "João Pedro Reis", summary: "Kit Presente Especial × 1", items: [{ name: "Kit Presente Especial", quantity: 1, priceValue: 74.9 }], total: 74.9, couponCode: null, status: "novo", mode: "retirada", daysAgo: 0, hoursStuck: 3 },
  { id: "seed-103", address: "Av. Brasil, 456, ap. 12 — Jardim América", number: 103, customer: "Ana Beatriz Cruz", summary: "3 itens", items: [{ name: "Buquê de Rosas Vermelhas", quantity: 2, priceValue: 74.9 }, { name: "Kit Presente Especial", quantity: 1, priceValue: 74.9 }], total: 224.7, couponCode: null, status: "preparo", mode: "entrega", daysAgo: 0, hoursStuck: 5 },
  { id: "seed-104", address: null, number: 104, customer: "Carlos Mota", summary: "Kit Vinho e Queijo × 1", items: [{ name: "Kit Vinho e Queijo", quantity: 1, priceValue: 119.9 }], total: 119.9, couponCode: "PRESENTE5", status: "preparo", mode: "retirada", daysAgo: 1, hoursStuck: 9 },
  { id: "seed-105", address: "Rua XV de Novembro, 789 — Centro", number: 105, customer: "Fernanda Alves", summary: "4 itens", items: [{ name: "Cesta Chá da Tarde", quantity: 1, priceValue: 79.9 }, { name: "Jogo de Canecas Rústicas", quantity: 1, priceValue: 89.9 }, { name: "Kit Papelaria Criativa", quantity: 2, priceValue: 42.9 }], total: 255.6, couponCode: null, status: "pronto", mode: "entrega", daysAgo: 1, hoursStuck: 2 },
  { id: "seed-106", address: "Rua do Comércio, 321 — São José", number: 106, customer: "Rafael Teixeira", summary: "Box Personalizado × 1", items: [{ name: "Box Personalizado", quantity: 1, priceValue: 69.9 }], total: 69.9, couponCode: null, status: "entregue", mode: "entrega", daysAgo: 1, hoursStuck: 0 },
  { id: "seed-107", address: null, number: 107, customer: "Juliana Prates", summary: "Cesta Personalizada × 1", items: [{ name: "Cesta Personalizada", quantity: 1, priceValue: 99.9 }], total: 99.9, couponCode: "MIX10", status: "entregue", mode: "retirada", daysAgo: 2, hoursStuck: 0 },
  { id: "seed-108", address: "Av. das Palmeiras, 654 — Vila Nova", number: 108, customer: "Marcos Vinícius", summary: "Jogo de Canecas Rústicas × 1", items: [{ name: "Jogo de Canecas Rústicas", quantity: 1, priceValue: 89.9 }], total: 89.9, couponCode: null, status: "entregue", mode: "entrega", daysAgo: 3, hoursStuck: 0 },
  { id: "seed-109", address: null, number: 109, customer: "Patrícia Gomes", summary: "3 itens", items: [{ name: "Kit Papelaria Criativa", quantity: 2, priceValue: 42.9 }, { name: "Caneca Artesanal", quantity: 1, priceValue: 34.9 }], total: 120.7, couponCode: null, status: "entregue", mode: "retirada", daysAgo: 5, hoursStuck: 0 },
  { id: "seed-110", address: "Rua Tiradentes, 987 — Bela Vista", number: 110, customer: "Lucas Ferreira", summary: "Caneca Artesanal × 3", items: [{ name: "Caneca Artesanal", quantity: 3, priceValue: 34.9 }], total: 104.7, couponCode: "PRESENTE5", status: "entregue", mode: "entrega", daysAgo: 8, hoursStuck: 0 },
  { id: "seed-111", address: null, number: 111, customer: "Beatriz Rocha", summary: "Kit Escolar Pastel × 1", items: [{ name: "Kit Escolar Pastel", quantity: 1, priceValue: 59.9 }], total: 59.9, couponCode: null, status: "entregue", mode: "retirada", daysAgo: 12, hoursStuck: 0 },
  { id: "seed-112", address: "Rua São João, 147 — Floresta", number: 112, customer: "Thiago Martins", summary: "Buquê de Flores da Semana × 1", items: [{ name: "Buquê de Flores da Semana", quantity: 1, priceValue: 64.9 }], total: 64.9, couponCode: null, status: "entregue", mode: "entrega", daysAgo: 20, hoursStuck: 0 },
  { id: "seed-113", address: "Av. Central, 1000, sala 301 — Centro", number: 113, customer: "Ricardo Almeida", summary: "30 itens", items: [{ name: "Cesta Café da Manhã", quantity: 1, priceValue: 89.9 }, { name: "Buquê de Flores da Semana", quantity: 1, priceValue: 64.9 }, { name: "Kit Presente Especial", quantity: 1, priceValue: 74.9 }, { name: "Kit Papelaria Criativa", quantity: 1, priceValue: 42.9 }, { name: "Cesta Chá da Tarde", quantity: 1, priceValue: 79.9 }, { name: "Buquê de Rosas Vermelhas", quantity: 1, priceValue: 74.9 }, { name: "Kit Vinho e Queijo", quantity: 1, priceValue: 119.9 }, { name: "Kit Escolar Pastel", quantity: 1, priceValue: 59.9 }, { name: "Caneca Artesanal", quantity: 1, priceValue: 34.9 }, { name: "Jogo de Canecas Rústicas", quantity: 1, priceValue: 89.9 }, { name: "Buquê de Girassóis", quantity: 1, priceValue: 69.9 }, { name: "Orquídea Branca", quantity: 1, priceValue: 89.9 }, { name: "Cesta Frutas da Estação", quantity: 1, priceValue: 109.9 }, { name: "Kit Café Especial", quantity: 1, priceValue: 79.9 }, { name: "Caixa de Chocolates", quantity: 1, priceValue: 59.9 }, { name: "Pelúcia Urso", quantity: 1, priceValue: 49.9 }, { name: "Vela Aromática", quantity: 1, priceValue: 39.9 }, { name: "Sabonete Artesanal", quantity: 1, priceValue: 24.9 }, { name: "Kit Banho Relax", quantity: 1, priceValue: 69.9 }, { name: "Garrafa Térmica", quantity: 1, priceValue: 99.9 }, { name: "Agenda 2026", quantity: 1, priceValue: 54.9 }, { name: "Kit Canetas Coloridas", quantity: 1, priceValue: 29.9 }, { name: "Mochila Casual", quantity: 1, priceValue: 129.9 }, { name: "Carteira Couro", quantity: 1, priceValue: 89.9 }, { name: "Lenço de Seda", quantity: 1, priceValue: 45.9 }, { name: "Kit Chás Especiais", quantity: 1, priceValue: 49.9 }, { name: "Mel Artesanal", quantity: 1, priceValue: 32.9 }, { name: "Geleia Gourmet", quantity: 1, priceValue: 28.9 }, { name: "Queijo Minas", quantity: 1, priceValue: 42.9 }, { name: "Vinho Tinto Reserva", quantity: 1, priceValue: 139.9 }], total: 2071.0, couponCode: null, status: "novo", mode: "entrega", daysAgo: 0, hoursStuck: 1 },
];

export type TopProduct = {
  productId: string;
  quantity: number;
};

export const seedTopProducts: TopProduct[] = [
  { productId: "kit-presente", quantity: 18 },
  { productId: "cesta-cafe", quantity: 14 },
  { productId: "buque-rosas", quantity: 11 },
  { productId: "cesta-cha", quantity: 9 },
  { productId: "kit-vinho-queijo", quantity: 7 },
];

export type AdminCampaign = {
  id: string;
  name: string;
  couponCode: string;
  daysLeft: number;
  used: number;
  limit: number;
  status: "ativa" | "agendada" | "encerrada";
};

export const seedCampaigns: AdminCampaign[] = [
  { id: "camp-maes", name: "Dia das Mães", couponCode: "MIX10", daysLeft: 2, used: 34, limit: 100, status: "ativa" },
  { id: "camp-inverno", name: "Festival de Inverno", couponCode: "PRESENTE5", daysLeft: 21, used: 12, limit: 200, status: "ativa" },
  { id: "camp-namorados", name: "Dia dos Namorados", couponCode: "MIX10", daysLeft: 45, used: 0, limit: 150, status: "agendada" },
];

export type Period = "hoje" | "7d" | "30d";

export const PERIOD_DAYS: Record<Period, number> = {
  hoje: 0,
  "7d": 7,
  "30d": 30,
};

export const PERIOD_LABEL: Record<Period, string> = {
  hoje: "Hoje",
  "7d": "Últimos 7 dias",
  "30d": "Últimos 30 dias",
};
