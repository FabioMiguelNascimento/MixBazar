"use client";

import {
  ArrowRight,
  ClipboardText,
} from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { ServiceBar } from "@/components/service-bar";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { OrderCard } from "@/components/order-card";
import { useBasket } from "@/context/basket";
import { buttonStyles } from "@repo/ui";

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
              className={buttonStyles({
                variant: "primary",
                size: "lg",
                className: "mt-7",
              })}
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
                <OrderCard key={order.id} order={order} />
              ))}
            </ul>
          </>
        )}
      </div>

      <SiteFooter />
    </main>
  );
}
