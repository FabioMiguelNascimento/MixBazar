"use client";

import {
  ArrowRight,
  ClipboardText,
  Clock,
} from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { ServiceBar } from "@/components/service-bar";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { formatDateTime, formatPrice, useBasket } from "@/context/basket";

export default function PedidosPage() {
  const { orders } = useBasket();

  return (
    <main className="min-h-svh bg-background text-foreground">
      <ServiceBar />

      <SiteHeader favoritesCount={0} activePath="/pedidos" />

      <div className="mx-auto max-w-7xl px-6">
        {orders.length === 0 ? (
          <div className="flex flex-col items-center py-20 text-center md:py-24">
            <ClipboardText size={56} weight="duotone" className="text-pine" />

            <h1 className="mt-5 font-heading text-2xl font-semibold tracking-tight text-gunmetal md:text-3xl">
              Nenhum pedido ainda
            </h1>

            <p className="mt-3 max-w-sm text-sm leading-6 text-pine/70">
              Monte sua cesta e faça seu primeiro pedido — o Mix Bazar
              confirma tudo pelo atendimento.
            </p>

            <Link
              href="/cesta"
              className="mt-7 inline-flex items-center gap-2 rounded-button bg-jungle px-6 py-3.5 text-sm font-medium text-platinum transition hover:bg-primary-hover active:bg-primary-active"
            >
              Montar minha cesta
              <ArrowRight size={17} />
            </Link>
          </div>
        ) : (
          <>
            <section className="pb-10 pt-12 md:pb-12 md:pt-16">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-jungle">
                Acompanhamento
              </p>

              <h1 className="mt-2 font-heading text-3xl font-semibold tracking-tight text-gunmetal md:text-4xl">
                Meus pedidos
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-pine/70 md:text-base">
                Acompanhe seus pedidos enviados — o Mix Bazar confirma cada
                um pelo atendimento.
              </p>
            </section>

            <ul
              aria-label="Pedidos enviados"
              className="grid gap-4 pb-20 md:pb-24"
            >
              {orders.map((order) => (
                <li
                  key={order.id}
                  className="rounded-card border border-border bg-background transition hover:border-jungle"
                >
                  <Link
                    href={`/pedidos/${order.id}`}
                    aria-label={`Ver detalhes do pedido #${order.number}`}
                    className="block p-6 md:p-7"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="font-heading text-lg font-semibold tracking-tight text-gunmetal">
                          Pedido #{order.number} — {order.name}
                        </p>

                        <p className="mt-1 text-sm text-pine/70">
                          Enviado em {formatDateTime(order.sentAt)} ·{" "}
                          {order.count}{" "}
                          {order.count === 1 ? "item" : "itens"}
                        </p>
                      </div>

                      <span className="inline-flex items-center gap-1.5 rounded-button bg-jungle/10 px-3 py-1.5 text-xs font-semibold text-jungle">
                        <Clock size={12} />
                        Aguardando confirmação
                      </span>
                    </div>

                    <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-5">
                      <div className="flex items-center -space-x-3">
                        {order.items.slice(0, 4).map((item) => (
                          <img
                            key={item.product.id}
                            src={item.product.images[0]}
                            alt={item.product.name}
                            className="size-10 rounded-full object-cover ring-2 ring-background"
                          />
                        ))}

                        {order.items.length > 4 && (
                          <span className="flex size-10 items-center justify-center rounded-full bg-platinum text-xs font-semibold text-pine ring-2 ring-background">
                            +{order.items.length - 4}
                          </span>
                        )}
                      </div>

                      <p className="text-sm text-pine">
                        Total{" "}
                        <span className="font-heading text-base font-semibold text-gunmetal">
                          {formatPrice(order.subtotal)}
                        </span>
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>

      <SiteFooter />
    </main>
  );
}
