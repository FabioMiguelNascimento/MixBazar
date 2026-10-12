"use client";

import Link from "next/link";
import {
  ArrowRight,
  Bell,
  CheckCircle,
  CookingPot,
  Megaphone,
  Storefront,
  Tag,
  Truck,
  Warning,
} from "@phosphor-icons/react/dist/ssr";
import { AdminPageHeader } from "@/components/admin-page-header";
import { AdminShell } from "@/components/admin-shell";
import { RevenueChart as RevenueChartUI } from "@repo/ui";
import { ButtonGroup } from "@repo/ui";
import { useAdmin } from "@/context/admin";
import { formatPrice } from "@/context/basket";
import {
  ORDER_STATUS_LABEL,
  PERIOD_LABEL,
  seedCampaigns,
  type OrderStatus,
  type Period,
} from "@/data/admin";
import { products } from "@/data/catalog";

const STAGE_ICON: Record<OrderStatus, typeof Bell> = {
  novo: Bell,
  preparo: CookingPot,
  pronto: CheckCircle,
  entregue: Truck,
};

const PERIODS: Period[] = ["hoje", "7d", "30d"];

const MODE_ICON = {
  entrega: Truck,
  retirada: Storefront,
} as const;

const MODE_LABEL = {
  entrega: "Entrega",
  retirada: "Retirada",
} as const;

const CARD = "mb-8 break-inside-avoid min-w-0";

const CARD_TITLE =
  "font-heading text-lg font-semibold tracking-tight text-gunmetal";

const ALERTS_LIMIT = 2;
const ACTIVITY_LIMIT = 4;
const UPCOMING_LIMIT = 4;

function SeeAll({ label, href }: { label: string; href: string }) {
  return (
    <Link
      href={href}
      className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-jungle transition hover:text-pine"
    >
      {label}
      <ArrowRight size={14} />
    </Link>
  );
}

function RevenueChart() {
  const { revenueByDay, revenue } = useAdmin();

  return (
    <section aria-label="Receita dos últimos 7 dias" className={CARD}>
      <div className="flex flex-wrap items-end justify-between gap-2">
        <h2 className={CARD_TITLE}>Receita</h2>
        <p className="text-sm text-pine/70">
          {formatPrice(revenue)} nos últimos 7 dias
        </p>
      </div>

      <div className="mt-4 min-w-0">
        <RevenueChartUI
          data={revenueByDay}
          ariaLabel={`Receita por dia: ${revenueByDay.map((day) => `${day.label} ${formatPrice(day.value)}`).join(", ")}`}
        />
      </div>
    </section>
  );
}

function Alerts() {
  const { alerts } = useAdmin();
  if (alerts.length === 0) return null;
  const visible = alerts.slice(0, ALERTS_LIMIT);

  return (
    <section aria-label="Alertas" id="alertas" className={`${CARD} scroll-mt-24`}>
      <h2 className={CARD_TITLE}>Alertas</h2>

      <ul className="mt-4 min-w-0 space-y-2">
        {visible.map((alert) => (
          <li
            key={alert.id}
            className="flex min-w-0 items-center gap-3 rounded-input border border-warning/30 bg-warning/10 px-3 py-2 text-sm"
          >
            <Warning
              size={16}
              className="shrink-0 text-warning"
              weight="duotone"
            />
            <span className="min-w-0 flex-1 truncate text-gunmetal">
              {alert.text}
            </span>
            <Link
              href={alert.href}
              className="inline-flex shrink-0 items-center gap-1 font-medium text-jungle transition hover:text-pine"
            >
              {alert.linkLabel}
              <ArrowRight size={14} />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Upcoming() {
  const { upcoming } = useAdmin();
  const visible = upcoming.slice(0, UPCOMING_LIMIT);

  return (
    <section aria-label="Próximas entregas e retiradas" className={CARD}>
      <h2 className={CARD_TITLE}>Próximas entregas e retiradas</h2>

      {upcoming.length === 0 ? (
        <p className="mt-4 text-sm text-pine/70">
          Nenhuma entrega ou retirada pendente.
        </p>
      ) : (
        <ol className="mt-4 min-w-0 space-y-3">
          {visible.map((order) => {
            const Icon = MODE_ICON[order.mode];

            return (
              <li
                key={order.id}
                className="flex min-w-0 items-center gap-3"
              >
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-platinum text-pine">
                  <Icon size={16} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium text-gunmetal">
                    Pedido #{order.number} · {order.customer}
                  </span>
                  <span className="mt-0.5 block truncate text-xs leading-5 text-pine/70">
                    {order.summary} · {ORDER_STATUS_LABEL[order.status]} ·{" "}
                    {MODE_LABEL[order.mode]} · {order.timeLabel}
                  </span>
                </span>
              </li>
            );
          })}
        </ol>
      )}

      {upcoming.length > UPCOMING_LIMIT && (
        <SeeAll label="Ver todos os pedidos" href="/admin/pedidos" />
      )}
    </section>
  );
}

function TopProducts() {
  const { topProducts } = useAdmin();
  const max = Math.max(1, ...topProducts.map((item) => item.quantity));

  return (
    <section aria-label="Produtos mais pedidos" className={CARD}>
      <h2 className={CARD_TITLE}>Mais pedidos</h2>

      <ol className="mt-4 space-y-3">
        {topProducts.map((item, index) => {
          const product = products.find((entry) => entry.id === item.productId);
          if (!product) return null;

          return (
            <li key={item.productId} className="flex min-w-0 items-center gap-3">
              <span className="w-5 shrink-0 font-heading text-sm font-semibold text-pine/60">
                {index + 1}
              </span>
              <img
                src={product.images[0]}
                alt=""
                className="size-10 shrink-0 rounded-input bg-platinum object-cover"
              />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium text-gunmetal">
                  {product.name}
                </span>
                <span
                  aria-hidden="true"
                  className="mt-1 block h-1 overflow-hidden rounded-full bg-muted"
                >
                  <span
                    className="block h-full rounded-full bg-jungle"
                    style={{ width: `${Math.round((item.quantity / max) * 100)}%` }}
                  />
                </span>
              </span>
              <span className="shrink-0 text-sm font-semibold text-gunmetal">
                {item.quantity}
              </span>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

function Activity() {
  const { activity } = useAdmin();
  const visible = activity.slice(0, ACTIVITY_LIMIT);

  return (
    <section aria-label="Atividade recente" className={CARD}>
      <h2 className={CARD_TITLE}>Atividade recente</h2>

      {activity.length === 0 ? (
        <p className="mt-4 text-sm text-pine/70">
          Nenhuma atividade no período.
        </p>
      ) : (
        <ol className="mt-4 space-y-3">
          {visible.map((event) => {
            const Icon =
              event.status === null ? Bell : STAGE_ICON[event.status];

            return (
              <li key={event.id} className="flex min-w-0 items-start gap-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-platinum text-pine">
                  <Icon size={16} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium text-gunmetal">
                    {event.text}
                  </span>
                  <span className="mt-0.5 block text-xs leading-5 text-pine/70">
                    {event.detail} · {event.time}
                  </span>
                </span>
              </li>
            );
          })}
        </ol>
      )}

      {activity.length > ACTIVITY_LIMIT && (
        <SeeAll label="Ver toda a atividade" href="/admin/pedidos" />
      )}
    </section>
  );
}

function Campaigns() {
  const active = seedCampaigns.filter(
    (campaign) => campaign.status === "ativa",
  );
  if (active.length === 0) return null;

  return (
    <section aria-label="Campanhas ativas" className={CARD}>
      <h2 className={CARD_TITLE}>Campanhas ativas</h2>

      <div className="mt-4 min-w-0 space-y-3">
        {active.map((campaign) => {
          const usedPct = Math.min(
            100,
            Math.round((campaign.used / Math.max(1, campaign.limit)) * 100),
          );

          return (
            <article
              key={campaign.id}
              className="min-w-0 rounded-card border border-border bg-background p-4"
            >
              <p className="flex min-w-0 items-center gap-2">
                <Megaphone size={16} className="shrink-0 text-jungle" />
                <span className="min-w-0 flex-1 truncate font-heading text-base font-semibold tracking-tight text-gunmetal">
                  {campaign.name}
                </span>
                <span className="shrink-0 rounded-full bg-lime/20 px-2.5 py-0.5 text-xs font-semibold text-pine">
                  {campaign.daysLeft === 1
                    ? "Último dia"
                    : `Faltam ${campaign.daysLeft} dias`}
                </span>
              </p>
              <p className="mt-2 flex items-center gap-1.5 text-sm text-pine">
                <Tag size={14} className="shrink-0 text-pine/60" weight="bold" />
                <span className="font-semibold text-gunmetal">
                  {campaign.couponCode}
                </span>
                <span aria-hidden="true">·</span>
                <span>
                  {campaign.used}/{campaign.limit} usados
                </span>
                <span className="ml-auto font-heading font-semibold text-gunmetal">
                  {usedPct}%
                </span>
              </p>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default function AdminDashboardPage() {
  const { period, setPeriod } = useAdmin();

  return (
    <AdminShell active="Dashboard" title="Visão geral">
      <AdminPageHeader
        actions={
          <ButtonGroup
            orientation="horizontal"
            aria-label="Período"
            className="justify-end"
          >
            {PERIODS.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setPeriod(option)}
                aria-pressed={period === option}
                className={`shrink-0 rounded-button border px-4 py-2 text-sm font-medium transition ${
                  period === option
                    ? "border-jungle bg-jungle text-platinum"
                    : "border-border bg-background text-gunmetal hover:border-jungle"
                }`}
              >
                {PERIOD_LABEL[option]}
              </button>
            ))}
          </ButtonGroup>
        }
      />

      <div className="mt-10 min-w-0 columns-1 gap-6 md:columns-2">
        <RevenueChart />
        <Alerts />
        <Upcoming />
        <TopProducts />
        <Activity />
        <Campaigns />
      </div>
    </AdminShell>
  );
}
