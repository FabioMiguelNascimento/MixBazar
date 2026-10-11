/* ------------------------------------------------------------------ */
/* Dados do painel admin — seeds fixos + pedidos reais da sessão        */
/* Tudo em memória, como o resto do mockup                              */
/* ------------------------------------------------------------------ */

export type OrderStatus = "novo" | "preparo" | "pronto" | "entregue";

export type AdminOrder = {
  id: string;
  number: number;
  customer: string;
  summary: string;
  total: number;
  couponCode: string | null;
  status: OrderStatus;
  /** dias atrás (0 = hoje); pedidos da sessão entram com 0 */
  daysAgo: number;
  /** horas parado no status atual (para alertas) */
  hoursStuck: number;
};

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  novo: "Novo",
  preparo: "Em preparo",
  pronto: "Pronto",
  entregue: "Entregue",
};

export const FUNNEL_STAGES: OrderStatus[] = [
  "novo",
  "preparo",
  "pronto",
  "entregue",
];

export const seedOrders: AdminOrder[] = [
  { id: "seed-101", number: 101, customer: "Mariana Lopes", summary: "Cesta Café da Manhã × 1", total: 97.9, couponCode: "MIX10", status: "novo", daysAgo: 0, hoursStuck: 26 },
  { id: "seed-102", number: 102, customer: "João Pedro Reis", summary: "Kit Presente Especial × 1", total: 74.9, couponCode: null, status: "novo", daysAgo: 0, hoursStuck: 3 },
  { id: "seed-103", number: 103, customer: "Ana Beatriz Cruz", summary: "Buquê de Rosas Vermelhas × 2", total: 149.8, couponCode: null, status: "preparo", daysAgo: 0, hoursStuck: 5 },
  { id: "seed-104", number: 104, customer: "Carlos Mota", summary: "Kit Vinho e Queijo × 1", total: 119.9, couponCode: "PRESENTE5", status: "preparo", daysAgo: 1, hoursStuck: 9 },
  { id: "seed-105", number: 105, customer: "Fernanda Alves", summary: "Cesta Chá da Tarde × 1", total: 79.9, couponCode: null, status: "pronto", daysAgo: 1, hoursStuck: 2 },
  { id: "seed-106", number: 106, customer: "Rafael Teixeira", summary: "Box Personalizado × 1", total: 69.9, couponCode: null, status: "entregue", daysAgo: 1, hoursStuck: 0 },
  { id: "seed-107", number: 107, customer: "Juliana Prates", summary: "Cesta Personalizada × 1", total: 99.9, couponCode: "MIX10", status: "entregue", daysAgo: 2, hoursStuck: 0 },
  { id: "seed-108", number: 108, customer: "Marcos Vinícius", summary: "Jogo de Canecas Rústicas × 1", total: 89.9, couponCode: null, status: "entregue", daysAgo: 3, hoursStuck: 0 },
  { id: "seed-109", number: 109, customer: "Patrícia Gomes", summary: "Kit Papelaria Criativa × 2", total: 85.8, couponCode: null, status: "entregue", daysAgo: 5, hoursStuck: 0 },
  { id: "seed-110", number: 110, customer: "Lucas Ferreira", summary: "Caneca Artesanal × 3", total: 104.7, couponCode: "PRESENTE5", status: "entregue", daysAgo: 8, hoursStuck: 0 },
  { id: "seed-111", number: 111, customer: "Beatriz Rocha", summary: "Kit Escolar Pastel × 1", total: 59.9, couponCode: null, status: "entregue", daysAgo: 12, hoursStuck: 0 },
  { id: "seed-112", number: 112, customer: "Thiago Martins", summary: "Buquê de Flores da Semana × 1", total: 64.9, couponCode: null, status: "entregue", daysAgo: 20, hoursStuck: 0 },
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
